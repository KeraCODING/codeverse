import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ActivityKind, Storage } from "../storage";
import { ACTIVITY_KEEP } from "../storage";
import { DEFAULT_SETTINGS, sanitizeSettings, type Settings } from "./schema";
import { applyAppearance, watchSystemTheme, type ResolvedTheme } from "../theme/theme";
import { trackBackground } from "../perf/listeners";

interface SettingsValue {
  settings: Settings;
  resolvedTheme: ResolvedTheme;
  storage: Storage;
  /** Validates and persists a partial update. Returns keys that were rejected. */
  update: (patch: Partial<Settings>) => Promise<string[]>;
  replaceAll: (next: Settings, kind: ActivityKind) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  logActivity: (kind: ActivityKind, ref?: string) => void;
  /** Bumps whenever the activity log changes, so views can re-query. */
  activityRev: number;
}

const Ctx = createContext<SettingsValue | null>(null);

export function SettingsProvider({ storage, initial, children }: { storage: Storage; initial: Settings; children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(initial);
  const [resolvedTheme, setResolved] = useState<ResolvedTheme>(() => applyAppearance(initial));
  const [activityRev, setActivityRev] = useState(0);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Appearance applies immediately on every change; no reload.
  useEffect(() => {
    setResolved(applyAppearance(settings));
  }, [settings]);

  // Only listen to the OS theme while System mode is selected.
  useEffect(() => {
    if (settings.theme !== "system") return;
    const release = trackBackground("systemThemeListener");
    const stop = watchSystemTheme(() => setResolved(applyAppearance(settingsRef.current)));
    return () => {
      stop();
      release();
    };
  }, [settings.theme]);

  const logActivity = useCallback(
    (kind: ActivityKind, ref?: string) => {
      if (!settingsRef.current.recordActivity) return;
      storage
        .addActivity(kind, ref ?? null)
        .then(() => storage.pruneActivity(settingsRef.current.lowResourceMode ? 100 : ACTIVITY_KEEP))
        .then(() => setActivityRev((r) => r + 1))
        .catch((e) => console.error("activity log failed", e));
    },
    [storage],
  );

  // Rapid changes (e.g. dragging a slider) produce one activity entry, not dozens.
  const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (changeTimer.current) clearTimeout(changeTimer.current);
  }, []);

  const update = useCallback(
    async (patch: Partial<Settings>) => {
      const { settings: next, rejected } = sanitizeSettings(patch, settingsRef.current);
      const accepted: Record<string, unknown> = {};
      for (const k of Object.keys(patch) as (keyof Settings)[]) if (!rejected.includes(k)) accepted[k] = next[k];
      if (Object.keys(accepted).length === 0) return rejected;
      settingsRef.current = next;
      setSettings(next);
      await storage.putSettings(accepted);
      if (changeTimer.current) clearTimeout(changeTimer.current);
      const keys = Object.keys(accepted).join(",");
      changeTimer.current = setTimeout(() => logActivity("settingsChanged", keys), 1500);
      return rejected;
    },
    [storage, logActivity],
  );

  const replaceAll = useCallback(
    async (next: Settings, kind: ActivityKind) => {
      await storage.clearSettings();
      await storage.putSettings({ ...next });
      settingsRef.current = next;
      setSettings(next);
      logActivity(kind);
    },
    [storage, logActivity],
  );

  const resetToDefaults = useCallback(() => replaceAll({ ...DEFAULT_SETTINGS }, "settingsReset"), [replaceAll]);

  const value = useMemo(
    () => ({ settings, resolvedTheme, storage, update, replaceAll, resetToDefaults, logActivity, activityRev }),
    [settings, resolvedTheme, storage, update, replaceAll, resetToDefaults, logActivity, activityRev],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings outside SettingsProvider");
  return v;
}
