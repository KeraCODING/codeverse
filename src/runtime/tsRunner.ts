import { transform } from "sucrase";
import { runJs } from "./jsRunner";
import type { RunResult } from "./types";

/**
 * TypeScript → JavaScript, then the normal JS sandbox. Sucrase removes type annotations,
 * interfaces, enums etc. while keeping every line where it was, so error line numbers still
 * point at the learner's TypeScript. Types are removed, not checked (no tsc in the app).
 */
export function stripTypes(code: string): string {
  return transform(code, { transforms: ["typescript"], disableESTransforms: true, keepUnusedImports: false }).code;
}

export async function runTs(code: string): Promise<RunResult> {
  let js: string;
  try {
    js = stripTypes(code);
  } catch (e) {
    const err = e as Error & { loc?: { line: number } };
    const m = /\((\d+):\d+\)/.exec(err.message);
    return {
      ok: false,
      output: "",
      error: { name: "SyntaxError", message: err.message.replace(/\s*\(\d+:\d+\)$/, ""), line: err.loc?.line ?? (m ? Number(m[1]) : null) },
      timedOut: false,
      truncated: false,
      durationMs: 0,
    };
  }
  return runJs(js);
}
