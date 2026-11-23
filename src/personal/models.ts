// Personal data models and strict validators. Imported files pass through `validate*` before
// anything touches the database; invalid entries are skipped and counted, never half-written.
import { newId, type StoredItem } from "../core/storage/types";

const str = (v: unknown, max: number): string | null => (typeof v === "string" && v.length <= max ? v : null);
const strArr = (v: unknown, maxItems: number, maxLen: number): string[] | null =>
  Array.isArray(v) && v.length <= maxItems && v.every((x) => typeof x === "string" && x.length <= maxLen) ? (v as string[]) : null;
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const idOk = (v: unknown): v is string => typeof v === "string" && /^[\w-]{1,64}$/.test(v);

export const cleanTags = (raw: string): string[] =>
  [...new Set(raw.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t && t.length <= 32))].slice(0, 20);

// ---------------------------------------------------------------- Notes
export interface Note extends StoredItem {
  title: string;
  body: string; // Markdown
  folder: string;
  tags: string[];
  favorite: boolean;
  lessonId: string | null;
  projectId: string | null;
  createdAt: number;
}

export function newNote(partial: Partial<Note> = {}): Note {
  const now = Date.now();
  return { id: newId(), title: "", body: "", folder: "", tags: [], favorite: false, lessonId: null, projectId: null, createdAt: now, updatedAt: now, ...partial };
}

export function validateNote(x: unknown): Note | null {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== "object" || !idOk(o.id)) return null;
  const title = str(o.title, 300), body = str(o.body, 200_000), folder = str(o.folder ?? "", 100), tags = strArr(o.tags ?? [], 20, 32);
  const createdAt = num(o.createdAt) ?? Date.now(), updatedAt = num(o.updatedAt) ?? Date.now();
  if (title === null || body === null || folder === null || tags === null) return null;
  return {
    id: o.id, title, body, folder, tags, favorite: o.favorite === true,
    lessonId: idOk(o.lessonId) ? o.lessonId : null, projectId: idOk(o.projectId) ? o.projectId : null,
    createdAt, updatedAt,
  };
}

// ---------------------------------------------------------------- Code snippets
export interface Snippet extends StoredItem {
  title: string;
  description: string;
  lang: string;
  code: string;
  explanation: string; // Markdown
  tags: string[];
  favorite: boolean;
  lessonId: string | null;
  createdAt: number;
}

export const SNIPPET_LANGS = ["javascript", "typescript", "python", "sql", "java", "csharp", "cpp", "go", "html", "css", "bash", "other"] as const;

export function newSnippet(partial: Partial<Snippet> = {}): Snippet {
  const now = Date.now();
  return { id: newId(), title: "", description: "", lang: "javascript", code: "", explanation: "", tags: [], favorite: false, lessonId: null, createdAt: now, updatedAt: now, ...partial };
}

export function validateSnippet(x: unknown): Snippet | null {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== "object" || !idOk(o.id)) return null;
  const title = str(o.title, 300), description = str(o.description ?? "", 2000), code = str(o.code, 200_000), explanation = str(o.explanation ?? "", 50_000);
  const tags = strArr(o.tags ?? [], 20, 32);
  const lang = typeof o.lang === "string" && (SNIPPET_LANGS as readonly string[]).includes(o.lang) ? o.lang : "other";
  if (title === null || description === null || code === null || explanation === null || tags === null) return null;
  return {
    id: o.id, title, description, lang, code, explanation, tags, favorite: o.favorite === true,
    lessonId: idOk(o.lessonId) ? o.lessonId : null, createdAt: num(o.createdAt) ?? Date.now(), updatedAt: num(o.updatedAt) ?? Date.now(),
  };
}

// ---------------------------------------------------------------- Flashcards (SM-2)
export interface Flashcard extends StoredItem {
  deck: string;
  front: string;
  back: string;
  code: string;
  termId: string | null; // generated from the knowledge base: text follows the lesson language
  ease: number; // ≥ 1.3
  interval: number; // days
  reps: number; // consecutive successful reviews
  lapses: number;
  due: number; // epoch ms
  reviews: number;
  correct: number;
  createdAt: number;
}

export type Grade = "again" | "hard" | "good" | "easy";
const QUALITY: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 };
const DAY = 86_400_000;

export function newCard(partial: Partial<Flashcard> = {}, now = Date.now()): Flashcard {
  return { id: newId(), deck: "", front: "", back: "", code: "", termId: null, ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now, reviews: 0, correct: 0, createdAt: now, updatedAt: now, ...partial };
}

