// @vitest-environment node
import { describe, expect, it, beforeAll } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { formatArgs, formatTable, formatValue, normalizeOutput } from "./format";
import { checkOutput } from "./index";
import { SAMPLE_DB_SQL } from "./sampleDb";
import { CHALLENGES, DEBUG_TASKS, type PracticeTask } from "../content/practice";
import { LESSON_INDEX, loadLesson } from "../content";
import { loadPyodide } from "pyodide";
import { installHarness, type PyFailure } from "./pyHarness";

describe("Node-style value formatting", () => {
  it("formats primitives, arrays and objects like console.log", () => {
    expect(formatArgs(["Total:", 37.5])).toBe("Total: 37.5");
    expect(formatValue([12, 8])).toBe("[ 12, 8 ]");
    expect(formatValue([])).toBe("[]");
    expect(formatValue({ js: 3, sql: 1 })).toBe("{ js: 3, sql: 1 }");
    expect(formatValue(["a", "b"])).toBe("[ 'a', 'b' ]");
    expect(formatValue({ "a-b": null, u: undefined })).toBe("{ 'a-b': null, u: undefined }");
    expect(formatValue(new Map([["a", 1]]))).toBe("Map(1) { 'a' => 1 }");
    expect(formatValue(new Set([1, 2]))).toBe("Set(2) { 1, 2 }");
    expect(formatValue(function hi() {})).toBe("[Function: hi]");
    expect(formatValue(10n)).toBe("10n");
    expect(formatValue({ a: { b: { c: { d: 1 } } } })).toBe("{ a: { b: { c: [Object] } } }");
  });

  it("survives circular structures", () => {
    const o: Record<string, unknown> = { name: "x" };
    o.self = o;
    expect(formatValue(o)).toBe("{ name: 'x', self: [Circular] }");
  });

  it("is self-contained so it can be embedded into the sandbox worker", () => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const rebuilt = new Function(`return (${String(formatValue)})`)() as typeof formatValue;
    expect(rebuilt([1, { a: "x" }], true)).toBe("[ 1, { a: 'x' } ]");
  });

  it("formats SQL result tables like the lessons", () => {
    expect(formatTable(["name", "age"], [["Aysel", 24], ["Elvin", null]])).toBe("name  | age\nAysel | 24\nElvin | NULL");
  });

  it("compares output ignoring trailing whitespace and line-ending style", () => {
    expect(normalizeOutput("a  \r\nb\n\n")).toBe("a\nb");
    const ok = { ok: true, output: "15\n", error: null, timedOut: false, truncated: false, durationMs: 1 };
    expect(checkOutput(ok, "15").passed).toBe(true);
    expect(checkOutput({ ...ok, ok: false }, "15").passed).toBe(false);
  });
});

// ---- Verify every expected output by actually running the reference code ----

function runJsInNode(code: string): string {
  const lines: string[] = [];
  const fakeConsole = { log: (...a: unknown[]) => lines.push(formatArgs(a)) };
  new Function("console", code)(fakeConsole);
  return lines.join("\n");
}

let SQL: SqlJsStatic;
beforeAll(async () => {
  const require = createRequire(import.meta.url);
  const wasm = readFileSync(require.resolve("sql.js/dist/sql-wasm.wasm"));
  SQL = await initSqlJs({ wasmBinary: wasm, useOldExtensionFunctions: false });
});

function runSqlInNode(code: string): string {
  const db = new SQL.Database();
  db.exec(SAMPLE_DB_SQL);
  try {
    return db.exec(code).map((r) => formatTable(r.columns, r.values)).join("\n\n");
  } finally {
    db.close();
  }
}

// Python: the real interpreter (Pyodide under Node) with exactly the harness the app's worker uses.
let pyRun: (src: string) => PyFailure | null;
let pyOut: string[] = [];
beforeAll(async () => {
  const py = await loadPyodide();
  const dec = new TextDecoder();
  py.setStdout({ write: (b: Uint8Array) => (pyOut.push(dec.decode(b, { stream: true })), b.length) });
  py.setStderr({ write: (b: Uint8Array) => (pyOut.push(dec.decode(b, { stream: true })), b.length) });
  pyRun = installHarness(py);
}, 60_000);

function runPyInNode(code: string): string {
  pyOut = [];
  const fail = pyRun(code);
  if (fail) throw new Error(`${fail.name}: ${fail.message}`);
  return pyOut.join("");
}

