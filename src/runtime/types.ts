export interface RunError {
  name: string;
  message: string;
  line: number | null; // 1-based line in the user's code, when known
  detail?: string; // full, cleaned-up error text (e.g. a Python traceback) shown instead of "name: message"
}

export interface RunResult {
  ok: boolean;
  output: string; // console output (JS) or formatted result tables (SQL)
  error: RunError | null;
  timedOut: boolean;
  truncated: boolean;
  durationMs: number;
}

export const LIMITS = {
  timeoutMs: 3000,
  maxOutputChars: 50_000,
  maxOutputLines: 1000,
  maxCodeChars: 20_000,
  /** First Python run also loads the interpreter (~10 MB WebAssembly) before the run timer starts. */
  pythonLoadMs: 60_000,
  pythonTimeoutMs: 5000,
};

export type RunnableLang = "javascript" | "sql" | "python";

export interface RuntimeInfo {
  lang: "javascript" | "sql" | "python" | "other";
  available: boolean;
}

/** What Code Lab can execute. Python runs on the bundled Pyodide runtime (offline). */
export const RUNTIMES: RuntimeInfo[] = [
  { lang: "javascript", available: true },
  { lang: "sql", available: true },
  { lang: "python", available: true },
  { lang: "other", available: false },
];
