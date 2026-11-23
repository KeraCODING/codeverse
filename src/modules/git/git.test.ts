import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { GIT_GROUPS, GIT_TOPICS, findGitTopic, type GitTopic } from "../../content/gitAcademy";
import type { L } from "../../content/types";

const root = process.cwd();
const fragment = JSON.parse(readFileSync(join(root, "i18n-fragments", "git.json"), "utf8")) as Record<string, unknown>;

const hasAzEn = (text: L | undefined) => !!text?.az?.trim() && !!text?.en?.trim();

function explanatoryTexts(topic: GitTopic): [string, L][] {
  const out: [string, L][] = [
    ["summary", topic.summary],
    ["what", topic.what],
    ["how", topic.how],
    ["exercise", topic.exercise],
  ];
  topic.examples.forEach((x, i) => out.push([`examples[${i}].explain`, x.explain]));
  topic.mistakes.forEach((m, i) => out.push([`mistakes[${i}]`, m]));
  topic.quiz.forEach((q, i) => {
    out.push([`quiz[${i}].prompt`, q.prompt], [`quiz[${i}].explain`, q.explain]);
    if (q.kind === "choice") q.options.forEach((o, j) => typeof o !== "string" && out.push([`quiz[${i}].options[${j}]`, o]));
  });
  return out;
}

describe("git academy content", () => {
  it("has the expected topics in every group with unique ids", () => {
    const ids = GIT_TOPICS.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
    const count = (g: string) => GIT_TOPICS.filter((x) => x.group === g).length;
    expect(count("git")).toBe(12);
    expect(count("github")).toBe(13);
    expect(count("platforms")).toBe(9);
    expect(GIT_TOPICS.every((x) => GIT_GROUPS.includes(x.group))).toBe(true);
    expect(findGitTopic("rebase")?.group).toBe("git");
  });

  it("titles exist in all four languages", () => {
    for (const x of GIT_TOPICS) for (const loc of ["az", "en", "tr", "ru"] as const) expect(x.title[loc]?.trim(), `${x.id} title ${loc}`).toBeTruthy();
  });

  it("every explanatory field has Azerbaijani and English text", () => {
    for (const x of GIT_TOPICS) for (const [field, text] of explanatoryTexts(x)) expect(hasAzEn(text), `${x.id}.${field}`).toBe(true);
  });

  it("every topic has examples, 1–3 mistakes, an exercise and 2–3 quiz questions", () => {
    for (const x of GIT_TOPICS) {
      expect(x.examples.length, x.id).toBeGreaterThan(0);
      for (const e of x.examples) expect(e.code.trim().length, x.id).toBeGreaterThan(0);
      expect(x.mistakes.length, x.id).toBeGreaterThanOrEqual(1);
      expect(x.mistakes.length, x.id).toBeLessThanOrEqual(3);
      expect(x.quiz.length, x.id).toBeGreaterThanOrEqual(2);
      expect(x.quiz.length, x.id).toBeLessThanOrEqual(3);
    }
  });

  it("quiz answers point to an existing option", () => {
    for (const x of GIT_TOPICS)
      for (const q of x.quiz) {
        expect(q.options.length, x.id).toBeGreaterThanOrEqual(2);
        expect(Number.isInteger(q.answer), x.id).toBe(true);
        expect(q.answer, x.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, x.id).toBeLessThan(q.options.length);
      }
  });

  it("documentation links are https and unique per topic", () => {
    for (const x of GIT_TOPICS) {
      expect(x.docs.length, x.id).toBeGreaterThan(0);
      for (const d of x.docs) {
        expect(d.title.trim(), x.id).toBeTruthy();
        expect(new URL(d.url).protocol, `${x.id} ${d.url}`).toBe("https:");
      }
      expect(new Set(x.docs.map((d) => d.url)).size, x.id).toBe(x.docs.length);
    }
  });

  it("uses modern Git commands and never mentions phases", () => {
    for (const x of GIT_TOPICS) {
      for (const e of x.examples) expect(e.code, x.id).not.toMatch(/git checkout\b/);
      expect(JSON.stringify(x).toLowerCase(), x.id).not.toMatch(/\bphase\b|mərhələ/);
    }
  });
});

describe("git i18n fragment", () => {
  it("has four non-empty strings per key", () => {
    const entries = Object.entries(fragment);
    expect(entries.length).toBeGreaterThan(0);
    for (const [key, value] of entries) {
      expect(key.startsWith("git."), key).toBe(true);
      expect(Array.isArray(value), key).toBe(true);
      const arr = value as unknown[];
      expect(arr.length, key).toBe(4);
      for (const s of arr) expect(typeof s === "string" && s.trim().length > 0, key).toBe(true);
    }
  });

  it("contains every git.* key used by the module's components", () => {
    const dir = join(root, "src", "modules", "git");
    const used = new Set<string>();
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
      const src = readFileSync(join(dir, file), "utf8");
      for (const m of src.matchAll(/["'`](git\.[A-Za-z0-9_.]+)["'`]/g)) used.add(m[1]);
    }
    expect(used.size).toBeGreaterThan(0);
    for (const key of used) expect(fragment[key], key).toBeDefined();
  });
});
