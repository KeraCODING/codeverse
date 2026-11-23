import { findModule } from "../../app/modules";
import { useI18n } from "../../core/i18n/i18n";
import { Icon } from "../../ui/Icon";

/** Honest placeholder for modules that are planned but not built yet. No fake controls. */
export function ModuleStatusPage({ id }: { id: string }) {
  const { t } = useI18n();
  const m = findModule(id);
  if (!m) return null;
  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">
          <Icon name={m.icon} size={22} /> {t(`module.${id}.title`)}
        </h1>
        <p className="muted">{t(`module.${id}.desc`)}</p>
      </header>
      <div className="card status-card">
        <div className="row">
          <span className="badge">{t(`status.${m.status}`)}</span>
        </div>
        <p>{t("status.notBuiltExplain")}</p>
        <a className="btn" href="#/dashboard">
          {t("status.backToDashboard")}
        </a>
      </div>
    </section>
  );
}
