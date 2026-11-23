import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { buildExport, cleanTags, newCard, newNote, parseExport, review, validateCard, validateNote, validateProject, validateSnippet } from "./models";
import { Markdown } from "../ui/Markdown";
import { createMemoryStorage } from "../core/storage/memory";
import { PATHS } from "../content/paths";
import { PROJECT_GUIDES } from "../content/projectGuides";
import { LESSON_INDEX } from "../content";
import { MODULES } from "../app/modules";

const DAY = 86_400_000;

describe("spaced repetition (SM-2)", () => {
  it("grows intervals 1 → 6 → ease-scaled for good answers", () => {
    const now = 0;
    let c = newCard({}, now);
    c = review(c, "good", now);
    expect(c.interval).toBe(1);
    expect(c.due).toBe(DAY);
    c = review(c, "good", now);
    expect(c.interval).toBe(6);
    c = review(c, "good", now);
    expect(c.interval).toBe(Math.round(6 * c.ease));
    expect(c.reps).toBe(3);
    expect(c.correct).toBe(3);
  });

  it("'again' resets the streak, counts a lapse and comes back in 10 minutes", () => {
    let c = review(review(newCard({}, 0), "good", 0), "good", 0);
    c = review(c, "again", 1000);
    expect(c).toMatchObject({ reps: 0, interval: 0, lapses: 1 });
    expect(c.due).toBe(1000 + 10 * 60_000);
  });

  it("never lets ease fall below 1.3 and makes easy cards wait longer", () => {
    let c = newCard({}, 0);
    for (let i = 0; i < 20; i++) c = review(c, "again", 0);
    expect(c.ease).toBe(1.3);
    const g = review(newCard({}, 0), "good", 0);
    const e = review(newCard({}, 0), "easy", 0);
    expect(e.interval).toBeGreaterThanOrEqual(g.interval);
  });
});

describe("validators and import", () => {
  it("accepts valid items and rejects malformed ones", () => {
    const n = newNote({ title: "Loops", body: "# hi" });
    expect(validateNote(n)).toEqual(n);
    expect(validateNote({ ...n, id: "../../etc" })).toBeNull();
    expect(validateNote({ ...n, tags: [1, 2] })).toBeNull();
    expect(validateSnippet({ id: "s1", title: "x", code: "1", lang: "cobol" })?.lang).toBe("other");
    expect(validateProject({ id: "p1", name: "x", repoUrl: "javascript:alert(1)" })).toBeNull();
    expect(validateProject({ id: "p1", name: "x", repoUrl: "https://github.com/a/b" })?.repoUrl).toBe("https://github.com/a/b");
    expect(validateCard({ id: "c1", front: "f", back: "b", ease: 0.5 })?.ease).toBe(1.3);
  });

  it("round-trips an export and skips bad entries", () => {
    const good = newNote({ title: "A" });
    const text = buildExport("codeverse.notes", [good, { id: 5 }]);
    const r = parseExport(text, "codeverse.notes", validateNote);
    expect(r.items).toEqual([good]);
    expect(r.skipped).toBe(1);
    expect(() => parseExport(text, "codeverse.snippets", validateSnippet)).toThrow("wrongFormat");
    expect(() => parseExport("{", "codeverse.notes", validateNote)).toThrow("invalidJson");
  });

  it("normalises tags", () => {
    expect(cleanTags(" Python, loops ,python,, ")).toEqual(["python", "loops"]);
  });
});

describe("markdown renderer", () => {
  it("renders common syntax", () => {
    const html = renderToStaticMarkup(<Markdown text={"# Title\n\n- **bold** and `code`\n- [x] done\n\n```python\nprint(1)\n```"} />);
    expect(html).toContain("<h2>Title</h2>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<code>code</code>");
    expect(html).toContain("☑");
    expect(html).toContain("print");
  });

  it("never injects HTML or unsafe links from note text", () => {
    const html = renderToStaticMarkup(<Markdown text={'<img src=x onerror=alert(1)> [x](javascript:alert(1)) <script>bad()</script>'} />);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script");
    expect(html).not.toContain('href="javascript');
    expect(html).toContain("&lt;img");
  });

  it("does not hang on odd input", () => {
    expect(() => renderToStaticMarkup(<Markdown text={"```js extra\n> \n-\n#\n***"} />)).not.toThrow();
  });
});

describe("generic item storage", () => {
  it("stores, lists, deletes and clears per collection", async () => {
    const s = createMemoryStorage();
    await s.putItem("notes", { id: "a", updatedAt: 1 });
    await s.putItem("notes", { id: "b", updatedAt: 2 });
    await s.putItem("snippets", { id: "a", updatedAt: 3 });
    expect((await s.listItems("notes")).map((x) => x.id).sort()).toEqual(["a", "b"]);
    await s.deleteItem("notes", "a");
    expect((await s.listItems("notes")).map((x) => x.id)).toEqual(["b"]);
    await s.clearCollection("notes");
    expect(await s.listItems("notes")).toEqual([]);
    expect((await s.listItems("snippets")).length).toBe(1);
  });
});

describe("learning paths and project guides", () => {
  const lessons = new Set(LESSON_INDEX.map((l) => l.id));
  const moduleIds = new Set(MODULES.map((m) => m.id));

  it("has the 12 specified paths with valid, unique steps", () => {
    expect(PATHS.length).toBe(12);
    for (const p of PATHS) {
      expect(p.title.az && p.title.en && p.title.tr && p.title.ru, p.id).toBeTruthy();
      const ids = p.steps.map((s) => s.id);
      expect(new Set(ids).size, p.id).toBe(ids.length);
      for (const s of p.steps) {
        if (s.kind === "lesson") expect(lessons.has(s.ref), `${p.id} → ${s.ref}`).toBe(true);
        else {
          expect(s.text.az && s.text.en, `${p.id}/${s.id}`).toBeTruthy();
          if (s.kind === "module") expect(moduleIds.has(s.ref.split("/")[0]), `${p.id} → ${s.ref}`).toBe(true);
        }
      }
    }
  });

  it("project guides are complete", () => {
    for (const g of PROJECT_GUIDES) {
      expect(g.title.az && g.title.en && g.title.tr && g.title.ru, g.id).toBeTruthy();
      for (const x of [g.description, ...g.objectives, ...g.milestones, ...g.testing, ...g.evaluation]) expect(x.az && x.en, g.id).toBeTruthy();
      for (const id of g.prerequisites) expect(lessons.has(id), `${g.id} → ${id}`).toBe(true);
      expect(g.starter.length).toBeGreaterThan(0);
    }
  });
});