const run = (t: Pick<PracticeTask, "lang">, code: string) =>
  t.lang === "javascript" ? runJsInNode(code) : t.lang === "python" ? runPyInNode(code) : runSqlInNode(code);
const safeRun = (t: Pick<PracticeTask, "lang">, code: string) => {
  try {
    return run(t, code);
  } catch (e) {
    return `ERROR ${(e as Error).message}`;
  }
};

describe("practice tasks", () => {
  it.each(CHALLENGES.map((c) => [c.id, c] as const))("challenge %s: solution produces the expected output", (_id, c) => {
    expect(normalizeOutput(run(c, c.solution))).toBe(normalizeOutput(c.expected));
  });

  it.each(DEBUG_TASKS.map((d) => [d.id, d] as const))("debug %s: fix passes, buggy starter does not", (_id, d) => {
    expect(normalizeOutput(run(d, d.solution))).toBe(normalizeOutput(d.expected));
    expect(normalizeOutput(safeRun(d, d.starter))).not.toBe(normalizeOutput(d.expected));
  });

  it("challenge starters do not already pass", () => {
    for (const c of CHALLENGES) expect(normalizeOutput(safeRun(c, c.starter)), c.id).not.toBe(normalizeOutput(c.expected));
  });

  it("all tasks have az + en text, unique ids and valid lessons", () => {
    const all = [...CHALLENGES, ...DEBUG_TASKS];
    expect(new Set(all.map((x) => x.id)).size).toBe(all.length);
    const lessonIds = new Set(LESSON_INDEX.map((l) => l.id));
    for (const x of all) {
      expect(x.title.az && x.title.en && x.task.az && x.task.en, x.id).toBeTruthy();
      for (const h of x.hints) expect(h.az && h.en, x.id).toBeTruthy();
      for (const l of x.lessons) expect(lessonIds.has(l), `${x.id} → ${l}`).toBe(true);
    }
  });
});

describe("lesson exercises with automatic checks", () => {
  it("each lesson solution passes its own check, and the starter does not", async () => {
    let checked = 0;
    for (const meta of LESSON_INDEX) {
      const l = (await loadLesson(meta.id))!;
      const ex = l.exercise;
      if (!ex.check) continue;
      checked++;
      const task = { lang: ex.lang as PracticeTask["lang"] };
      expect(normalizeOutput(run(task, ex.solution)), l.id).toBe(normalizeOutput(ex.check.expected));
      expect(normalizeOutput(safeRun(task, ex.check.starter)), l.id).not.toBe(normalizeOutput(ex.check.expected));
    }
    expect(checked).toBe(LESSON_INDEX.length); // every lesson (JavaScript, Python, SQL) is checked automatically
  });
});

describe("Python sandbox harness", () => {
  it("prints like CPython and starts every run with fresh variables", () => {
    expect(runPyInNode('x = [1, 2]\nprint(x, {"a": 1}, 3 / 2, "ə")')).toBe("[1, 2] {'a': 1} 1.5 ə\n");
    expect(() => runPyInNode("print(x)")).toThrow(/NameError/);
  });

  it("reports the learner's line and a traceback without internal frames", () => {
    pyOut = [];
    const f = pyRun("a = 1\nb = 0\nprint(a / b)\n")!;
    expect(f.name).toBe("ZeroDivisionError");
    expect(f.line).toBe(3);
    expect(f.traceback).toContain('File "main.py", line 3');
    expect(f.traceback).toContain("print(a / b)");
    expect(f.traceback).not.toContain("_pyodide");
  });

  it("reports syntax and indentation errors with their line", () => {
    const s = pyRun("x = 1\nif x > 0\n    print(x)\n")!;
    expect(s.name).toBe("SyntaxError");
    expect(s.line).toBe(2);
    const i = pyRun("def f():\nprint(1)\n")!;
    expect(i.name).toBe("IndentationError");
    expect(i.line).toBe(2);
  });

  it("explains that input() is unavailable instead of hanging", () => {
    const f = pyRun('name = input("Name? ")\n')!;
    expect(f.name).toBe("InputNotSupported");
    expect(f.line).toBe(1);
  });

  it("treats sys.exit() / exit(0) as a normal end", () => {
    expect(pyRun('print("bye")\nimport sys\nsys.exit()\nprint("never")')).toBeNull();
  });
});
