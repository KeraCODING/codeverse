// Educational content schema. Content lives in data modules under src/content and is
// rendered by generic components, so new languages / lessons are added without UI changes.
import { LOCALES, type Locale } from "../core/settings/schema";

/** Localised text. A missing locale means "not translated" — never silently filled. */
export type L = Partial<Record<Locale, string>>;

export type Level = "absolute" | "beginner" | "intermediate" | "advanced" | "professional";
export type CodeLang = "python" | "javascript" | "typescript" | "sql" | "java" | "csharp" | "cpp" | "go" | "plain";

export interface Source {
  title: string;
  url: string;
}

export interface LanguageInfo {
  id: string;
  name: string;
  kind: "programming" | "markup" | "stylesheet" | "query" | "shell";
  firstAppeared: number | null;
  creators: string | null;
  typing: L | null;
  desc: L;
  uses: L;
  docs: Source;
}

export interface FieldInfo {
  id: string;
  name: L;
  desc: L;
  languages: string[]; // LanguageInfo ids
  technologies: string[]; // TechInfo ids
  roadmap?: L[]; // ordered steps; absent = not written yet
}

export type TechCategory = "frontend" | "backend" | "mobile" | "desktop" | "aiData" | "gameDev" | "infra";

export interface TechInfo {
  id: string;
  name: string;
  category: TechCategory;
  language: string | null; // primary LanguageInfo id
  desc: L;
  docs: Source;
}

export interface CodeExample {
  title: L;
  lang: CodeLang;
  code: string;
  /** One explanation per code line (same order). Use {} for blank lines. */
  lines: L[];
  output?: string;
}

export interface SyntaxPart {
  token: string;
  role: L;
}

export interface Mistake {
  title: L;
  wrong: string;
  right: string;
  why: L;
}

export type QuizQuestion =
  | { kind: "choice"; prompt: L; options: (L | string)[]; answer: number; explain: L } // string = language-neutral (code)
  | { kind: "predict"; prompt: L; code: string; lang: CodeLang; options: string[]; answer: number; explain: L };

export interface Exercise {
  task: L;
  objective: L;
  hints: L[];
  solution: string;
  lang: CodeLang;
  /** Automatic check for runnable languages: the program's output must equal `expected`. */
  check?: { expected: string; starter: string };
}

export interface Term {
  en: string;
  local: L; // az/tr/ru equivalents
}

export interface Lesson {
  id: string;
  language: string;
  order: number;
  level: Level;
  title: L;
  /** Plain-words explanation with an everyday analogy, shown first ("In simple words"). */
  simple: L;
  intro: { what: L; why: L; where: L };
  syntax: { code: string; lang: CodeLang; parts: SyntaxPart[] };
  examples: CodeExample[];
  mistakes: Mistake[];
  exercise: Exercise;
  quiz: QuizQuestion[];
  terms: Term[];
  related: string[]; // lesson ids
  sources: Source[];
  reviewedAt: string; // ISO date the content was last checked against sources
  /** "authored": written and checked against the listed sources by the author; "reviewed": second reviewer. */
  verification: "authored" | "reviewed";
}

/** Light metadata so catalog pages never load full lesson bodies. */
export interface LessonMeta {
  id: string;
  language: string;
  order: number;
  level: Level;
  title: L;
}

export const PASS_SCORE = 70;

/** Picks text in the preferred locale, falling back through the chain. */
export function pick(text: L | null | undefined, chain: readonly Locale[]): string {
  if (!text) return "";
  for (const l of chain) if (text[l]) return text[l]!;
  return "";
}

/** Locale chain for reading content: preferred, then Azerbaijani (primary), then English. */
export function contentChain(preferred: Locale): Locale[] {
  return [...new Set<Locale>([preferred, "az", "en"])];
}

/** Every L value inside an object (deep). Used for translation-completeness tracking. */
function collectTexts(value: unknown, out: L[] = []): L[] {
  if (Array.isArray(value)) value.forEach((v) => collectTexts(v, out));
  else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    const looksLikeL = keys.length > 0 && keys.every((k) => (LOCALES as readonly string[]).includes(k));
    if (looksLikeL) out.push(value as L);
    else for (const v of Object.values(value)) collectTexts(v, out);
  }
  return out;
}

/** Share (0–100) of translatable strings present in `locale`. Empty L ({}) entries are skipped. */
export function translationCompleteness(lesson: Lesson, locale: Locale): number {
  // Term glossaries keep English in `term.en`, so for English only the other fields count.
  const { terms, ...rest } = lesson;
  const texts = collectTexts(rest).filter((t) => Object.keys(t).length > 0);
  if (locale !== "en") texts.push(...terms.map((term) => term.local));
  if (texts.length === 0) return 100;
  const have = texts.filter((t) => !!t[locale]).length;
  return Math.round((have / texts.length) * 100);
}
