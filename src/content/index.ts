import type { Lesson, LessonMeta } from "./types";

// Light lesson index: catalog pages read this; full lesson bodies load only when a lesson opens.
// A unit test checks that every entry matches its lesson file.
export const LESSON_INDEX: LessonMeta[] = [
  { id: "python-variables", language: "python", order: 1, level: "absolute", title: { az: "Dəyişənlər və məlumat tipləri", en: "Variables and data types" } },
  { id: "python-conditions", language: "python", order: 2, level: "beginner", title: { az: "Şərtlər: if, elif, else", en: "Conditions: if, elif, else" } },
  { id: "javascript-variables", language: "javascript", order: 1, level: "absolute", title: { az: "Dəyişənlər: let, const və var", en: "Variables: let, const and var" } },
  { id: "javascript-functions", language: "javascript", order: 2, level: "beginner", title: { az: "Funksiyalar", en: "Functions" } },
  { id: "python-loops", language: "python", order: 3, level: "beginner", title: { az: "Dövrlər: for və while", en: "Loops: for and while" } },
  { id: "python-lists", language: "python", order: 4, level: "beginner", title: { az: "Siyahılar (list)", en: "Lists" } },
  { id: "python-functions", language: "python", order: 5, level: "beginner", title: { az: "Funksiyalar: def və return", en: "Functions: def and return" } },
  { id: "javascript-conditions", language: "javascript", order: 3, level: "beginner", title: { az: "Şərtlər: if, else və müqayisə", en: "Conditions: if, else and comparison" } },
  { id: "javascript-arrays", language: "javascript", order: 4, level: "beginner", title: { az: "Massivlər (array)", en: "Arrays" } },
  { id: "sql-select", language: "sql", order: 1, level: "absolute", title: { az: "SELECT: məlumatı oxumaq", en: "SELECT: reading data" } },
  { id: "javascript-objects", language: "javascript", order: 5, level: "beginner", title: { az: "Obyektlər (object)", en: "Objects" } },
  { id: "python-dictionaries", language: "python", order: 6, level: "beginner", title: { az: "Lüğətlər (dict)", en: "Dictionaries (dict)" } },
  { id: "typescript-basics", language: "typescript", order: 1, level: "beginner", title: { az: "TypeScript əsasları: tiplər və interfeyslər", en: "TypeScript basics: types and interfaces" } },
  { id: "javascript-loops", language: "javascript", order: 6, level: "beginner", title: { az: "Dövrlər: for, for...of və while", en: "Loops: for, for...of and while" } },
  { id: "python-strings", language: "python", order: 7, level: "beginner", title: { az: "Mətnlər (str) və onların metodları", en: "Strings (str) and their methods" } },
  { id: "sql-filter-sort", language: "sql", order: 2, level: "beginner", title: { az: "Süzmə və çeşidləmə: WHERE, ORDER BY, LIMIT", en: "Filtering and sorting: WHERE, ORDER BY, LIMIT" } },
  { id: "sql-joins", language: "sql", order: 3, level: "intermediate", title: { az: "Cədvəlləri birləşdirmək: JOIN", en: "Combining tables: JOIN" } },
];

const loaders = import.meta.glob<Lesson>("./lessons/*.ts", { import: "default" });

export async function loadLesson(id: string): Promise<Lesson | null> {
  const load = loaders[`./lessons/${id}.ts`];
  return load ? load() : null;
}

export function lessonsFor(languageId: string): LessonMeta[] {
  return LESSON_INDEX.filter((l) => l.language === languageId).sort((a, b) => a.order - b.order);
}

export const findLessonMeta = (id: string) => LESSON_INDEX.find((l) => l.id === id);
