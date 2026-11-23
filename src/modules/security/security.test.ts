import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { LEGAL_NOTICE_MODULES, SECURITY_MODULES, SECURITY_TOPICS, findSecurityTopic, topicsOf } from "../../content/security";
import type { L } from "../../content/types";

const here = dirname(fileURLToPath(import.meta.url));
const fragment = JSON.parse(readFileSync(join(here, "../../../i18n-fragments/security.json"), "utf8")) as Record<string, unknown>;

const both = (x: L | undefined) => !!(x?.az?.trim() && x?.en?.trim());
const all4 = (x: L) => (["az", "en", "tr", "ru"] as const).every((k) => !!x[k]?.trim());

describe("security content", () => {
  it("has unique ids and every module has topics", () => {
    const ids = SECURITY_TOPICS.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(SECURITY_MODULES.map((m) => m.id)).size).toBe(SECURITY_MODULES.length);
    for (const m of SECURITY_MODULES) expect(topicsOf(m.id).length, m.id).toBeGreaterThan(0);
    for (const x of SECURITY_TOPICS) expect(SECURITY_MODULES.some((m) => m.id === x.module), x.id).toBe(true);
    expect(SECURITY_TOPICS.length).toBeGreaterThanOrEqual(50);
    expect(findSecurityTopic("linux-permissions")?.module).toBe("linux");
  });

  it("titles are in all 4 languages", () => {
    for (const m of SECURITY_MODULES) expect(all4(m.title), m.id).toBe(true);
    for (const x of SECURITY_TOPICS) expect(all4(x.title), x.id).toBe(true);
  });

  it("explanatory text has az + en", () => {
    for (const m of SECURITY_MODULES) expect(both(m.desc), m.id).toBe(true);
    for (const x of SECURITY_TOPICS) {
      expect(both(x.intro), `${x.id} intro`).toBe(true);
      expect(x.concepts.length, x.id).toBeGreaterThanOrEqual(2);
      x.concepts.forEach((c, i) => expect(both(c.name) && both(c.text), `${x.id} concept ${i}`).toBe(true));
      expect(x.examples.length, x.id).toBeGreaterThanOrEqual(1);
      x.examples.forEach((e, i) => {
        expect(both(e.title) && both(e.explain), `${x.id} example ${i}`).toBe(true);
        expect(e.code.trim().length, `${x.id} example ${i} code`).toBeGreaterThan(0);
      });
      expect(x.mistakes.length, x.id).toBeGreaterThanOrEqual(1);
      x.mistakes.forEach((m, i) => {
        expect(both(m.title) && both(m.why), `${x.id} mistake ${i}`).toBe(true);
        expect(!!m.wrong === !!m.right, `${x.id} mistake ${i} wrong/right pair`).toBe(true);
      });
      expect(both(x.exercise.task) && both(x.exercise.answer), `${x.id} exercise`).toBe(true);
      x.exercise.hints.forEach((h, i) => expect(both(h), `${x.id} hint ${i}`).toBe(true));
    }
  });

  it("has 2–3 quiz questions with valid answers and explanations", () => {
    for (const x of SECURITY_TOPICS) {
      expect(x.quiz.length, x.id).toBeGreaterThanOrEqual(2);
      expect(x.quiz.length, x.id).toBeLessThanOrEqual(3);
      x.quiz.forEach((q, i) => {
        expect(both(q.prompt) && both(q.explain), `${x.id} q${i}`).toBe(true);
        expect(q.options.length, `${x.id} q${i}`).toBeGreaterThanOrEqual(2);
        expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${x.id} q${i} answer`).toBe(true);
        if (q.kind === "choice") q.options.forEach((o, j) => expect(typeof o === "string" ? o.length > 0 : both(o), `${x.id} q${i} o${j}`).toBe(true));
      });
    }
  });

  it("references are https", () => {
    for (const x of SECURITY_TOPICS) {
      expect(x.refs.length, x.id).toBeGreaterThanOrEqual(1);
      for (const r of x.refs) {
        expect(r.url, x.id).toMatch(/^https:\/\//);
        expect(r.title.trim().length, x.id).toBeGreaterThan(0);
      }
    }
  });

  it("shows the legal notice for Kali and web-security topics", () => {
    expect(LEGAL_NOTICE_MODULES).toContain("kali");
    expect(LEGAL_NOTICE_MODULES).toContain("web");
  });

  it("never mentions phases", () => {
    const text = JSON.stringify([SECURITY_MODULES, SECURITY_TOPICS, fragment]).toLowerCase();
    expect(text).not.toMatch(/\bphase\b|mərhələ/);
  });
});

describe("security i18n fragment", () => {
  it("has 4 non-empty strings per key", () => {
    const keys = Object.keys(fragment);
    expect(keys.length).toBeGreaterThan(0);
    for (const k of keys) {
      expect(k.startsWith("security."), k).toBe(true);
      const v = fragment[k];
      expect(Array.isArray(v) && v.length === 4, k).toBe(true);
      for (const s of v as unknown[]) expect(typeof s === "string" && s.trim().length > 0, k).toBe(true);
    }
  });

  it("every t(\"security.…\") key used in the page exists", () => {
    const files = readdirSync(here).filter((f) => f.endsWith(".tsx"));
    expect(files.length).toBeGreaterThan(0);
    const used = new Set<string>();
    for (const f of files) {
      const src = readFileSync(join(here, f), "utf8");
      for (const m of src.matchAll(/\bt\(\s*["'`](security\.[^"'`$]+)["'`]/g)) used.add(m[1]);
    }
    expect(used.size).toBeGreaterThan(0);
    for (const k of used) expect(fragment, k).toHaveProperty([k]);
  });
});
