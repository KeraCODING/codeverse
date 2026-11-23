import { describe, expect, it } from "vitest";
import { TERMS, findTerm } from "./keywords";
import { ERROR_PATTERNS, extractLine, fillGroups, matchErrors } from "./errors";
import { detectLanguage, explainCode } from "./explain";
import { normalize, search } from "./search";
import { COMPARE_LANGS, CONCEPTS, PROFILES } from "./compare";
import { LESSON_INDEX } from "../content";
import { createMemoryStorage } from "../core/storage/memory";

const lessonIds = new Set(LESSON_INDEX.map((l) => l.id));

describe("keyword knowledge base", () => {
  it("has unique ids, az + en meanings and valid lesson links", () => {
    expect(new Set(TERMS.map((t) => t.id)).size).toBe(TERMS.length);
    expect(TERMS.length).toBeGreaterThanOrEqual(60);
    for (const t of TERMS) {
      expect(t.meaning.az && t.meaning.en, t.id).toBeTruthy();
      for (const l of t.lessons) expect(lessonIds.has(l), `${t.id} → ${l}`).toBe(true);
    }
  });

  it("finds tokens as written in code", () => {
    expect(findTerm("def", "python")?.id).toBe("py-def");
    expect(findTerm("select", "sql")?.id).toBe("sql-select");
    expect(findTerm("False", "python")?.id).toBe("py-true");
    expect(findTerm("===", "javascript")?.id).toBe("js-strict-eq");
    expect(findTerm("def", "javascript")).toBeUndefined();
  });
});

describe("error translator", () => {
  const samples: [string, string, string[]?][] = [
    ["Traceback (most recent call last):\n  File \"app.py\", line 3, in <module>\n    print(Name)\nNameError: name 'Name' is not defined", "py-nameerror", ["Name"]],
    ['TypeError: can only concatenate str (not "int") to str', "py-concat", ["int"]],
    ["TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'", "py-unsupported-operand", ["+", "NoneType", "int"]],
    ["IndentationError: expected an indented block after 'if' statement on line 1", "py-indent"],
    ["SyntaxError: invalid syntax", "py-syntax"],
    ["IndexError: list index out of range", "py-index"],
    ["KeyError: 'email'", "py-key"],
    ["ZeroDivisionError: division by zero", "py-zero"],
    ["ModuleNotFoundError: No module named 'requests'", "py-module", ["requests"]],
    ["AttributeError: 'NoneType' object has no attribute 'append'", "py-attr-none", ["append"]],
    ["ValueError: invalid literal for int() with base 10: 'abc'", "py-value-int", ["abc"]],
    ["Uncaught ReferenceError: total is not defined\n    at app.js:4:13", "js-not-defined", ["total"]],
    ["ReferenceError: Cannot access 'city' before initialization", "js-tdz", ["city"]],
    ["TypeError: Assignment to constant variable.", "js-const-assign"],
    ["TypeError: Cannot read properties of undefined (reading 'name')", "js-read-undefined", ["undefined", "name"]],
    ["TypeError: items.foreach is not a function", "js-not-function", ["items.foreach"]],
    ["Uncaught SyntaxError: Unexpected token '}'", "js-unexpected-token", ["}"]],
    ["Uncaught (in promise) TypeError: Failed to fetch", "js-unhandled-promise"],
    ["Error: Cannot find module 'express'", "node-module", ["express"]],
    ["Error: no such table: userz", "sql-no-table", ["userz"]],
    ['ERROR:  column "baku" does not exist', "sql-no-column"],
    ['Error: near "FROM": syntax error', "sql-syntax", ["FROM"]],
  ];

  it.each(samples)("recognises %#", (text, id, groups) => {
    const m = matchErrors(text);
    expect(m.map((x) => x.pattern.id)).toContain(id);
    if (groups) expect(m.find((x) => x.pattern.id === id)!.groups.filter(Boolean)).toEqual(groups);
  });

  it("covers every pattern with a sample", () => {
    const tested = new Set(samples.map((s) => s[1]));
    for (const p of ERROR_PATTERNS) expect(tested.has(p.id), p.id).toBe(true);
  });

  it("does not report a JavaScript SyntaxError as Python", () => {
    expect(matchErrors("Uncaught SyntaxError: Unexpected token '}'").map((x) => x.pattern.id)).not.toContain("py-syntax");
  });

  it("says nothing rather than guessing", () => {
    expect(matchErrors("everything is fine")).toEqual([]);
  });

  it("extracts line numbers and fills placeholders", () => {
    expect(extractLine('File "app.py", line 3, in <module>')).toBe(3);
    expect(extractLine("at main (app.js:12:5)")).toBe(12);
    expect(fillGroups("name `{1}` / {2}", ["x", "y"])).toBe("name `x` / y");
  });

  it("has az + en text and valid lessons for every pattern", () => {
    for (const p of ERROR_PATTERNS) {
      expect(p.title.az && p.title.en && p.meaning.az && p.meaning.en, p.id).toBeTruthy();
      for (const c of [...p.causes, ...p.fixes]) expect(c.az && c.en, p.id).toBeTruthy();
      for (const l of p.lessons) expect(lessonIds.has(l), `${p.id} → ${l}`).toBe(true);
    }
  });
});

