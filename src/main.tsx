import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/base.css";
import { openStorage } from "./core/storage";
import { sanitizeSettings } from "./core/settings/schema";
import { SettingsProvider, useSettings } from "./core/settings/SettingsContext";
import { I18nProvider, loadDict, type Dict } from "./core/i18n/i18n";
import { Shell } from "./app/Shell";
import { ProgressProvider } from "./core/progress/ProgressContext";
import { markStartup } from "./core/perf/metrics";

// Interface language comes from settings and switches without reload.
function I18nBridge({ dict, children }: { dict: Dict; children: ReactNode }) {
  const { settings } = useSettings();
  return (
    <I18nProvider locale={settings.uiLocale} initial={dict}>
      {children}
    </I18nProvider>
  );
}

async function boot() {
  const { storage, fallbackReason } = await openStorage();
  const { settings, rejected } = sanitizeSettings(await storage.getSettings());
  if (rejected.length) console.warn("Ignored invalid stored settings:", rejected);
  const [dict] = await Promise.all([
    loadDict(settings.uiLocale),
    settings.uiLocale === "en" ? null : loadDict("en"),
    settings.recordActivity ? storage.addActivity("appOpened").catch(() => {}) : null,
  ]);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <SettingsProvider storage={storage} initial={settings}>
        <I18nBridge dict={dict}>
          <ProgressProvider>
            <Shell storageWarning={fallbackReason} />
          </ProgressProvider>
        </I18nBridge>
      </SettingsProvider>
    </StrictMode>,
  );
  requestAnimationFrame(() => markStartup());
}

boot().catch((err) => {
  console.error(err);
  document.getElementById("root")!.textContent = "CODEVERSE failed to start: " + String(err);
});
