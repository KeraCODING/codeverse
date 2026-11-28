// Storage abstraction. The app only talks to this interface; the adapter is chosen at boot:
// SQLite inside the Tauri desktop shell, IndexedDB in a browser, memory in tests.

export interface ActivityEvent {
  id: number;
  kind: ActivityKind;
  ref: string | null;
  createdAt: number; // epoch ms
}

export type ActivityKind =
  | "appOpened"
  | "moduleOpened"
  | "settingsChanged"
  | "settingsImported"
  | "settingsReset"
  | "lessonCompleted";

/** Lesson progress. "started" = opened; completion requires passing the knowledge check. */
export interface ProgressRecord {
  lessonId: string;
  state: "started" | "attempted" | "completed";
  bestScore: number | null; // 0–100, best knowledge-check result
  attempts: number;
  updatedAt: number;
}

export interface StorageInfo {
  backend: "sqlite" | "indexeddb" | "memory";
  schemaVersion: number;
  persistent: boolean;
}

export interface Storage {
  readonly info: StorageInfo;
  getSettings(): Promise<Record<string, unknown>>;
  /** Upserts the given keys; other keys are untouched. */
  putSettings(values: Record<string, unknown>): Promise<void>;
  clearSettings(): Promise<void>;
  addActivity(kind: ActivityKind, ref?: string | null): Promise<void>;
  recentActivity(limit: number): Promise<ActivityEvent[]>;
  /** Counts events since `since` (epoch ms) grouped by kind. */
  countActivitySince(since: number): Promise<Record<string, number>>;
  clearActivity(): Promise<void>;
  /** Keeps only the newest `keep` events, so the log can never grow without bound. */
  pruneActivity(keep: number): Promise<void>;
  getAllProgress(): Promise<ProgressRecord[]>;
  putProgress(rec: ProgressRecord): Promise<void>;
  clearProgress(): Promise<void>;
  /** Search history: newest first, de-duplicated by query. */
  addSearch(query: string): Promise<void>;
  recentSearches(limit: number): Promise<string[]>;
  clearSearches(): Promise<void>;
  getFavorites(): Promise<string[]>;
  setFavorite(key: string, on: boolean): Promise<void>;
  /** Generic personal-data collections (notes, snippets, flashcards, projects, roadmaps). */
  listItems<T extends StoredItem>(collection: Collection): Promise<T[]>;
  putItem<T extends StoredItem>(collection: Collection, item: T): Promise<void>;
  deleteItem(collection: Collection, id: string): Promise<void>;
  clearCollection(collection: Collection): Promise<void>;
}

/** "study" holds one row per day with the seconds studied (see core/study/studyTime.ts). */
export type Collection = "notes" | "snippets" | "flashcards" | "projects" | "roadmaps" | "study";
export const COLLECTIONS: Collection[] = ["notes", "snippets", "flashcards", "projects", "roadmaps"];

export interface StoredItem {
  id: string;
  updatedAt: number;
}

/** Sortable, unique-enough ids for local data (time prefix + random). */
export function newId(): string {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

export const SEARCH_HISTORY_KEEP = 50;

/** Merges a new event into an existing record. Pure, so every adapter behaves identically. */
export function mergeProgress(
  prev: ProgressRecord | undefined,
  lessonId: string,
  event: { type: "opened" } | { type: "quiz"; score: number; passScore: number },
  now: number,
): ProgressRecord {
  const base: ProgressRecord = prev ?? { lessonId, state: "started", bestScore: null, attempts: 0, updatedAt: now };
  if (event.type === "opened") return { ...base, updatedAt: now };
  const bestScore = Math.max(base.bestScore ?? 0, event.score);
  const state = base.state === "completed" || event.score >= event.passScore ? "completed" : "attempted";
  return { ...base, bestScore, attempts: base.attempts + 1, state, updatedAt: now };
}

export const ACTIVITY_KEEP = 500;
