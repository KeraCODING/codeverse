import type { RunResult, RunnableLang } from "./types";
import { normalizeOutput } from "./format";

export * from "./types";

/** Runs code in the matching sandbox. Each runner is a lazy chunk. */
export async function runCode(lang: RunnableLang, code: string): Promise<RunResult> {
  if (lang === "javascript") return (await import("./jsRunner")).runJs(code);
  if (lang === "typescript") return (await import("./tsRunner")).runTs(code);
  if (lang === "python") return (await import("./pyRunner")).runPython(code);
  return (await import("./sqlRunner")).runSql(code);
}

export const isRunnable = (lang: string): lang is RunnableLang => lang === "javascript" || lang === "typescript" || lang === "sql" || lang === "python";

export interface CheckResult {
  passed: boolean;
  expected: string;
  actual: string;
}

/** Output-based check: the program's output must equal the expected output (whitespace-normalised). */
export function checkOutput(result: RunResult, expected: string): CheckResult {
  const actual = normalizeOutput(result.output);
  const exp = normalizeOutput(expected);
  return { passed: result.ok && actual === exp, expected: exp, actual };
}
