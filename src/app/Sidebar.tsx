import { GROUPS, MODULES, type ModuleDef } from "./modules";
import { Icon } from "../ui/Icon";
import { useI18n } from "../core/i18n/i18n";
import { useSettings } from "../core/settings/SettingsContext";

export function Sidebar({ active }: { active: string }) {
  const { t } = useI18n();
  const { settings, update } = useSettings();
  const collapsed = settings.sidebarCollapsed;

  // Warm the module chunk when the pointer or focus reaches the link (skipped in low-resource mode).
  const prefetch = (m: ModuleDef) => {
    if (!settings.lowResourceMode && m.load) void m.load();
  };

  return (
    <nav className="sidebar" data-collapsed={collapsed} aria-label={t("nav.label")}>
      <div className="sidebar-head">
        {!collapsed && (
          <a className="brand" href="#/dashboard">
            CODEVERSE
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
      <div className="sidebar-scroll">
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
    </nav>
  );
}
