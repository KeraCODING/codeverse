// Python side of the sandbox. Kept in its own module (no browser APIs) so the unit tests can run
// exactly the same harness under Node.
//
// Each run gets a fresh globals dict, `input()` is replaced with a clear error (there is no
// keyboard in the sandbox), and tracebacks are reduced to the learner's own frames (`main.py`)
// with the real source lines, like CPython prints them.
export const PY_HARNESS = `
import sys, traceback, linecache

class InputNotSupported(Exception):
    pass

def _cv_no_input(prompt=""):
    raise InputNotSupported("input() is not available here: put the value in a variable instead")

def _cv_run(src):
    linecache.cache["main.py"] = (len(src), None, src.splitlines(True), "main.py")
    g = {"__name__": "__main__", "__builtins__": __builtins__, "input": _cv_no_input}
    try:
        code = compile(src, "main.py", "exec")
    except SyntaxError as e:
        text = "".join(traceback.format_exception_only(type(e), e))
        return (type(e).__name__, e.msg or str(e), e.lineno, text)
    try:
        exec(code, g)
        return None
    except SystemExit as e:
        if e.code in (None, 0):
            return None
        return ("SystemExit", str(e.code), None, "SystemExit: " + str(e.code) + "\\n")
    except BaseException as e:
        frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "main.py"]
        line = frames[-1].lineno if frames else None
        text = "Traceback (most recent call last):\\n" + "".join(traceback.format_list(frames)) + "".join(traceback.format_exception_only(type(e), e))
        return (type(e).__name__, str(e), line, text)
    finally:
        sys.stdout.flush()
        sys.stderr.flush()
`;

export interface PyFailure {
  name: string;
  message: string;
  line: number | null;
  traceback: string;
}

/** Minimal slice of the Pyodide API the harness needs (lets tests pass the Node instance). */
export interface PyLike {
  runPython(code: string): unknown;
  globals: object;
}

/** Installs the harness once per interpreter and returns a runner for learner code. */
export function installHarness(py: PyLike): (src: string) => PyFailure | null {
  py.runPython(PY_HARNESS);
  const run = (py.globals as { get(name: string): unknown }).get("_cv_run") as (src: string) => unknown;
  return (src) => {
    const res = run(src) as { toJs(): unknown[]; destroy(): void } | null | undefined;
    if (res == null) return null;
    const [name, message, line, traceback] = res.toJs() as [string, string, number | null, string];
    res.destroy();
    return { name, message, line: line ?? null, traceback };
  };
}
