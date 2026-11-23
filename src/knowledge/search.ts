// Universal Search — local in-memory index built on demand (only when Search opens), never sent
// anywhere. Matching is accent-insensitive (ə→e, ş→s, …) so users can type without special keys,
// and covers all four languages of whatever text exists.
import type { L } from "../content/types";
import { LANGUAGES } from "../content/catalog/languages";
import { FIELDS } from "../content/catalog/fields";
import { TECHNOLOGIES } from "../content/catalog/technologies";
import { LESSON_INDEX } from "../content";
import { TERMS } from "./keywords";
import { ERROR_PATTERNS, matchErrors } from "./errors";
import { CONCEPTS } from "./compare";

export type DocType = "language" | "lesson" | "term" | "technology" | "field" | "error" | "comparison";

export interface SearchDoc {
  key: string; // stable id, used for favorites
  type: DocType;
  title: L | string;
  subtitle?: L | string;
  href: string;
  /** Normalised searchable text: title words weigh more than body words. */
  titleText: string;
  bodyText: string;
  tags: string[]; // e.g. language ids, for filtering
}

const MAP: Record<string, string> = { ə: "e", ı: "i", ş: "s", ç: "c", ğ: "g", ö: "o", ü: "u", İ: "i", ё: "е" };

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[əışçğöüİё]/g, (c) => MAP[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const all = (x: L | string | null | undefined): string => (!x ? "" : typeof x === "string" ? x : Object.values(x).join(" "));

let cached: SearchDoc[] | null = null;

/** Builds the index once per session (a few hundred small documents). */
export function getIndex(): SearchDoc[] {
  if (cached) return cached;
  const docs: SearchDoc[] = [];
  const push = (d: Omit<SearchDoc, "titleText" | "bodyText"> & { body: string; extraTitle?: string }) =>
    docs.push({ ...d, titleText: normalize(all(d.title) + " " + (d.extraTitle ?? "")), bodyText: normalize(d.body) });

  for (const l of LANGUAGES)
    push({ key: `language:${l.id}`, type: "language", title: l.name, subtitle: l.desc, href: `#/languages/${l.id}`, tags: [l.id], body: all(l.desc) + " " + all(l.uses) + " " + (l.creators ?? "") });
  for (const l of LESSON_INDEX) {
    const lang = LANGUAGES.find((x) => x.id === l.language);
    push({ key: `lesson:${l.id}`, type: "lesson", title: l.title, subtitle: lang?.name, href: `#/languages/${l.language}/${l.id}`, tags: [l.language], body: lang?.name ?? "" });
  }
  for (const t of TERMS)
    push({
      key: `term:${t.id}`, type: "term", title: t.token, subtitle: t.meaning, href: `#/search/term/${t.id}`, tags: t.lang ? [t.lang] : [],
      extraTitle: (t.aliases ?? []).join(" "), body: all(t.meaning) + " " + Object.values(t.examples).join(" "),
    });
  for (const x of TECHNOLOGIES)
    push({ key: `technology:${x.id}`, type: "technology", title: x.name, subtitle: x.desc, href: `#/frameworks/${x.id}`, tags: x.language ? [x.language] : [], body: all(x.desc) + " " + x.category });
  for (const f of FIELDS)
    push({ key: `field:${f.id}`, type: "field", title: f.name, subtitle: f.desc, href: `#/fields/${f.id}`, tags: f.languages, body: all(f.desc) + " " + (f.roadmap ?? []).map(all).join(" ") });
  for (const e of ERROR_PATTERNS)
    push({ key: `error:${e.id}`, type: "error", title: e.title, subtitle: e.meaning, href: `#/errors/${e.id}`, tags: [e.tech], body: all(e.meaning) + " " + e.causes.map(all).join(" ") });
  for (const c of CONCEPTS)
    push({ key: `comparison:${c.id}`, type: "comparison", title: c.title, subtitle: c.note, href: `#/compare/${c.id}`, tags: [], body: all(c.note) + " " + Object.values(c.code).join(" ") });
  cached = docs;
  return docs;
}

/** Levenshtein distance with early exit, for typo tolerance on short words. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
  fuzzy: boolean;
}

const TYPE_BOOST: Record<DocType, number> = { term: 6, lesson: 5, language: 4, error: 3, comparison: 2, technology: 2, field: 1 };

/** Scores every document. Exact > prefix > word > substring > body > fuzzy (typo). */
export function search(query: string, opts: { type?: DocType | "all"; limit?: number } = {}): SearchHit[] {
  const q = normalize(query);
  if (!q) return [];
  const words = q.split(" ").filter(Boolean);
  const out: SearchHit[] = [];
  for (const doc of getIndex()) {
    if (opts.type && opts.type !== "all" && doc.type !== opts.type) continue;
    const title = doc.titleText;
    const titleWords = title.split(/[^\p{L}\p{N}_=!&|.$`{}…]+/u).filter(Boolean);
    let score = 0;
    let fuzzy = false;
    if (title === q || titleWords.includes(q)) score += 100;
    else if (title.startsWith(q)) score += 80;
    else if (title.includes(q)) score += 60;
    // every query word must appear somewhere (AND semantics), title words weigh more
    let allWords = true;
    for (const w of words) {
      if (titleWords.some((t) => t === w)) score += 25;
      else if (titleWords.some((t) => t.startsWith(w))) score += 15;
      else if (title.includes(w)) score += 10;
      else if (doc.bodyText.includes(w)) score += 4;
      else if (w.length >= 4 && titleWords.some((t) => t.length >= 3 && editDistance(w, t, w.length >= 7 ? 2 : 1) <= (w.length >= 7 ? 2 : 1))) {
        score += 6;
        fuzzy = true;
      } else allWords = false;
    }
    if (!allWords || score === 0) continue;
    out.push({ doc, score: score + TYPE_BOOST[doc.type], fuzzy });
  }
  // Pasted error messages: put the recognised error first.
  for (const m of matchErrors(query)) {
    const key = `error:${m.pattern.id}`;
    const hit = out.find((h) => h.doc.key === key);
    if (hit) hit.score += 1000;
    else {
      const doc = getIndex().find((d) => d.key === key);
      if (doc && (!opts.type || opts.type === "all" || opts.type === "error")) out.push({ doc, score: 1000, fuzzy: false });
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, opts.limit ?? 50);
}

/** Related documents for a hit: same language tag first, then shared words. */
export function related(doc: SearchDoc, limit = 5): SearchDoc[] {
  const words = new Set(doc.titleText.split(" ").filter((w) => w.length > 3));
  return getIndex()
    .filter((d) => d.key !== doc.key)
    .map((d) => ({ d, s: d.tags.filter((t) => doc.tags.includes(t)).length * 2 + [...words].filter((w) => d.bodyText.includes(w)).length }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.d);
}
