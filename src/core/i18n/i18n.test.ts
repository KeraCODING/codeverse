import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import az from "./locales/az.json";
import en from "./locales/en.json";
import tr from "./locales/tr.json";
import ru from "./locales/ru.json";
import { translate } from "./i18n";
import { MODULES, GROUPS } from "../../app/modules";

const dicts = { az, en, tr, ru } as Record<string, Record<string, string>>;
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("locale dictionaries", () => {
  const enKeys = Object.keys(en).sort();

  for (const [name, dict] of Object.entries(dicts)) {
    it(`${name} has exactly the English key set`, () => {
      expect(Object.keys(dict).sort()).toEqual(enKeys);
    });
    it(`${name} has no empty strings and keeps placeholders`, () => {
      for (const k of enKeys) {
        expect(dict[k].trim(), `${name}:${k}`).not.toBe("");
        expect(placeholders(dict[k]), `${name}:${k}`).toEqual(placeholders((en as Record<string, string>)[k]));
      }
    });
  }

  it("every registered module and group has a title in English", () => {
    for (const m of MODULES) {
      expect(en).toHaveProperty(`module.${m.id}.title`);
      expect(en).toHaveProperty(`module.${m.id}.desc`);
    }
    for (const g of GROUPS) expect(en).toHaveProperty(`nav.group.${g}`);
  });

  it("every literal t('…') key used in source exists", () => {
    const root = join(__dirname, "../..");
    const files: string[] = [];
    const walk = (d: string) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, e.name);
        if (e.isDirectory()) {
          if (e.name !== "content") walk(p); // content data has its own helpers named t()
        }
        else if (/\.tsx?$/.test(e.name) && !e.name.endsWith(".test.ts")) files.push(p);
      }
    };
    walk(root);
    const missing: string[] = [];
    for (const f of files) {
      for (const m of readFileSync(f, "utf8").matchAll(/\bt\("([a-zA-Z0-9_.]+)"/g)) {
        if (!(m[1] in en)) missing.push(`${f}: ${m[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe("translate", () => {
  it("substitutes placeholders", () => {
    expect(translate({ a: "{n} of {m}" }, null, "a", { n: 1, m: 2 })).toBe("1 of 2");
  });
  it("falls back to the fallback dictionary, then to the key", () => {
    expect(translate({}, { a: "fb" }, "a")).toBe("fb");
    expect(translate({}, null, "missing.key")).toBe("missing.key");
  });
});
