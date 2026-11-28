import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dayKey, goalStreak, IDLE_MS, lastDays, MAX_STEP_MS, startStudyTracker, studyStep, TICK_MS, type StudyDay } from "./studyTime";
import { createMemoryStorage } from "../storage/memory";

const at = (s: string) => new Date(s).getTime();

describe("study time — pure rules", () => {
  it("uses the local calendar day", () => {
    expect(dayKey(at("2026-11-28T00:05:00"))).toBe("2026-11-28");
    expect(dayKey(at("2026-11-27T23:59:59"))).toBe("2026-11-27");
  });

  it("counts only visible, recently active time and caps sleep/resume jumps", () => {
    const now = 1_000_000;
    expect(studyStep(now, now - 15_000, now - 1_000, true)).toBe(15_000);
    expect(studyStep(now, now - 15_000, now - 1_000, false)).toBe(0); // window hidden
    expect(studyStep(now, now - 15_000, now - IDLE_MS - 1, true)).toBe(0); // idle
    expect(studyStep(now, now - 3_600_000, now, true)).toBe(MAX_STEP_MS); // laptop woke up
  });

  it("lists the last 7 days oldest first, with zeros for empty days", () => {
    const days = new Map([["2026-11-28", 600], ["2026-11-25", 120]]);
    const w = lastDays(days, 7, at("2026-11-28T10:00:00"));
    expect(w.map((d) => d.key)).toEqual(["2026-11-22", "2026-11-23", "2026-11-24", "2026-11-25", "2026-11-26", "2026-11-27", "2026-11-28"]);
    expect(w.map((d) => d.seconds)).toEqual([0, 0, 0, 120, 0, 0, 600]);
  });

  it("streak: today counts once reached, and an unfinished today does not break it", () => {
    const goal = 1800;
    const now = at("2026-11-28T10:00:00");
    const base = new Map([["2026-11-25", 1800], ["2026-11-26", 2000], ["2026-11-27", 1900]]);
    expect(goalStreak(base, goal, now)).toBe(3); // today not reached yet
    expect(goalStreak(new Map([...base, ["2026-11-28", 1800]]), goal, now)).toBe(4);
    expect(goalStreak(new Map([["2026-11-26", 2000]]), goal, now)).toBe(0); // yesterday missed
  });

  it("crosses month and year boundaries", () => {
    const days = new Map([["2026-12-31", 60], ["2027-01-01", 60]]);
    expect(goalStreak(days, 60, at("2027-01-01T08:00:00"))).toBe(2);
  });
});

describe("study tracker", () => {
  let now = 0;
  beforeEach(() => {
    vi.useFakeTimers();
    now = at("2026-11-28T10:00:00");
    vi.setSystemTime(now);
  });
  afterEach(() => vi.useRealTimers());

  const advance = (ms: number) => {
    now += ms;
    vi.advanceTimersByTime(ms);
  };
  const activity = () => window.dispatchEvent(new Event("keydown"));

  it("accumulates active minutes, pauses when idle and saves to storage", async () => {
    const storage = createMemoryStorage();
    const tracker = startStudyTracker(storage, () => now);
    await Promise.resolve();
    for (let i = 0; i < 8; i++) {
      advance(TICK_MS); // 2 minutes, active
      activity();
    }
    expect(tracker.snapshot().get("2026-11-28")).toBe(120);

    advance(10 * 60_000); // walked away for 10 minutes: only the time until going idle counts
    const afterIdle = tracker.snapshot().get("2026-11-28")!;
    expect(afterIdle).toBeLessThanOrEqual(120 + IDLE_MS / 1000);

    activity(); // back: counting restarts without back-filling the gap
    advance(TICK_MS);
    expect(tracker.snapshot().get("2026-11-28")! - afterIdle).toBeLessThanOrEqual(TICK_MS / 1000);

    tracker.stop();
    await vi.runAllTimersAsync();
    const rows = await storage.listItems<StudyDay>("study");
    expect(rows.find((r) => r.id === "2026-11-28")?.seconds).toBe(tracker.snapshot().get("2026-11-28"));
  });

  it("adds new time on top of what was stored earlier and can be reset", async () => {
    const storage = createMemoryStorage();
    await storage.putItem<StudyDay>("study", { id: "2026-11-28", seconds: 600, updatedAt: 1 });
    const tracker = startStudyTracker(storage, () => now);
    await vi.runAllTimersAsync().catch(() => {});
    advance(TICK_MS);
    activity();
    advance(TICK_MS);
    expect(tracker.snapshot().get("2026-11-28")).toBeGreaterThanOrEqual(600 + 15);
    await tracker.reset();
    expect(tracker.snapshot().size).toBe(0);
    expect(await storage.listItems("study")).toEqual([]);
    tracker.stop();
  });
});
