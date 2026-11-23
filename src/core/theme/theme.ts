import type { Settings, ThemeMode } from "../settings/schema";

export type ResolvedTheme = "dark" | "light";

const SYSTEM_QUERY = "(prefers-color-scheme: dark)";

export function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): ResolvedTheme {
  if (mode === "system") return systemPrefersDark ? "dark" : "light";
  return mode;
}

export function systemPrefersDark(): boolean {
  return typeof matchMedia === "function" ? matchMedia(SYSTEM_QUERY).matches : true;
}

/** Writes appearance settings onto <html>. Pure DOM attribute/CSS-variable updates: no reload. */
export function applyAppearance(s: Settings, root: HTMLElement = document.documentElement): ResolvedTheme {
  const resolved = resolveTheme(s.theme, systemPrefersDark());
  root.dataset.theme = resolved;
  root.dataset.accent = s.accent;
  root.dataset.density = s.density;
  root.dataset.motion = s.reduceMotion || s.lowResourceMode ? "reduced" : "full";
  root.lang = s.uiLocale;
  root.style.setProperty("--font-size", `${s.fontSize}px`);
  root.style.setProperty("--sidebar-width", `${s.sidebarWidth}px`);
  root.style.setProperty("--code-font-size", `${s.editorFontSize}px`);
  root.style.setProperty("--code-font", `"${s.editorFontFamily}", "Cascadia Code", Consolas, monospace`);
  try {
    // Mirror for the pre-paint script in index.html.
    localStorage.setItem("cv.theme", s.theme === "system" ? "system" : resolved);
  } catch {
    /* storage blocked */
  }
  return resolved;
}

/**
 * Subscribes to OS theme changes. Event-driven (no polling). Returns the unsubscribe
 * function so callers can release the listener when System mode is turned off.
 */
export function watchSystemTheme(onChange: () => void): () => void {
  if (typeof matchMedia !== "function") return () => {};
  const mq = matchMedia(SYSTEM_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
