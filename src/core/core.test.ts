import { describe, expect, it } from "vitest";
import { createMemoryStorage } from "./storage/memory";
import { applyAppearance, resolveTheme } from "./theme/theme";
import { DEFAULT_SETTINGS } from "./settings/schema";
import { listBackground, trackBackground } from "./perf/listeners";
import { formatBytes } from "./perf/metrics";

describe("theme", () => {
  it("resolves system mode from the OS preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("writes appearance onto the root element without reload", () => {
    const root = document.createElement("html");
    applyAppearance({ ...DEFAULT_SETTINGS, theme: "light", accent: "sage", fontSize: 16, reduceMotion: true, uiLocale: "ru" }, root);
    expect(root.dataset.theme).toBe("light");
    expect(root.dataset.accent).toBe("sage");
    expect(root.dataset.motion).toBe("reduced");
    expect(root.lang).toBe("ru");
    expect(root.style.getPropertyValue("--font-size")).toBe("16px");
  });
});

describe("memory storage", () => {
  it("upserts settings without touching other keys", async () => {
    const s = createMemoryStorage();
    await s.putSettings({ a: 1, b: 2 });
    await s.putSettings({ b: 3 });
    expect(await s.getSettings()).toEqual({ a: 1, b: 3 });
    await s.clearSettings();
    expect(await s.getSettings()).toEqual({});
  });

  it("returns newest activity first, counts by day and prunes", async () => {
    let now = 1000;
    const s = createMemoryStorage(() => now);
    await s.addActivity("appOpened");
    now = 2000;
    await s.addActivity("moduleOpened", "settings");
    now = 3000;
    await s.addActivity("moduleOpened", "dashboard");
    const recent = await s.recentActivity(2);
    expect(recent.map((e) => e.ref)).toEqual(["dashboard", "settings"]);
    expect(await s.countActivitySince(1500)).toEqual({ moduleOpened: 2 });
    await s.pruneActivity(1);
    expect((await s.recentActivity(10)).length).toBe(1);
    await s.clearActivity();
    expect(await s.recentActivity(10)).toEqual([]);
  });
});

describe("background registry", () => {
  it("tracks and releases listeners exactly once", () => {
    const r1 = trackBackground("x");
    const r2 = trackBackground("x");
    expect(listBackground()).toEqual([{ name: "x", count: 2 }]);
    r1();
    r1();
    expect(listBackground()).toEqual([{ name: "x", count: 1 }]);
    r2();
    expect(listBackground()).toEqual([]);
  });
});

it("formats byte sizes", () => {
  const f = (n: number, o?: Intl.NumberFormatOptions) => new Intl.NumberFormat("en", o).format(n);
  expect(formatBytes(512, f)).toBe("512 B");
  expect(formatBytes(1536, f)).toBe("1.5 KB");
  expect(formatBytes(null, f)).toBe("—");
});
