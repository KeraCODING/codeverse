export interface RunError {
  name: string;
  message: string;
  line: number | null; // 1-based line in the user's code, when known
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
};

export type RunnableLang = "javascript" | "sql";

export interface RuntimeInfo {
  lang: "javascript" | "sql" | "python" | "other";
  available: boolean;
}

/** What Code Lab can execute today. Python needs an optional runtime that is not built yet. */
export const RUNTIMES: RuntimeInfo[] = [
  { lang: "javascript", available: true },
  { lang: "sql", available: true },
  { lang: "python", available: false },
  { lang: "other", available: false },
];
