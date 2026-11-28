import { LIMITS, type RunResult } from "./types";

// One warm worker: loading the interpreter takes a few seconds, so it is kept between runs (each
// run still gets fresh globals). A run that exceeds the time limit terminates the worker — the
// only way to stop an endless loop without SharedArrayBuffer — and the next run loads a new one.
let worker: Worker | null = null;
let loaded = false;
let queue: Promise<unknown> = Promise.resolve();

const listeners = new Set<(state: PythonState) => void>();
export type PythonState = "idle" | "loading" | "ready";
let state: PythonState = "idle";
function setState(s: PythonState) {
  state = s;
  for (const l of listeners) l(s);
}
export const pythonState = () => state;
export function onPythonState(fn: (s: PythonState) => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./py.worker.ts", import.meta.url), { type: "module" });
    loaded = false;
  }
  return worker;
}

function kill() {
  worker?.terminate();
  worker = null;
  loaded = false;
  setState("idle");
}

function runOnce(code: string, timeoutMs: number): Promise<RunResult> {
  const started = performance.now();
  const w = getWorker();
  if (!loaded) setState("loading");
  return new Promise<RunResult>((resolve) => {
    let finished = false;
    let runStarted = started;
    const finish = (r: Omit<RunResult, "durationMs">) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      w.onmessage = null;
      w.onerror = null;
      resolve({ ...r, durationMs: Math.round(performance.now() - runStarted) });
    };
    const timeout = (ms: number, loading: boolean) =>
      setTimeout(() => {
        kill();
        // After an endless loop, warm up a fresh interpreter so the next run is instant again.
        if (!loading) setTimeout(preloadPython, 0);
        finish({
          ok: false,
          output: "",
          error: loading
            ? { name: "PythonRuntimeError", message: `Python did not start within ${Math.round(ms / 1000)} s`, line: null }
            : { name: "Timeout", message: `Stopped after ${ms} ms`, line: null },
          timedOut: !loading,
          truncated: false,
        });
      }, ms);
    let timer = loaded ? timeout(timeoutMs, false) : timeout(LIMITS.pythonLoadMs, true);
    w.onmessage = (ev) => {
      const m = ev.data as { t: "ready" } | { t: "done"; ok: boolean; output: string; truncated?: boolean; error?: RunResult["error"] };
      if (m.t === "ready") {
        // The interpreter is up: from now on only the learner's code is timed.
        loaded = true;
        setState("ready");
        clearTimeout(timer);
        runStarted = performance.now();
        timer = timeout(timeoutMs, false);
        return;
      }
      if (!m.ok && m.error?.name === "PythonRuntimeError") kill();
      else {
        loaded = true;
        setState("ready");
      }
      finish({ ok: m.ok, output: m.output, error: m.error ?? null, timedOut: false, truncated: !!m.truncated });
    };
    w.onerror = (ev) => {
      ev.preventDefault();
      kill();
      finish({ ok: false, output: "", error: { name: "PythonRuntimeError", message: ev.message || "Python runtime failed to start", line: null }, timedOut: false, truncated: false });
    };
    w.postMessage({ code: code.slice(0, LIMITS.maxCodeChars) });
  });
}

/** Runs Python in the sandbox worker. Runs are queued (one at a time). Never throws. */
export function runPython(code: string, timeoutMs = LIMITS.pythonTimeoutMs): Promise<RunResult> {
  const p = queue.then(() => runOnce(code, timeoutMs));
  queue = p.catch(() => undefined);
  return p;
}

/** Starts loading the interpreter in the background (e.g. when Code Lab switches to Python). */
export function preloadPython() {
  if (worker || loaded) return;
  void runPython("pass");
}
