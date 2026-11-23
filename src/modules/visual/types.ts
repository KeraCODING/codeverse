// Data model for Visual Learning. Every step is a precomputed, deterministic snapshot of the
// diagram (no live interpreter), so the same step always shows the same picture.
import type { CodeLang, L } from "../../content/types";

/** Language-neutral text (code, values) or localised text. */
export type Txt = string | L;

/** Visual emphasis of an item. "accent" = current focus, "success" = new/result, "error" = rejected/false, "muted" = out of play. */
export type Tone = "accent" | "success" | "warning" | "error" | "muted";

export interface VItem {
  /** Needed only when an arrow starts or ends here. Unique within a step. */
  id?: string;
  label: Txt;
  value?: Txt;
  tone?: Tone;
  /** Small marker such as "lo", "mid", "top". */
  tag?: Txt;
}

export interface VPanel {
  id: string;
  title: L;
  /** column (default), row (array cells / queue), stack (first item at the bottom). */
  layout?: "column" | "row" | "stack";
  items: VItem[];
}

/** Arrow between two item ids or panel ids of the same step. */
export interface VArrow {
  from: string;
  to: string;
}

export interface VStep {
  /** 1-based line of the code sample that is executing, or null for overview steps. */
  line: number | null;
  caption: L;
  panels: VPanel[];
  arrows?: VArrow[];
  /** Console output printed so far (cumulative). */
  output?: string[];
  /** Search topics: which index is compared in this step. */
  probe?: { algo: "linear" | "binary"; index: number };
}

export type LogKind = "sync" | "micro" | "timer";

export interface VTopic {
  id: string;
  title: L;
  summary: L;
  intro: L;
  code: { lang: CodeLang; src: string };
  steps: VStep[];
  meta?: {
    logKinds?: Record<string, LogKind>;
    search?: { arr: number[]; target: number };
  };
}