describe("code explanation engine", () => {
  const py = 'def average(numbers):\n    if len(numbers) == 0:\n        return 0\n    total = 0\n    for n in numbers:\n        total += n\n    return total / len(numbers)\n\nscores = [78, 92, 85]\nprint(average(scores))';

  it("detects the language", () => {
    expect(detectLanguage(py)).toBe("python");
    expect(detectLanguage("const a = 1;\nconsole.log(a);")).toBe("javascript");
    expect(detectLanguage("SELECT * FROM users;")).toBe("sql");
    expect(detectLanguage("")).toBeNull();
  });

  it("explains every line of a typical Python function", () => {
    const r = explainCode(py, "python");
    expect(r.recognised).toBe(100);
    expect(r.lines[0].text.en).toContain("Defines a function `average`");
    expect(r.lines[4].text.en).toContain("each item of `numbers`");
    expect(r.lines[5].text.en).toContain("same as `total = total + n`");
    expect(r.lines[1].depth).toBe(1);
    expect(r.lines[2].depth).toBe(2);
    const tokens = r.words.map((w) => w.token);
    expect(tokens).toEqual(expect.arrayContaining(["def", "if", "len", "return", "for", "print", "average", "total"]));
    expect(r.words.find((w) => w.token === "numbers")?.definedAt).toEqual({ line: 1, as: "parameter" });
    expect(r.words.find((w) => w.token === "n")?.definedAt).toEqual({ line: 5, as: "loopVar" });
  });

  it("explains JavaScript, including arrow functions and blocks", () => {
    const r = explainCode('const square = (n) => n * n;\nlet total = 0;\nfor (const p of prices) {\n  total += p;\n}\nconsole.log(square(total));', "javascript");
    expect(r.recognised).toBe(100);
    expect(r.lines[0].text.en).toContain("arrow function `square`");
    expect(r.lines[0].text.en).toContain("returns `n * n`");
    expect(r.lines[3].depth).toBe(1);
    expect(r.words.find((w) => w.token === "square")?.definedAt?.as).toBe("function");
  });

  it("explains SQL clause by clause", () => {
    const r = explainCode("SELECT name, city\nFROM users\nWHERE age >= 18\nORDER BY name\nLIMIT 10;", "sql");
    expect(r.recognised).toBe(100);
    expect(r.words.map((w) => w.token)).toEqual(expect.arrayContaining(["SELECT", "FROM", "WHERE", "ORDER BY", "LIMIT"]));
  });

  it("marks lines it cannot recognise instead of guessing", () => {
    const r = explainCode("x = [i * 2\n     for i in range(3)]", "python");
    expect(r.lines.some((l) => l.kind === "unknown")).toBe(true);
    expect(r.recognised).toBeLessThan(100);
  });

  it("all output text exists in az and en", () => {
    const r = explainCode(py, "python");
    for (const l of r.lines) if (l.kind !== "blank") expect(l.text.az && l.text.en).toBeTruthy();
  });
});

describe("universal search", () => {
  it("normalises Azerbaijani letters and case", () => {
    expect(normalize("Dəyişən ŞƏRT")).toBe("deyisen sert");
  });

  it("shows keyword entries first for an exact token", () => {
    const hits = search("async");
    expect(hits[0].doc.type).toBe("term");
    expect(hits.slice(0, 3).map((h) => h.doc.key)).toEqual(expect.arrayContaining(["term:js-async"]));
  });

  it("finds Azerbaijani words typed without special letters", () => {
    const keys = search("deyisen").map((h) => h.doc.key);
    expect(keys).toContain("term:c-variable");
  });

  it("tolerates typos", () => {
    const hit = search("fucntion").find((h) => h.doc.key === "term:c-function" || h.doc.key === "term:js-function");
    expect(hit?.fuzzy).toBe(true);
  });

  it("puts a recognised error first when an error message is pasted", () => {
    expect(search("NameError: name 'total' is not defined")[0].doc.key).toBe("error:py-nameerror");
  });

  it("filters by category and finds operators", () => {
    expect(search("===", { type: "term" })[0].doc.key).toBe("term:js-strict-eq");
    expect(search("python", { type: "lesson" }).every((h) => h.doc.type === "lesson")).toBe(true);
  });
});

describe("language comparison data", () => {
  it("has code for every language and az + en notes", () => {
    for (const c of CONCEPTS) {
      expect(c.title.az && c.title.en && c.note.az && c.note.en, c.id).toBeTruthy();
      for (const l of COMPARE_LANGS) expect(c.code[l.id]?.trim(), `${c.id}/${l.id}`).toBeTruthy();
      for (const id of c.lessons) expect(lessonIds.has(id)).toBe(true);
    }
    for (const l of COMPARE_LANGS) {
      const p = PROFILES[l.id];
      for (const k of ["execution", "memory", "strengths", "limitations"] as const) expect(p[k].az && p[k].en, `${l.id}.${k}`).toBeTruthy();
    }
  });
});

describe("search history storage", () => {
  it("de-duplicates, orders newest first and caps the list", async () => {
    const s = createMemoryStorage();
    await s.addSearch("a");
    await s.addSearch("b");
    await s.addSearch("a");
    expect(await s.recentSearches(10)).toEqual(["a", "b"]);
    for (let i = 0; i < 60; i++) await s.addSearch(`q${i}`);
    expect((await s.recentSearches(100)).length).toBe(50);
    await s.clearSearches();
    expect(await s.recentSearches(10)).toEqual([]);
  });

  it("stores favourites", async () => {
    const s = createMemoryStorage();
    await s.setFavorite("term:js-async", true);
    await s.setFavorite("lesson:python-loops", true);
    await s.setFavorite("term:js-async", false);
    expect(await s.getFavorites()).toEqual(["lesson:python-loops"]);
  });
});
