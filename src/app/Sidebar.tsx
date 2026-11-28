import { useLayoutEffect, useRef, useState } from "react";
import { GROUPS, MODULES, type ModuleDef } from "./modules";
import { Icon } from "../ui/Icon";
import { useI18n } from "../core/i18n/i18n";
import { useSettings } from "../core/settings/SettingsContext";
import { resolveTheme, systemPrefersDark } from "../core/theme/theme";
import { openPalette } from "./paletteBus";

export function Sidebar({ active }: { active: string }) {
  const { t } = useI18n();
  const { settings, update } = useSettings();
  const collapsed = settings.sidebarCollapsed;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ y: number; h: number } | null>(null);

  // Warm the module chunk when the pointer or focus reaches the link (skipped in low-resource mode).
  const prefetch = (m: ModuleDef) => {
    if (!settings.lowResourceMode && m.load) void m.load();
  };

  // The active highlight is one element that glides to the current link.
  useLayoutEffect(() => {
    const measure = () => {
      const link = scrollRef.current?.querySelector<HTMLElement>('.nav-link[aria-current="page"]');
      setIndicator(link ? { y: link.offsetTop, h: link.offsetHeight } : null);
    };
    measure();
    // Width changes (collapse animation, font size) move links: re-measure on resize only.
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    if (scrollRef.current) ro?.observe(scrollRef.current);
    return () => ro?.disconnect();
  }, [active, collapsed, settings.fontSize, settings.density]);

  const dark = resolveTheme(settings.theme, systemPrefersDark()) === "dark";
  const toggleTheme = () => void update({ theme: dark ? "light" : "dark" });

  return (
    <nav className="sidebar" data-collapsed={collapsed} aria-label={t("nav.label")}>
      <div className="sidebar-head">
        {!collapsed && (
          <a className="brand" href="#/dashboard">
            <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
            <span className="brand-name">CODEVERSE</span>
          </a>
        )}
        <button
          type="button"
          className="icon-btn"
          aria-expanded={!collapsed}
          aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
          title={collapsed ? t("nav.expand") : t("nav.collapse")}
          onClick={() => void update({ sidebarCollapsed: !collapsed })}
        >
          <Icon name="menu" />
        </button>
      </div>
      <div className="sidebar-scroll" ref={scrollRef}>
        {indicator && <span className="nav-indicator" aria-hidden="true" style={{ transform: `translateY(${indicator.y}px)`, height: indicator.h }} />}
        {GROUPS.map((g) => (
          <div className="nav-group" key={g} role="group" aria-label={t(`nav.group.${g}`)}>
            {!collapsed && <div className="nav-group-title">{t(`nav.group.${g}`)}</div>}
            <ul>
              {MODULES.filter((m) => m.group === g && !m.hidden).map((m) => {
                const label = t(`module.${m.id}.title`);
                return (
                  <li key={m.id}>
                    <a
                      href={`#/${m.id}`}
                      className="nav-link"
                      aria-current={active === m.id ? "page" : undefined}
                      title={m.status !== "done" ? `${label} — ${t("status.notStarted")}` : collapsed ? label : undefined}
                      data-soon={m.status !== "done" || undefined}
                      onPointerEnter={() => prefetch(m)}
                      onFocus={() => prefetch(m)}
                    >
                      <Icon name={m.icon} />
                      {collapsed ? <span className="sr-only">{label}</span> : <span className="nav-text">{label}</span>}
                      {m.status !== "done" && <span className="sr-only">({t("status.notStarted")})</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="sidebar-foot">
        <button type="button" className={`foot-btn${collapsed ? " icon-only" : ""}`} onClick={openPalette} title={`${t("palette.open")} (Ctrl+K)`} aria-label={t("palette.open")}>
          <Icon name="search" />
          {!collapsed && (
            <>
              <span className="label">{t("palette.open")}</span>
              <kbd>Ctrl K</kbd>
            </>
          )}
        </button>
        <button type="button" className="foot-btn icon-only" onClick={toggleTheme} aria-label={dark ? t("palette.lightTheme") : t("palette.darkTheme")} title={dark ? t("palette.lightTheme") : t("palette.darkTheme")}>
          <Icon name={dark ? "sun" : "moon"} />
        </button>
      </div>
    </nav>
  );
}
