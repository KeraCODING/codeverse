import { useMemo, useState } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { FIELDS } from "../../content/catalog/fields";
import { LANGUAGES } from "../../content/catalog/languages";
import { TECHNOLOGIES } from "../../content/catalog/technologies";
import { Untranslated, useContent } from "../../content/useContent";
import type { FieldInfo } from "../../content/types";

export default function FieldsPage() {
  const [id] = useRouteParams();
  const field = FIELDS.find((f) => f.id === id);
  const { t } = useI18n();
  if (id && !field)
    return (
      <section className="page">
        <p>{t("content.notFound")}</p>
        <a className="btn" href="#/fields">{t("content.backToList")}</a>
      </section>
    );
  return field ? <FieldDetail field={field} /> : <FieldList />;
}

function FieldList() {
  const { t } = useI18n();
  const { tx } = useContent();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const list = useMemo(
    () => FIELDS.filter((f) => !query || tx(f.name).toLowerCase().includes(query) || tx(f.desc).toLowerCase().includes(query)),
    [query, tx],
  );
  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.fields.title")}</h1>
        <p className="muted">{t("fields.intro", { n: FIELDS.length })}</p>
      </header>
      <input type="search" className="search-input" placeholder={t("content.filter")} aria-label={t("content.filter")} value={q} onChange={(e) => setQ(e.target.value)} />
      {list.length === 0 && <p className="muted">{t("content.noMatches")}</p>}
      <div className="tile-grid">
        {list.map((f) => (
          <a key={f.id} className="tile" href={`#/fields/${f.id}`}>
            <span className="tile-title">{tx(f.name)}</span>
            <span className="tile-desc">{tx(f.desc)}</span>
            {f.roadmap && <span className="small">{t("fields.hasRoadmap", { n: f.roadmap.length })}</span>}
          </a>
        ))}
      </div>
    </section>
  );
}

function FieldDetail({ field }: { field: FieldInfo }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const langs = field.languages.map((id) => LANGUAGES.find((l) => l.id === id)).filter(Boolean);
  const techs = field.technologies.map((id) => TECHNOLOGIES.find((x) => x.id === id)).filter(Boolean);

  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/fields">{t("module.fields.title")}</a> <span aria-hidden="true">/</span> <span>{tx(field.name)}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title">{tx(field.name)}</h1>
        <p className="muted">
          {tx(field.desc)} <Untranslated text={field.desc} />
        </p>
      </header>

      <div className="grid two">
        <article className="card">
          <h2>{t("fields.languages")}</h2>
          <ul className="chips">
            {langs.map((l) => (
              <li key={l!.id}><a href={`#/languages/${l!.id}`}>{l!.name}</a></li>
            ))}
          </ul>
          <h2 className="mt">{t("fields.technologies")}</h2>
          {techs.length ? (
            <ul className="chips">
              {techs.map((x) => (
                <li key={x!.id}><a href={`#/frameworks/${x!.id}`}>{x!.name}</a></li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t("fields.noTechnologies")}</p>
          )}
        </article>

        <article className="card">
          <h2>{t("fields.roadmap")}</h2>
          {field.roadmap ? (
            <ol className="roadmap">
              {field.roadmap.map((step, i) => (
                <li key={i}>{tx(step)}</li>
              ))}
            </ol>
          ) : (
            <p className="muted">{t("fields.roadmapMissing")}</p>
          )}
        </article>
      </div>
      <p className="small">{t("fields.contentNote")}</p>
    </section>
  );
}
