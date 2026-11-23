import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useSettings } from "../../core/settings/SettingsContext";
import { formatBytes, takeSnapshot, type Snapshot } from "../../core/perf/metrics";

// On-demand diagnostics: one snapshot when the page opens, another only when the user asks.
export default function DiagnosticsPage() {
  const { t, formatNumber, formatDateTime } = useI18n();
  const { storage } = useSettings();
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const measure = useCallback(() => void takeSnapshot().then(setSnap), []);
  useEffect(measure, [measure]);

  const b = (n: number | null) => formatBytes(n, formatNumber);
  const na = t("diag.notAvailable");

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.diagnostics.title")}</h1>
        <p className="muted">{t("diag.intro")}</p>
      </header>
      <div className="row">
        <button type="button" className="btn primary" onClick={measure}>
          {t("diag.measure")}
        </button>
        {snap && <span className="muted small">{t("diag.takenAt", { time: formatDateTime(snap.takenAt) })}</span>}
      </div>

      {snap && (
        <div className="grid two">
          <article className="card">
            <h2>{t("diag.memory")}</h2>
            <dl className="kv">
              <dt>{t("diag.heapUsed")}</dt>
              <dd>{snap.heapUsed === null ? na : b(snap.heapUsed)}</dd>
              <dt>{t("diag.domNodes")}</dt>
              <dd>{formatNumber(snap.domNodes)}</dd>
              <dt>{t("diag.startup")}</dt>
              <dd>{snap.startupMs === null ? na : `${formatNumber(snap.startupMs)} ms`}</dd>
            </dl>
            <p className="muted small">{t("diag.memoryNote")}</p>
          </article>

          <article className="card">
            <h2>{t("diag.storage")}</h2>
            <dl className="kv">
              <dt>{t("diag.backend")}</dt>
              <dd>{storage.info.backend}</dd>
              <dt>{t("diag.schema")}</dt>
              <dd>v{storage.info.schemaVersion}</dd>
              <dt>{t("diag.used")}</dt>
              <dd>{snap.storageUsage === null ? na : b(snap.storageUsage)}</dd>
              <dt>{t("diag.quota")}</dt>
              <dd>{snap.storageQuota === null ? na : b(snap.storageQuota)}</dd>
            </dl>
          </article>

          <article className="card">
            <h2>{t("diag.loaded")}</h2>
            <dl className="kv">
              <dt>{t("diag.scripts")}</dt>
              <dd>
                {snap.scripts.count} · {b(snap.scripts.bytes)}
              </dd>
              <dt>{t("diag.styles")}</dt>
              <dd>
                {snap.styles.count} · {b(snap.styles.bytes)}
              </dd>
            </dl>
            <p className="muted small">{t("diag.loadedNote")}</p>
          </article>

          <article className="card">
            <h2>{t("diag.background")}</h2>
            {snap.background.length === 0 ? (
              <p>{t("diag.backgroundNone")}</p>
            ) : (
              <ul className="list">
                {snap.background.map((x) => (
                  <li key={x.name}>
                    <span>{t(`diag.bg.${x.name}`)}</span>
                    <span className="muted small">×{x.count}</span>
                  </li>
                ))}
              </ul>
            )}
            <dl className="kv">
              <dt>{t("diag.network")}</dt>
              <dd>{t("diag.networkNone")}</dd>
              <dt>{t("diag.version")}</dt>
              <dd>{__APP_VERSION__}</dd>
            </dl>
          </article>
        </div>
      )}
    </section>
  );
}
