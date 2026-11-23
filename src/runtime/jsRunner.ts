// JavaScript sandbox. Each run gets a brand-new dedicated Worker built from a Blob:
//  * no DOM, no access to the app's state, storage or Tauri APIs (workers cannot reach them);
//  * network, storage and script-loading APIs are removed from the worker scope before user code runs;
//  * hard timeout: the worker is terminated (stops infinite loops);
//  * output is capped in size and line count.
// The user's code is embedded in the worker source (no eval), so the app's CSP needs only
// `worker-src blob:` rather than `unsafe-eval`.
import { formatValue } from "./format";
import { LIMITS, type RunResult } from "./types";

const PRELUDE = (fmtSource: string, limits: typeof LIMITS) => `"use strict";
const __fmt = ${fmtSource};
(() => {
  // Remove network / storage / loading capabilities, on the scope and on its prototypes.
  const names = ["fetch", "XMLHttpRequest", "WebSocket", "WebTransport", "EventSource", "importScripts",
    "indexedDB", "caches", "BroadcastChannel", "Request", "Response", "navigator", "Worker", "SharedWorker"];
  let o = self;
  while (o && o !== Object.prototype) {
    for (const n of names) { try { Object.defineProperty(o, n, { value: undefined, configurable: false, writable: false }); } catch (e) {} }
    o = Object.getPrototypeOf(o);
  }
})();
const __out = { lines: 0, chars: 0, truncated: false };
const __emit = (level, args) => {
  if (__out.truncated) return;
  const text = args.map((a) => __fmt(a, true)).join(" ");
  __out.lines += text.split("\\n").length; __out.chars += text.length;
  if (__out.lines > ${limits.maxOutputLines} || __out.chars > ${limits.maxOutputChars}) { __out.truncated = true; postMessage({ t: "trunc" }); return; }
  postMessage({ t: "out", level, text });
};
const console = {
  log: (...a) => __emit("log", a), info: (...a) => __emit("log", a), debug: (...a) => __emit("log", a),
  warn: (...a) => __emit("warn", a), error: (...a) => __emit("error", a), table: (...a) => __emit("log", a),
};
self.console = console;
const __fail = (e) => {
  const err = e instanceof Error ? e : new Error(String(e));
  const m = /<anonymous>:(\\d+):\\d+|blob:[^\\s)]*:(\\d+):\\d+/.exec(err.stack || "");
  postMessage({ t: "err", name: err.name || "Error", message: err.message, line: m ? Number(m[1] || m[2]) : null });
};
self.addEventListener("unhandledrejection", (ev) => { ev.preventDefault(); __fail(ev.reason); });
// Like Node, the run ends when the main code AND all pending timers have finished.
// A never-cleared setInterval therefore runs until the timeout stops it.
let __mainDone = false;
const __timers = new Set();
const __check = () => { if (__mainDone && __timers.size === 0) postMessage({ t: "done" }); };
const __st = self.setTimeout.bind(self), __ct = self.clearTimeout.bind(self);
const __si = self.setInterval.bind(self), __ci = self.clearInterval.bind(self);
const __call = (fn, a) => { try { if (typeof fn === "function") fn(...a); } catch (e) { __fail(e); } };
self.setTimeout = (fn, ms, ...a) => { const id = __st(() => { __timers.delete(id); __call(fn, a); __check(); }, ms); __timers.add(id); return id; };
self.clearTimeout = (id) => { __timers.delete(id); __ct(id); __check(); };
self.setInterval = (fn, ms, ...a) => { const id = __si(() => __call(fn, a), ms); __timers.add(id); return id; };
self.clearInterval = (id) => { __timers.delete(id); __ci(id); __check(); };
`;

let preludeLines = -1;

function buildSource(code: string): { src: string; offset: number } {
  const prelude = PRELUDE(String(formatValue), LIMITS);
  // Lines before the user's first line: prelude + the async wrapper line.
  const offset = prelude.split("\n").length;
  preludeLines = offset;
  const src = `${prelude}(async () => {\n${code}\n})().then(() => { __mainDone = true; __check(); }, (e) => { __fail(e); __mainDone = true; __check(); });\n`;
  return { src, offset };
}

/** Runs JavaScript in an isolated worker. Never throws; failures come back in the result. */
export function runJs(code: string, timeoutMs = LIMITS.timeoutMs): Promise<RunResult> {
  const started = performance.now();
  const { src, offset } = buildSource(code.slice(0, LIMITS.maxCodeChars));
  const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
  const worker = new Worker(url);
  const out: string[] = [];
  let error: RunResult["error"] = null;
  let truncated = false;

  return new Promise<RunResult>((resolve) => {
    let finished = false;
    const finish = (timedOut: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({
        ok: !error && !timedOut,
        output: out.join("\n"),
        error: timedOut ? { name: "Timeout", message: `Stopped after ${timeoutMs} ms`, line: null } : error,
        timedOut,
        truncated,
        durationMs: Math.round(performance.now() - started),
      });
    };
    const timer = setTimeout(() => finish(true), timeoutMs);
    const toUserLine = (line: number | null) => (line && line > offset ? line - offset : null);

    worker.onmessage = (ev: MessageEvent) => {
      const m = ev.data as { t: string; text?: string; level?: string; name?: string; message?: string; line?: number | null };
      if (m.t === "out") out.push(m.level === "log" ? m.text! : `[${m.level}] ${m.text}`);
      else if (m.t === "trunc") truncated = true;
      else if (m.t === "err" && !error) error = { name: m.name!, message: m.message!, line: toUserLine(m.line ?? null) };
      else if (m.t === "done") finish(false);
    };
    // Syntax errors in the user's code surface here (the whole worker script fails to parse).
    worker.onerror = (ev: ErrorEvent) => {
      ev.preventDefault();
      const msg = ev.message || "Error";
      const [, name, rest] = /^(?:Uncaught\s+)?(\w*Error):\s*(.*)$/.exec(msg) ?? [null, "Error", msg];
      if (!error) error = { name, message: rest, line: toUserLine(ev.lineno || null) };
      finish(false);
    };
  });
}

/** For tests: number of prelude lines before user code. */
export const _preludeLineCount = () => preludeLines;
