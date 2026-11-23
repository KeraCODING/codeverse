import { lazy, Suspense, useEffect, useRef, type ComponentType, type LazyExoticComponent } from "react";
import { Sidebar } from "./Sidebar";
import { findModule, MODULES } from "./modules";
import { currentRoute, useRoute } from "./router";
import { ModuleStatusPage } from "../modules/status/ModuleStatusPage";
import { useI18n } from "../core/i18n/i18n";
import { useSettings } from "../core/settings/SettingsContext";

// React.lazy wrappers are created once per module, on first visit only.
const lazyCache = new Map<string, LazyExoticComponent<ComponentType>>();
function lazyFor(id: string) {
  let c = lazyCache.get(id);
  const m = findModule(id);
  if (!c && m?.load) {
    c = lazy(m.load);
    lazyCache.set(id, c);
  }
  return c;
}

export function startRoute(startPage: string): string {
  if (startPage !== "last") return startPage;
  try {
    const last = localStorage.getItem("cv.last");
    if (last && findModule(last)) return last;
  } catch {
    /* ignore */
  }
  return "dashboard";
}

export function Shell({ storageWarning }: { storageWarning?: string }) {
  const { settings, logActivity } = useSettings();
  const { t } = useI18n();
  const route = useRoute(startRoute(settings.startPage));
  const known = MODULES.some((m) => m.id === route);
  const id = known ? route : "dashboard";
  const mainRef = useRef<HTMLElement>(null);
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("cv.last", id);
    } catch {
      /* ignore */
    }
    document.title = `${t(`module.${id}.title`)} · CODEVERSE`;
    // Log real navigations only: not the initial page, not StrictMode's repeated effect run.
    const prev = prevId.current;
    prevId.current = id;
    if (prev === null || prev === id) return;
    logActivity("moduleOpened", id);
    mainRef.current?.focus({ preventScroll: true });
  }, [id, t, logActivity]);

  // Ctrl+K / ⌘K opens Universal Search from anywhere (a key listener, not polling).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (currentRoute() === "search") document.querySelector<HTMLInputElement>(".search-input.big")?.focus();
        else location.hash = "#/search";
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const Comp = lazyFor(id);

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        {t("nav.skip")}
      </a>
      <Sidebar active={id} />
      <main id="main" ref={mainRef} tabIndex={-1} className="main">
        {storageWarning && (
          <div className="banner warn" role="status">
            {t("storage.memoryFallback")}
          </div>
        )}
        {Comp ? (
          <Suspense fallback={<div className="loading">{t("common.loading")}</div>}>
            <Comp />
          </Suspense>
        ) : (
          <ModuleStatusPage id={id} />
        )}
      </main>
    </div>
  );
}