/** SM-2 scheduling (Wozniak). "Again" relearns in 10 minutes; ease never drops below 1.3. */
export function review(card: Flashcard, grade: Grade, now = Date.now()): Flashcard {
  const q = QUALITY[grade];
  const ease = Math.max(1.3, card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const base = { ...card, ease, reviews: card.reviews + 1, updatedAt: now };
  if (q < 3) return { ...base, reps: 0, interval: 0, lapses: card.lapses + 1, due: now + 10 * 60_000 };
  const reps = card.reps + 1;
  let interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(card.interval * ease);
  if (grade === "hard") interval = Math.max(1, Math.round(interval * 0.8));
  if (grade === "easy") interval = Math.round(interval * 1.3) || 1;
  return { ...base, reps, interval, correct: card.correct + 1, due: now + interval * DAY };
}

export function validateCard(x: unknown): Flashcard | null {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== "object" || !idOk(o.id)) return null;
  const front = str(o.front, 2000), back = str(o.back, 5000), code = str(o.code ?? "", 10_000), deck = str(o.deck ?? "", 100);
  if (front === null || back === null || code === null || deck === null) return null;
  const n = (v: unknown, d: number) => num(v) ?? d;
  return {
    id: o.id, deck, front, back, code, termId: idOk(o.termId) ? o.termId : null,
    ease: Math.max(1.3, n(o.ease, 2.5)), interval: Math.max(0, n(o.interval, 0)), reps: Math.max(0, n(o.reps, 0)), lapses: Math.max(0, n(o.lapses, 0)),
    due: n(o.due, Date.now()), reviews: Math.max(0, n(o.reviews, 0)), correct: Math.max(0, n(o.correct, 0)),
    createdAt: n(o.createdAt, Date.now()), updatedAt: n(o.updatedAt, Date.now()),
  };
}

// ---------------------------------------------------------------- Projects
export type ProjectStatus = "idea" | "active" | "paused" | "done";
export interface ProjectTask { id: string; text: string; done: boolean }
export interface Project extends StoredItem {
  name: string;
  description: string;
  tech: string[];
  tags: string[];
  status: ProjectStatus;
  tasks: ProjectTask[];
  notes: string; // Markdown
  repoUrl: string;
  guideId: string | null;
  history: { at: number; text: string }[];
  createdAt: number;
}

export function newProject(partial: Partial<Project> = {}): Project {
  const now = Date.now();
  return { id: newId(), name: "", description: "", tech: [], tags: [], status: "idea", tasks: [], notes: "", repoUrl: "", guideId: null, history: [{ at: now, text: "created" }], createdAt: now, updatedAt: now, ...partial };
}

export function validateProject(x: unknown): Project | null {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== "object" || !idOk(o.id)) return null;
  const name = str(o.name, 200), description = str(o.description ?? "", 5000), notes = str(o.notes ?? "", 200_000), repoUrl = str(o.repoUrl ?? "", 500);
  const tech = strArr(o.tech ?? [], 30, 40), tags = strArr(o.tags ?? [], 20, 32);
  const status = (["idea", "active", "paused", "done"] as const).find((s) => s === o.status) ?? "idea";
  const tasks = Array.isArray(o.tasks)
    ? o.tasks.filter((t): t is ProjectTask => !!t && idOk((t as ProjectTask).id) && typeof (t as ProjectTask).text === "string").map((t) => ({ id: t.id, text: t.text.slice(0, 500), done: t.done === true })).slice(0, 500)
    : [];
  const history = Array.isArray(o.history)
    ? o.history.filter((h) => h && num((h as { at: unknown }).at) !== null && typeof (h as { text: unknown }).text === "string").map((h) => ({ at: (h as { at: number }).at, text: String((h as { text: string }).text).slice(0, 200) })).slice(-200)
    : [];
  if (name === null || description === null || notes === null || repoUrl === null || tech === null || tags === null) return null;
  if (repoUrl && !/^https:\/\//.test(repoUrl)) return null;
  return {
    id: o.id, name, description, tech, tags, status, tasks, notes, repoUrl, guideId: idOk(o.guideId) ? o.guideId : null, history,
    createdAt: num(o.createdAt) ?? Date.now(), updatedAt: num(o.updatedAt) ?? Date.now(),
  };
}

// ---------------------------------------------------------------- Roadmap state
export interface RoadmapState extends StoredItem {
  // id = path id
  followed: boolean;
  doneSteps: string[];
  customSteps: { id: string; text: string }[];
  goal: string;
}

export const emptyRoadmap = (pathId: string): RoadmapState => ({ id: pathId, followed: false, doneSteps: [], customSteps: [], goal: "", updatedAt: Date.now() });

/** Validates a whole export file: { format, version, items: [...] }. */
export function parseExport<T>(text: string, format: string, validate: (x: unknown) => T | null): { items: T[]; skipped: number } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("invalidJson");
  }
  const d = data as { format?: unknown; version?: unknown; items?: unknown };
  if (!d || d.format !== format) throw new Error("wrongFormat");
  if (typeof d.version !== "number" || d.version > 1) throw new Error("unsupportedVersion");
  if (!Array.isArray(d.items)) throw new Error("wrongFormat");
  const items: T[] = [];
  let skipped = 0;
  for (const x of d.items.slice(0, 10_000)) {
    const v = validate(x);
    if (v) items.push(v);
    else skipped++;
  }
  return { items, skipped };
}

export const buildExport = (format: string, items: unknown[]) => JSON.stringify({ format, version: 1, exportedAt: new Date().toISOString(), items }, null, 2);
