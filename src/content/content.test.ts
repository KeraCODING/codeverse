import { describe, expect, it } from "vitest";
import { LANGUAGES } from "./catalog/languages";
import { FIELDS } from "./catalog/fields";
import { TECHNOLOGIES } from "./catalog/technologies";
import { LESSON_INDEX, loadLesson } from "./index";
import { contentChain, pick, translationCompleteness, type Lesson } from "./types";
import { tokenizeLine } from "../ui/highlight";
import { mergeProgress } from "../core/storage";
import { scoreQuiz } from "../modules/lesson/Quiz";

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe("catalog integrity", () => {
  it("has the full specified catalog with unique ids", () => {
    expect(LANGUAGES.length).toBe(33);
    expect(FIELDS.length).toBe(27);
    expect(TECHNOLOGIES.length).toBeGreaterThanOrEqual(45);
    expect(unique(LANGUAGES.map((l) => l.id))).toBe(true);
    expect(unique(FIELDS.map((f) => f.id))).toBe(true);
    expect(unique(TECHNOLOGIES.map((x) => x.id))).toBe(true);
  });

  it("every entry has az + en text and an https documentation link", () => {
    for (const l of LANGUAGES) {
      expect(l.desc.az && l.desc.en && l.uses.az && l.uses.en, l.id).toBeTruthy();
      expect(l.docs.url, l.id).toMatch(/^https:\/\//);
    }
    for (const x of TECHNOLOGIES) {
      expect(x.desc.az && x.desc.en, x.id).toBeTruthy();
      expect(x.docs.url, x.id).toMatch(/^https:\/\//);
    }
    for (const f of FIELDS) {
      expect(f.name.az && f.name.en && f.name.tr && f.name.ru, f.id).toBeTruthy();
      expect(f.desc.az && f.desc.en, f.id).toBeTruthy();
    }
  });

  it("all cross-references point to existing entries", () => {
    const langIds = new Set(LANGUAGES.map((l) => l.id));
    const techIds = new Set(TECHNOLOGIES.map((x) => x.id));
    for (const f of FIELDS) {
      for (const l of f.languages) expect(langIds.has(l), `${f.id} → ${l}`).toBe(true);
      for (const x of f.technologies) expect(techIds.has(x), `${f.id} → ${x}`).toBe(true);
    }
    for (const x of TECHNOLOGIES) if (x.language) expect(langIds.has(x.language), `${x.id} → ${x.language}`).toBe(true);
  });
});

describe("lessons", () => {
  it("index entries match their lesson files", async () => {
    for (const meta of LESSON_INDEX) {
      const l = await loadLesson(meta.id);
      expect(l, meta.id).not.toBeNull();
      expect({ id: l!.id, language: l!.language, order: l!.order, level: l!.level, title: l!.title }).toEqual(meta);
    }
  });

  it("are structurally valid and fully written in az and en", async () => {
    const all = new Set(LESSON_INDEX.map((l) => l.id));
    for (const meta of LESSON_INDEX) {
      const l = (await loadLesson(meta.id)) as Lesson;
      expect(translationCompleteness(l, "az"), `${l.id} az`).toBe(100);
      expect(translationCompleteness(l, "en"), `${l.id} en`).toBe(100);
      expect(l.examples.length).toBeGreaterThanOrEqual(3);
      for (const ex of l.examples) {
        expect(ex.lines.length, `${l.id}: "${ex.title.en}" needs one note per line`).toBe(ex.code.split("\n").length);
      }
      expect(l.quiz.length).toBeGreaterThanOrEqual(3);
      for (const q of l.quiz) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      }
      expect(l.exercise.hints.length).toBeGreaterThan(0);
      for (const r of l.related) expect(all.has(r), `${l.id} related → ${r}`).toBe(true);
      expect(l.sources.length).toBeGreaterThan(0);
      for (const s of l.sources) expect(s.url).toMatch(/^https:\/\//);
      expect(Number.isNaN(Date.parse(l.reviewedAt))).toBe(false);
    }
  });

  it("reports tr/ru as incomplete instead of pretending they are translated", async () => {
    const l = (await loadLesson("python-variables"))!;
    expect(translationCompleteness(l, "tr")).toBeLessThan(100);
    expect(translationCompleteness(l, "ru")).toBeLessThan(100);
  });
});

describe("content helpers", () => {
  it("falls back from the preferred locale to az, then en", () => {
    expect(contentChain("ru")).toEqual(["ru", "az", "en"]);
    expect(pick({ en: "E", az: "A" }, contentChain("ru"))).toBe("A");
    expect(pick({ en: "E" }, contentChain("tr"))).toBe("E");
    expect(pick({ ru: "R", az: "A" }, contentChain("ru"))).toBe("R");
  });

  it("highlights Python and JavaScript tokens", () => {
    const py = tokenizeLine('if x > 5:  # check', "python");
    expect(py[0]).toEqual({ type: "kw", text: "if" });
    expect(py.at(-1)).toEqual({ type: "com", text: "# check" });
    expect(tokenizeLine('print(f"Hi {name}")', "python").map((t) => t.type)).toEqual(["fn", "text", "str", "text"]);
    const js = tokenizeLine("const n = `a${b}`; // c", "javascript");
    expect(js.map((t) => t.type)).toEqual(["kw", "text", "str", "text", "com"]);
    expect(tokenizeLine("x2 = 10", "python").find((t) => t.type === "num")?.text).toBe("10");
    const sql = tokenizeLine("select name from users where city = 'Baku' -- note", "sql");
    expect(sql.filter((t) => t.type === "kw").map((t) => t.text)).toEqual(["select", "from", "where"]);
    expect(sql.find((t) => t.type === "str")?.text).toBe("'Baku'");
    expect(sql.at(-1)).toEqual({ type: "com", text: "-- note" });
    // double quotes are identifiers in SQL, not strings
    expect(tokenizeLine('SELECT "name"', "sql").some((t) => t.type === "str")).toBe(false);
  });
});

describe("progress rules", () => {
  it("opening a lesson never completes it", () => {
    const r = mergeProgress(undefined, "l1", { type: "opened" }, 1);
    expect(r.state).toBe("started");
    expect(r.attempts).toBe(0);
  });

  it("completion requires a passing score and is never lost afterwards", () => {
    let r = mergeProgress(undefined, "l1", { type: "quiz", score: 50, passScore: 70 }, 1);
    expect(r).toMatchObject({ state: "attempted", bestScore: 50, attempts: 1 });
    r = mergeProgress(r, "l1", { type: "quiz", score: 75, passScore: 70 }, 2);
    expect(r).toMatchObject({ state: "completed", bestScore: 75, attempts: 2 });
    r = mergeProgress(r, "l1", { type: "quiz", score: 25, passScore: 70 }, 3);
    expect(r).toMatchObject({ state: "completed", bestScore: 75, attempts: 3 });
  });

  it("scores quizzes as a percentage of correct answers", async () => {
    const l = (await loadLesson("javascript-functions"))!;
    expect(scoreQuiz(l.quiz, l.quiz.map((q) => q.answer))).toBe(100);
    expect(scoreQuiz(l.quiz, l.quiz.map(() => null))).toBe(0);
    expect(scoreQuiz(l.quiz, [l.quiz[0].answer, null, null])).toBe(33);
  });
});

describe("simple explanations", () => {
  it("every lesson starts with a plain-words explanation in az and en", async () => {
    const { LESSON_INDEX, loadLesson } = await import("./index");
    for (const meta of LESSON_INDEX) {
      const l = (await loadLesson(meta.id))!;
      expect(l.simple.az && l.simple.en, l.id).toBeTruthy();
      expect(l.simple.az!.length, l.id).toBeGreaterThan(120);
    }
  });
});
