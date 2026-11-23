import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { mergeProgress, type ProgressRecord } from "../storage";
import { useSettings } from "../settings/SettingsContext";
import { PASS_SCORE } from "../../content/types";

interface ProgressValue {
  ready: boolean;
  records: Map<string, ProgressRecord>;
  markOpened: (lessonId: string) => void;
  /** Stores a knowledge-check result; returns true when this result newly completes the lesson. */
  recordQuiz: (lessonId: string, score: number) => Promise<boolean>;
  markPracticePassed: (taskId: string) => void;
  clearAll: () => Promise<void>;
}

const Ctx = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { storage, logActivity } = useSettings();
  const [records, setRecords] = useState<Map<string, ProgressRecord>>(new Map());
  const [ready, setReady] = useState(false);
  // Lessons opened before saved progress has loaded are queued, so an early "opened" event can
  // never overwrite a stored "completed" record (bug seen when reloading on a lesson page).
  const readyRef = useRef(false);
  const pendingOpens = useRef<Set<string>>(new Set());

  useEffect(() => {
    let live = true;
    storage.getAllProgress().then((rows) => {
      if (!live) return;
      const map = new Map(rows.map((r) => [r.lessonId, r]));
      for (const id of pendingOpens.current) {
        const next = mergeProgress(map.get(id), id, { type: "opened" }, Date.now());
        map.set(id, next);
        void storage.putProgress(next).catch((e) => console.error("progress save failed", e));
      }
      pendingOpens.current.clear();
      readyRef.current = true;
      setRecords(map);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [storage]);

  const save = useCallback(
    (rec: ProgressRecord) => {
      setRecords((m) => new Map(m).set(rec.lessonId, rec));
      return storage.putProgress(rec);
    },
    [storage],
  );

  const markOpened = useCallback(
    (lessonId: string) => {
      if (!readyRef.current) {
        pendingOpens.current.add(lessonId);
        return;
      }
      setRecords((m) => {
        const next = mergeProgress(m.get(lessonId), lessonId, { type: "opened" }, Date.now());
        void storage.putProgress(next).catch((e) => console.error("progress save failed", e));
        return new Map(m).set(lessonId, next);
      });
    },
    [storage],
  );

  const recordQuiz = useCallback(
    async (lessonId: string, score: number) => {
      const prev = records.get(lessonId);
      const next = mergeProgress(prev, lessonId, { type: "quiz", score, passScore: PASS_SCORE }, Date.now());
      await save(next);
      const newly = prev?.state !== "completed" && next.state === "completed";
      if (newly) logActivity("lessonCompleted", lessonId);
      return newly;
    },
    [records, save, logActivity],
  );

  /** Practice tasks (challenges, debug tasks) are stored as "practice:<id>"; only passes are recorded. */
  const markPracticePassed = useCallback(
    (taskId: string) => {
      const id = `practice:${taskId}`;
      const next = mergeProgress(records.get(id), id, { type: "quiz", score: 100, passScore: PASS_SCORE }, Date.now());
      void save(next).catch((e) => console.error("progress save failed", e));
    },
    [records, save],
  );

  const clearAll = useCallback(async () => {
    await storage.clearProgress();
    setRecords(new Map());
  }, [storage]);

  const value = useMemo(() => ({ ready, records, markOpened, recordQuiz, markPracticePassed, clearAll }), [ready, records, markOpened, recordQuiz, markPracticePassed, clearAll]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProgress outside ProgressProvider");
  return v;
}
