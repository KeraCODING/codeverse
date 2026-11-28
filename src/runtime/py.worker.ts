/// <reference lib="webworker" />
// Python sandbox worker: Pyodide (CPython compiled to WebAssembly), shipped with the app in
// /pyodide/ so it works offline. The interpreter is loaded once and kept warm; every run uses a
// fresh globals dict. After loading, network APIs are removed from the worker scope so Python
// code (e.g. via the `js` module or `pyodide.http`) cannot reach the network.
import type { PyodideInterface } from "pyodide";
import { installHarness, type PyFailure } from "./pyHarness";
import { LIMITS } from "./types";

type Msg = { code: string };

let ready: Promise<(src: string) => PyFailure | null> | null = null;
let out = { text: [] as string[], lines: 0, chars: 0, truncated: false };

class OutputLimit extends Error {}

function write(chunk: string) {
  if (out.truncated) throw new OutputLimit();
  out.lines += chunk.split("\n").length - 1;
  out.chars += chunk.length;
  if (out.lines > LIMITS.maxOutputLines || out.chars > LIMITS.maxOutputChars) {
    out.truncated = true;
    // Stops the program: the write fails inside Python with an OSError.
    throw new OutputLimit();
  }
  out.text.push(chunk);
}

function lockDown() {
  const names = ["fetch", "XMLHttpRequest", "WebSocket", "WebTransport", "EventSource", "importScripts", "indexedDB", "caches", "BroadcastChannel", "Worker", "SharedWorker"];
  let o: object | null = self;
  while (o && o !== Object.prototype) {
    for (const n of names) {
      try {
        Object.defineProperty(o, n, { value: undefined, configurable: false, writable: false });
      } catch {
        /* not configurable */
      }
    }
    o = Object.getPrototypeOf(o);
  }
}

async function boot() {
  const indexURL = new URL(`${import.meta.env.BASE_URL}pyodide/`, self.location.origin).href;
  const mod = (await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`)) as { loadPyodide: (o: object) => Promise<PyodideInterface> };
  const py = await mod.loadPyodide({ indexURL, fullStdLib: false });
  // Streaming decoders: a multi-byte character (ə, ş, emoji) may be split across two writes.
  const outDec = new TextDecoder();
  const errDec = new TextDecoder();
  py.setStdout({ write: (buf: Uint8Array) => (write(outDec.decode(buf, { stream: true })), buf.length) });
  py.setStderr({ write: (buf: Uint8Array) => (write(errDec.decode(buf, { stream: true })), buf.length) });
  lockDown();
  return installHarness(py);
}

self.onmessage = async (ev: MessageEvent<Msg>) => {
  try {
    const first = !ready;
    ready ??= boot();
    const run = await ready;
    if (first) postMessage({ t: "ready" });
    out = { text: [], lines: 0, chars: 0, truncated: false };
    const fail = run(ev.data.code);
    const output = out.text.join("");
    if (out.truncated) postMessage({ t: "done", ok: true, output, truncated: true });
    else if (fail) postMessage({ t: "done", ok: false, output, error: { name: fail.name, message: fail.message, line: fail.line, detail: fail.traceback } });
    else postMessage({ t: "done", ok: true, output, truncated: false });
  } catch (e) {
    ready = null;
    const err = e instanceof Error ? e : new Error(String(e));
    postMessage({ t: "done", ok: false, output: "", error: { name: "PythonRuntimeError", message: err.message, line: null } });
  }
};
