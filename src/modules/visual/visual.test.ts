import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { VISUAL_TOPICS, findTopic } from "./topics";
import { azOrdinal, binaryTrace } from "./topics-algo";
import type { LogKind, Txt, VItem } from "./types";

const fragment = JSON.parse(readFileSync(join(__dirname, "../../../i18n-fragments/visual.json"), "utf8")) as Record<string, string[]>;
const isL = (x: Txt | undefined) => typeof x === "object" && x !== null;

describe("visual topics", () => {
  it("has at least 10 topics with unique ids", () => {
    expect(VISUAL_TOPICS.length).toBeGreaterThanOrEqual(10);
    const ids = VISUAL_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-zA-Z0-9-]+$/);
  });

  for (const topic of VISUAL_TOPICS) {
    describe(topic.id, () => {
      const lineCount = topic.code.src.split("\n").length;

      it("has a title in all four languages and az+en intro/summary", () => {
        for (const l of ["az", "en", "tr", "ru"] as const) expect(topic.title[l]?.trim(), l).toBeTruthy();
        for (const text of [topic.intro, topic.summary]) {
          expect(text.az?.trim()).toBeTruthy();
          expect(text.en?.trim()).toBeTruthy();
        }
      });

      it("has at least 3 steps, each with an az+en caption", () => {
        expect(topic.steps.length).toBeGreaterThanOrEqual(3);
        topic.steps.forEach((s, i) => {
          expect(s.caption.az?.trim(), `step ${i + 1} az`).toBeTruthy();
          expect(s.caption.en?.trim(), `step ${i + 1} en`).toBeTruthy();
        });
      });

      it("highlights only lines that exist in the code sample", () => {
        for (const s of topic.steps) {
          if (s.line === null) continue;
          expect(Number.isInteger(s.line)).toBe(true);
          expect(s.line).toBeGreaterThanOrEqual(1);
          expect(s.line).toBeLessThanOrEqual(lineCount);
          expect(topic.code.src.split("\n")[s.line - 1].trim(), `line ${s.line} is blank`).not.toBe("");
        }
      });

      it("uses unique panel/item ids per step and arrows point at existing ids", () => {
        topic.steps.forEach((s, i) => {
          const ids = [...s.panels.map((p) => p.id), ...s.panels.flatMap((p) => p.items.map((it) => it.id).filter((x): x is string => !!x))];
          expect(new Set(ids).size, `step ${i + 1}`).toBe(ids.length);
          for (const a of s.arrows ?? []) {
            expect(ids, `step ${i + 1} arrow from`).toContain(a.from);
            expect(ids, `step ${i + 1} arrow to`).toContain(a.to);
          }
        });
      });

      it("localised item texts have az and en", () => {
        const texts: Txt[] = [];
        for (const s of topic.steps)
          for (const p of s.panels) {
            texts.push(p.title);
            p.items.forEach((it: VItem) => texts.push(...([it.label, it.value, it.tag].filter((x) => x !== undefined) as Txt[])));
          }
        for (const x of texts) if (isL(x)) expect((x as { az?: string; en?: string }).az && (x as { en?: string }).en).toBeTruthy();
      });

      it("output only grows from step to step", () => {
        let prev: string[] = [];
        for (const s of topic.steps) {
          const out = s.output ?? [];
          if (out.length === 0) continue;
          expect(out.slice(0, prev.length)).toEqual(prev);
          prev = out;
        }
      });
    });
  }

  it("never mentions phases", () => {
    const all = JSON.stringify(VISUAL_TOPICS) + JSON.stringify(fragment);
    expect(all).not.toMatch(/phase|mərhələ/i);
  });

  it("findTopic resolves ids and rejects unknown ones", () => {
    expect(findTopic("recursion")?.id).toBe("recursion");
    expect(findTopic("nope")).toBeUndefined();
    expect(findTopic(undefined)).toBeUndefined();
  });
});

