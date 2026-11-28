import { useEffect, useState } from "react";
import type { Storage } from "../storage/types";
import { startStudyTracker, type StudyTracker } from "./studyTime";

// The app has one tracker, started by the Shell. Pages read it through useStudyDays().
let current: StudyTracker | null = null;
const changed = new Set<() => void>();
const announce = () => changed.forEach((f) => f());

/** Starts tracking while `enabled` (Settings → Privacy → record activity). */
export function useStudyTracker(storage: Storage, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const tracker = startStudyTracker(storage);
    current = tracker;
    announce();
    return () => {
      tracker.stop();
      if (current === tracker) current = null;
      announce();
    };
  }, [storage, enabled]);
}

/** Seconds studied per local day (YYYY-MM-DD); null while tracking is off. Re-renders on change. */
export function useStudyDays(): ReadonlyMap<string, number> | null {
  const [, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    let off = current?.subscribe(bump) ?? (() => {});
    const onSwap = () => {
      off();
      off = current?.subscribe(bump) ?? (() => {});
      bump();
    };
    changed.add(onSwap);
    return () => {
      off();
      changed.delete(onSwap);
    };
  }, []);
  return current ? current.snapshot() : null;
}

export const resetStudyTime = () => current?.reset() ?? Promise.resolve();
