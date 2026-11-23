import { LIMITS, type RunResult } from "./types";

/** Runs SQL against a fresh copy of the practice database in a worker. Never throws. */
export function runSql(code: string, timeoutMs = LIMITS.timeoutMs * 2): Promise<RunResult> {
  const started = performance.now();
  // Vite bundles the worker (and the WASM file it imports) as separate, lazily loaded assets.
  const worker = new Worker(new URL("./sql.worker.ts", import.meta.url), { type: "module" });
  return new Promise<RunResult>((resolve) => {
    let finished = false;
    const finish = (r: Omit<RunResult, "durationMs">) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      resolve({ ...r, durationMs: Math.round(performance.now() - started) });
    };
    // The first run also downloads/compiles the WASM module, so SQL gets a longer limit.
    const timer = setTimeout(
      () => finish({ ok: false, output: "", error: { name: "Timeout", message: `Stopped after ${timeoutMs} ms`, line: null }, timedOut: true, truncated: false }),
      timeoutMs,
    );
    worker.onmessage = (ev) => {
      const m = ev.data as { ok: boolean; output?: string; changes?: number; truncated?: boolean; error?: RunResult["error"] };
      if (m.ok) {
        const out = m.output || (m.changes ? `(${m.changes} row(s) changed)` : "");
        finish({ ok: true, output: out, error: null, timedOut: false, truncated: !!m.truncated });
      } else finish({ ok: false, output: "", error: m.error ?? null, timedOut: false, truncated: false });
    };
    worker.onerror = (ev) => {
      ev.preventDefault();
      finish({ ok: false, output: "", error: { name: "Error", message: ev.message || "SQL runtime failed to start", line: null }, timedOut: false, truncated: false });
    };
    worker.postMessage({ code: code.slice(0, LIMITS.maxCodeChars) });
  });
}
