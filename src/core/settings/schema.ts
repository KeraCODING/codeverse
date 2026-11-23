// Settings schema: types, defaults and strict validation.
// Every value read from storage or an import file passes through `sanitizeSettings`,
// so a corrupt or hostile file can never put an invalid value into the app.

export const LOCALES = ["az", "tr", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const THEMES = ["dark", "light", "system"] as const;
export type ThemeMode = (typeof THEMES)[number];

export const ACCENTS = ["slate", "sage", "sand", "rose", "violet"] as const;
export type Accent = (typeof ACCENTS)[number];

export const DENSITIES = ["comfortable", "compact"] as const;
export const SKILL_LEVELS = ["absolute", "beginner", "intermediate", "advanced", "professional"] as const;
export const HINT_MODES = ["progressive", "onRequest", "off"] as const;
export const SOLUTION_MODES = ["afterAttempts", "onRequest", "never"] as const;
export const LEARNING_MODES = ["learn", "practice", "challenge"] as const;

export const START_PAGES = ["dashboard", "languages", "search", "codelab", "notes", "last"] as const;

export interface Settings {
  // General
  startPage: (typeof START_PAGES)[number];
  defaultLearningMode: (typeof LEARNING_MODES)[number];
  // Appearance
  theme: ThemeMode;
  accent: Accent;
  fontSize: number; // px, interface
  density: (typeof DENSITIES)[number];
  sidebarWidth: number; // px
  sidebarCollapsed: boolean;
  reduceMotion: boolean;
  // Language
  uiLocale: Locale;
  lessonLocale: Locale;
  searchLocale: Locale;
  showEnglishTerms: boolean;
  // Learning
  skillLevel: (typeof SKILL_LEVELS)[number];
  dailyGoalMinutes: number;
  hintMode: (typeof HINT_MODES)[number];
  solutionMode: (typeof SOLUTION_MODES)[number];
  // Editor (applied by Code Lab, Phase 4)
  editorFontFamily: string;
  editorFontSize: number;
  editorTabSize: number;
  editorWordWrap: boolean;
  editorLineNumbers: boolean;
  editorAutoSave: boolean;
  editorBracketMatching: boolean;
  // Privacy
  recordActivity: boolean;
  saveSearchHistory: boolean;
  // Performance
  lowResourceMode: boolean;
}

export const DEFAULT_SETTINGS: Readonly<Settings> = Object.freeze({
  startPage: "dashboard",
  defaultLearningMode: "learn",
  theme: "system",
  accent: "slate",
  fontSize: 14,
  density: "comfortable",
  sidebarWidth: 240,
  sidebarCollapsed: false,
  reduceMotion: false,
  uiLocale: "az",
  lessonLocale: "az",
  searchLocale: "az",
  showEnglishTerms: true,
  skillLevel: "beginner",
  dailyGoalMinutes: 30,
  hintMode: "progressive",
  solutionMode: "onRequest",
  editorFontFamily: "JetBrains Mono",
  editorFontSize: 14,
  editorTabSize: 2,
  editorWordWrap: false,
  editorLineNumbers: true,
  editorAutoSave: true,
  editorBracketMatching: true,
  recordActivity: true,
  saveSearchHistory: true,
  lowResourceMode: false,
} satisfies Settings);

type Rule =
  | { kind: "enum"; values: readonly string[] }
  | { kind: "int"; min: number; max: number }
  | { kind: "bool" }
  | { kind: "font" };

export const RULES: { [K in keyof Settings]: Rule } = {
  startPage: { kind: "enum", values: START_PAGES },
  defaultLearningMode: { kind: "enum", values: LEARNING_MODES },
  theme: { kind: "enum", values: THEMES },
  accent: { kind: "enum", values: ACCENTS },
  fontSize: { kind: "int", min: 12, max: 20 },
  density: { kind: "enum", values: DENSITIES },
  sidebarWidth: { kind: "int", min: 200, max: 360 },
  sidebarCollapsed: { kind: "bool" },
  reduceMotion: { kind: "bool" },
  uiLocale: { kind: "enum", values: LOCALES },
  lessonLocale: { kind: "enum", values: LOCALES },
  searchLocale: { kind: "enum", values: LOCALES },
  showEnglishTerms: { kind: "bool" },
  skillLevel: { kind: "enum", values: SKILL_LEVELS },
  dailyGoalMinutes: { kind: "int", min: 5, max: 480 },
  hintMode: { kind: "enum", values: HINT_MODES },
  solutionMode: { kind: "enum", values: SOLUTION_MODES },
  editorFontFamily: { kind: "font" },
  editorFontSize: { kind: "int", min: 10, max: 28 },
  editorTabSize: { kind: "int", min: 1, max: 8 },
  editorWordWrap: { kind: "bool" },
  editorLineNumbers: { kind: "bool" },
  editorAutoSave: { kind: "bool" },
  editorBracketMatching: { kind: "bool" },
  recordActivity: { kind: "bool" },
  saveSearchHistory: { kind: "bool" },
  lowResourceMode: { kind: "bool" },
};

/** Returns the valid value, or undefined when `value` breaks the rule. */
export function validateValue(rule: Rule, value: unknown): unknown {
  switch (rule.kind) {
    case "enum":
      return typeof value === "string" && rule.values.includes(value) ? value : undefined;
    case "int":
      return typeof value === "number" && Number.isInteger(value) && value >= rule.min && value <= rule.max
        ? value
        : undefined;
    case "bool":
      return typeof value === "boolean" ? value : undefined;
    case "font":
      // Font names only: letters, digits, spaces, hyphens. Blocks CSS injection.
      return typeof value === "string" && /^[\p{L}\p{N} \-]{1,48}$/u.test(value) ? value : undefined;
  }
}

export interface SanitizeResult {
  settings: Settings;
  rejected: string[]; // keys present but invalid or unknown
}

/** Merge untrusted input over defaults, keeping only valid known keys. */
export function sanitizeSettings(input: unknown, base: Settings = DEFAULT_SETTINGS): SanitizeResult {
  const settings = { ...base } as Settings;
  const rejected: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { settings, rejected: input === undefined || input === null ? [] : ["<root>"] };
  }
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!(key in RULES)) {
      rejected.push(key);
      continue;
    }
    const valid = validateValue(RULES[key as keyof Settings], value);
    if (valid === undefined) rejected.push(key);
    else (settings as unknown as Record<string, unknown>)[key] = valid;
  }
  return { settings, rejected };
}

export const SETTINGS_EXPORT_FORMAT = "codeverse.settings";
export const SETTINGS_EXPORT_VERSION = 1;

export function buildSettingsExport(settings: Settings) {
  return {
    format: SETTINGS_EXPORT_FORMAT,
    version: SETTINGS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
  };
}

export function parseSettingsExport(text: string): SanitizeResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("invalidJson");
  }
  const d = data as { format?: unknown; version?: unknown; settings?: unknown };
  if (!d || d.format !== SETTINGS_EXPORT_FORMAT) throw new Error("wrongFormat");
  if (typeof d.version !== "number" || d.version > SETTINGS_EXPORT_VERSION) throw new Error("unsupportedVersion");
  return sanitizeSettings(d.settings);
}
