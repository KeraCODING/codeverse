import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, RULES, buildSettingsExport, parseSettingsExport, sanitizeSettings } from "./schema";

describe("settings schema", () => {
  it("defaults satisfy every rule and Azerbaijani is the default language", () => {
    const { settings, rejected } = sanitizeSettings({ ...DEFAULT_SETTINGS });
    expect(rejected).toEqual([]);
    expect(settings).toEqual(DEFAULT_SETTINGS);
    expect(DEFAULT_SETTINGS.uiLocale).toBe("az");
    expect(Object.keys(RULES).sort()).toEqual(Object.keys(DEFAULT_SETTINGS).sort());
  });

  it("rejects unknown keys, wrong types and out-of-range values", () => {
    const { settings, rejected } = sanitizeSettings({
      theme: "neon",
      fontSize: 99,
      dailyGoalMinutes: 12.5,
      reduceMotion: "yes",
      __proto__x: 1,
      uiLocale: "ru",
    });
    expect(settings.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(settings.fontSize).toBe(DEFAULT_SETTINGS.fontSize);
    expect(settings.uiLocale).toBe("ru");
    expect(rejected.sort()).toEqual(["__proto__x", "dailyGoalMinutes", "fontSize", "reduceMotion", "theme"]);
  });

  it("blocks CSS injection through the editor font name", () => {
    expect(sanitizeSettings({ editorFontFamily: 'x"; } body { display:none' }).rejected).toEqual(["editorFontFamily"]);
    expect(sanitizeSettings({ editorFontFamily: "Fira Code" }).settings.editorFontFamily).toBe("Fira Code");
  });

  it("treats non-object input as empty", () => {
    expect(sanitizeSettings(null).settings).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings([1, 2]).rejected).toEqual(["<root>"]);
  });

  it("round-trips export and import", () => {
    const s = { ...DEFAULT_SETTINGS, theme: "light" as const, uiLocale: "tr" as const };
    const parsed = parseSettingsExport(JSON.stringify(buildSettingsExport(s)));
    expect(parsed.settings).toEqual(s);
  });

  it("refuses foreign, newer or malformed files", () => {
    expect(() => parseSettingsExport("{")).toThrow("invalidJson");
    expect(() => parseSettingsExport(JSON.stringify({ format: "other", version: 1 }))).toThrow("wrongFormat");
    expect(() => parseSettingsExport(JSON.stringify({ format: "codeverse.settings", version: 99 }))).toThrow("unsupportedVersion");
  });
});