describe("event loop topic", () => {
  const topic = findTopic("eventloop")!;
  const finalOutput = topic.steps[topic.steps.length - 1].output ?? [];
  const kinds = topic.meta!.logKinds!;
  const rank: Record<LogKind, number> = { sync: 0, micro: 1, timer: 2 };

  it("prints synchronous logs, then microtasks, then timers", () => {
    expect(finalOutput).toHaveLength(Object.keys(kinds).length);
    const ranks = finalOutput.map((l) => rank[kinds[l]]);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(new Set(ranks)).toEqual(new Set([0, 1, 2]));
  });

  it("matches what a real JavaScript engine prints for the sample", async () => {
    const printed: string[] = [];
    const fakeConsole = { log: (...a: unknown[]) => printed.push(a.join(" ")) };
    new Function("console", topic.code.src)(fakeConsole);
    await new Promise((r) => setTimeout(r, 20));
    expect(printed).toEqual(finalOutput);
  });
});

describe("search topic", () => {
  const topic = findTopic("search")!;
  const { arr, target } = topic.meta!.search!;

  it("uses a sorted array that contains the target", () => {
    expect([...arr].sort((a, b) => a - b)).toEqual(arr);
    expect(arr).toContain(target);
  });

  it("binary search finds the target within ceil(log2(n)) + 1 comparisons", () => {
    const probes = topic.steps.filter((s) => s.probe?.algo === "binary").map((s) => s.probe!.index);
    expect(probes.length).toBeGreaterThan(0);
    expect(probes.length).toBeLessThanOrEqual(Math.ceil(Math.log2(arr.length)) + 1);
    expect(arr[probes[probes.length - 1]]).toBe(target);
    // The precomputed steps agree with an actual run of the algorithm.
    expect(probes).toEqual(binaryTrace(arr, target).probes.map((p) => p.mid));
  });

  it("linear search ends on the target, after more comparisons than binary search", () => {
    const linear = topic.steps.filter((s) => s.probe?.algo === "linear").map((s) => s.probe!.index);
    expect(arr[linear[linear.length - 1]]).toBe(target);
    const binary = topic.steps.filter((s) => s.probe?.algo === "binary").length;
    expect(arr.indexOf(target) + 1).toBeGreaterThan(binary);
  });

  it("binaryTrace stays within the bound for every element and reports misses", () => {
    for (const x of arr) {
      const r = binaryTrace(arr, x);
      expect(arr[r.index]).toBe(x);
      expect(r.probes.length).toBeLessThanOrEqual(Math.ceil(Math.log2(arr.length)) + 1);
    }
    expect(binaryTrace(arr, 4).index).toBe(-1);
  });
});

describe("azOrdinal", () => {
  it("follows vowel harmony", () => {
    expect([1, 2, 3, 4, 6, 9, 10, 20, 40].map(azOrdinal)).toEqual(["1-ci", "2-ci", "3-cü", "4-cü", "6-cı", "9-cu", "10-cu", "20-ci", "40-cı"]);
  });
});

describe("visual i18n fragment", () => {
  it("has four non-empty strings per key", () => {
    for (const [k, v] of Object.entries(fragment)) {
      expect(k.startsWith("visual."), k).toBe(true);
      expect(v, k).toHaveLength(4);
      for (const s of v) expect(s.trim(), k).not.toBe("");
    }
  });

  it("keeps the same placeholders in every language", () => {
    const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const [k, v] of Object.entries(fragment)) for (const s of v) expect(ph(s), k).toEqual(ph(v[1]));
  });

  it("contains every t(\"visual.…\") key used in the module", () => {
    const dir = __dirname;
    const missing: string[] = [];
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".tsx"))) {
      for (const m of readFileSync(join(dir, f), "utf8").matchAll(/\bt\("(visual\.[a-zA-Z0-9_.]+)"/g)) {
        if (!(m[1] in fragment)) missing.push(`${f}: ${m[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
