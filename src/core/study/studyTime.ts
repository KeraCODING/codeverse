// Study-time tracking. Time counts while the CODEVERSE window is visible AND the learner has
// interacted (key, click, scroll, touch) within the last two minutes, so a window left open
// overnight does not inflate the numbers. No polling while the window is hidden: the tick timer
// runs only when the page is visible, and seconds are saved once a minute and when leaving.
import type { Storage, StoredItem } from "../storage/types";

export interface StudyDay extends StoredItem {
  id: string; // local calendar day, YYYY-MM-DD
  seconds: number;
}

export const IDLE_MS = 2 * 60_000;
export const TICK_MS = 15_000;
/** One tick never adds more than this (protects against sleep/resume jumps). */
export const MAX_STEP_MS = 30_000;
const SAVE_EVERY_MS = 60_000;

export function dayKey(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shiftDay(t: number, days: number): number {
  const d = new Date(t);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/** The last `n` local days ending today, oldest first, with 0 for days without study. */
export function lastDays(byDay: ReadonlyMap<string, number>, n: number, now: number): { key: string; seconds: number }[] {
  const out: { key: string; seconds: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const key = dayKey(shiftDay(now, -i));
    out.push({ key, seconds: byDay.get(key) ?? 0 });
  }
  return out;
}

/**
 * Consecutive days on which the daily goal was reached. Today counts once it is reached; until
 * then the streak continues from yesterday (it is not broken before the day is over).
 */
export function goalStreak(byDay: ReadonlyMap<string, number>, goalSeconds: number, now: number): number {
  const met = (t: number) => (byDay.get(dayKey(t)) ?? 0) >= goalSeconds;
  let t = met(now) ? now : shiftDay(now, -1);
  let n = 0;
  while (met(t) && n < 3660) {
    n++;
    t = shiftDay(t, -1);
  }
  return n;
}

/** Pure step: how many milliseconds of study one tick adds. */
export function studyStep(now: number, lastTick: number, lastActive: number, visible: boolean): number {
  if (!visible || now - lastActive > IDLE_MS || now <= lastTick) return 0;
  return Math.min(now - lastTick, MAX_STEP_MS);
}

// ---- Tracker (one per app) ----

type Listener = () => void;

export interface StudyTracker {
  /** Seconds studied per day, including today's unsaved seconds. */
  snapshot(): ReadonlyMap<string, number>;
  subscribe(fn: Listener): () => void;
  /** Forgets all study time (Settings → Privacy → clear activity). */
  reset(): Promise<void>;
  stop(): void;
}

export function startStudyTracker(storage: Storage, clock: () => number = Date.now): StudyTracker {
  const byDay = new Map<string, number>();
  const listeners = new Set<Listener>();
  let lastActive = clock();
  let lastTick = clock();
  let carryMs = 0; // sub-second remainder
  let unsavedSince = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let stopped = false;
  const dirty = new Set<string>();

  const notify = () => listeners.forEach((l) => l());

  const save = async () => {
    const keys = [...dirty];
    dirty.clear();
    unsavedSince = 0;
    for (const key of keys) {
      const item: StudyDay = { id: key, seconds: byDay.get(key) ?? 0, updatedAt: clock() };
      await storage.putItem("study", item).catch(() => dirty.add(key));
    }
  };

  const tick = () => {
    const now = clock();
    const visible = typeof document === "undefined" || document.visibilityState === "visible";
    const ms = studyStep(now, lastTick, lastActive, visible) + carryMs;
    lastTick = now;
    const secs = Math.floor(ms / 1000);
    carryMs = ms - secs * 1000;
    if (secs > 0) {
      const key = dayKey(now);
      byDay.set(key, (byDay.get(key) ?? 0) + secs);
      dirty.add(key);
      if (!unsavedSince) unsavedSince = now;
      notify();
    }
    if (unsavedSince && now - unsavedSince >= SAVE_EVERY_MS) void save();
  };

  const startTimer = () => {
    if (timer || stopped) return;
    lastTick = clock();
    timer = setInterval(tick, TICK_MS);
  };
  const stopTimer = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  let lastMark = 0;
  const onInput = () => {
    const now = clock();
    if (now - lastMark < 1000) return; // cheap throttle for mousemove/scroll storms
    lastMark = now;
    // Returning after a long pause starts a new counting period instead of back-filling the gap.
    if (now - lastActive > IDLE_MS) {
      lastTick = now;
      carryMs = 0;
    }
    lastActive = now;
  };
  const onVisibility = () => {
    if (document.visibilityState === "visible") {
      lastActive = clock();
      startTimer();
    } else {
      tick();
      stopTimer();
      void save();
    }
  };
  const onLeave = () => {
    tick();
    void save();
  };

  const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll", "mousemove"] as const;
  if (typeof window !== "undefined") {
    for (const e of events) window.addEventListener(e, onInput, { passive: true, capture: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onLeave);
    if (document.visibilityState === "visible") startTimer();
  }

  void storage
    .listItems<StudyDay>("study")
    .then((rows) => {
      for (const r of rows) {
        if (typeof r.seconds !== "number" || !/^\d{4}-\d{2}-\d{2}$/.test(r.id)) continue;
        // Seconds counted before the stored rows arrived are added on top, not overwritten.
        byDay.set(r.id, (byDay.get(r.id) ?? 0) + Math.max(0, Math.floor(r.seconds)));
      }
      notify();
    })
    .catch(() => {});

  return {
    snapshot: () => byDay,
    subscribe(fn) {
      listeners.add(fn);
      return () => void listeners.delete(fn);
    },
    async reset() {
      byDay.clear();
      dirty.clear();
      carryMs = 0;
      unsavedSince = 0;
      notify();
      await storage.clearCollection("study").catch(() => {});
    },
    stop() {
      if (stopped) return;
      tick();
      void save();
      stopped = true;
      stopTimer();
      if (typeof window !== "undefined") {
        for (const e of events) window.removeEventListener(e, onInput, { capture: true });
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", onLeave);
      }
      listeners.clear();
    },
  };
}
