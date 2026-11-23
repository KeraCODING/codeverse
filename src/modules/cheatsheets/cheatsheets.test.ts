import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { CHEATSHEETS, cheatKey, normalizeText, searchCheats } from "../../content/cheatsheets";
import fragment from "../../../i18n-fragments/cheatsheets.json";

const LOCALES = ["az", "en", "tr", "ru"] as const;
const strings = fragment as Record<string, string[]>;

describe("cheat sheet content", () => {
  it("covers the required sheets", () => {
    expect(CHEATSHEETS.map((s) => s.id).sort()).toEqual(["css", "git", "html", "javascript", "python", "sql"]);
  });

  it("has unique sheet ids and unique section ids per sheet", () => {
    expect(new Set(CHEATSHEETS.map((s) => s.id)).size).toBe(CHEATSHEETS.length);
    for (const s of CHEATSHEETS) {
      expect(new Set(s.sections.map((sec) => sec.id)).size, s.id).toBe(s.sections.length);
      for (const sec of s.sections) expect(sec.id).toMatch(/^[a-z0-9-]+$/);
    }
    const keys = CHEATSHEETS.flatMap((s) => s.sections.map((sec) => cheatKey(s.id, sec.id)));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has section titles in all four languages and 3-8 entries per section", () => {
    for (const s of CHEATSHEETS)
      for (const sec of s.sections) {
        for (const l of LOCALES) expect(sec.title[l]?.trim(), `${s.id}/${sec.id} ${l}`).toBeTruthy();
        expect(sec.entries.length, `${s.id}/${sec.id}`).toBeGreaterThanOrEqual(3);
        expect(sec.entries.length, `${s.id}/${sec.id}`).toBeLessThanOrEqual(8);
      }
  });

  it("has non-empty code and az + en explanations for every entry", () => {
    for (const s of CHEATSHEETS)
      for (const sec of s.sections)
        sec.entries.forEach((en, i) => {
          const where = `${s.id}/${sec.id}#${i}`;
          expect(en.code.trim(), where).toBeTruthy();
          expect(en.note.az?.trim(), where).toBeTruthy();
          expect(en.note.en?.trim(), where).toBeTruthy();
        });
  });

  it("has descriptions in all languages and https documentation links", () => {
    for (const s of CHEATSHEETS) {
      for (const l of LOCALES) expect(s.desc[l]?.trim(), `${s.id} ${l}`).toBeTruthy();
      expect(new URL(s.docs.url).protocol, s.id).toBe("https:");
      expect(s.docs.title.trim()).toBeTruthy();
    }
  });
});

describe("cheat sheet search", () => {
  it("normalizes case and diacritics", () => {
    expect(normalizeText("Dəyişənlər ŞƏRT")).toBe("deyisenler sert");
    expect(normalizeText("İndeks")).toBe("indeks");
  });

  it("matches code and explanations across sheets", () => {
    expect(searchCheats("").length).toBe(0);
    expect(searchCheats("LEFT JOIN").some((h) => h.sheet.id === "sql")).toBe(true);
    expect(searchCheats("git stash pop").length).toBeGreaterThan(0);
    // Azerbaijani explanation typed without special letters.
    expect(searchCheats("dovr").some((h) => h.sheet.id === "python")).toBe(true);
    expect(searchCheats("zzqqxx-nothing").length).toBe(0);
  });
});

describe("cheat sheet UI strings", () => {
  it("has four non-empty strings per key", () => {
    for (const [key, value] of Object.entries(strings)) {
      expect(key.startsWith("cheatsheets."), key).toBe(true);
      expect(Array.isArray(value) && value.length === 4, key).toBe(true);
      value.forEach((v) => expect(typeof v === "string" && v.trim().length > 0, key).toBe(true));
    }
  });

  it("uses the same placeholders in every language", () => {
    const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const [key, value] of Object.entries(strings)) for (const v of value) expect(ph(v), key).toEqual(ph(value[1]));
  });

  it("defines every cheatsheets.* key used by the page", () => {
    const dir = join(__dirname);
    const used = new Set<string>();
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
      const src = readFileSync(join(dir, f), "utf8");
      for (const m of src.matchAll(/["'`](cheatsheets\.[A-Za-z0-9_]+)["'`]/g)) used.add(m[1]);
    }
    expect(used.size).toBeGreaterThan(0);
    for (const k of used) expect(strings[k], k).toBeDefined();
  });

  it("never mentions phases", () => {
    const all = JSON.stringify(strings) + JSON.stringify(CHEATSHEETS);
    expect(/phase|mərhələ/i.test(all)).toBe(false);
  });
});
