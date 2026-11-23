import { useMemo, useState } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { TECHNOLOGIES } from "../../content/catalog/technologies";
import { LANGUAGES } from "../../content/catalog/languages";
import { FIELDS } from "../../content/catalog/fields";
import { Untranslated, useContent } from "../../content/useContent";
import type { TechCategory, TechInfo } from "../../content/types";

const CATEGORIES: TechCategory[] = ["frontend", "backend", "mobile", "desktop", "aiData", "gameDev", "infra"];

export default function FrameworksPage() {
  const [id] = useRouteParams();
  const tech = TECHNOLOGIES.find((x) => x.id === id);
  const { t } = useI18n();
  if (id && !tech)
    return (
      <section className="page">
        <p>{t("content.notFound")}</p>
        <a className="btn" href="#/frameworks">{t("content.backToList")}</a>
      </section>
    );
  return tech ? <TechDetail tech={tech} /> : <TechList />;
}

function TechList() {
  const { t } = useI18n();
  const { tx } = useContent();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<TechCategory | "all">("all");
  const query = q.trim().toLowerCase();
  const list = useMemo(
    () =>
      TECHNOLOGIES.filter(
        (x) => (cat === "all" || x.category === cat) && (!query || x.name.toLowerCase().includes(query) || tx(x.desc).toLowerCase().includes(query)),
      ),
    [query, cat, tx],
  );

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.frameworks.title")}</h1>
        <p className="muted">{t("frameworks.intro", { n: TECHNOLOGIES.length })}</p>
      </header>
      <div className="row wrap">
        <input type="search" className="search-input" placeholder={t("content.filter")} aria-label={t("content.filter")} value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label={t("frameworks.category")} value={cat} onChange={(e) => setCat(e.target.value as TechCategory | "all")}>
          <option value="all">{t("frameworks.all")}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{t(`frameworks.cat.${c}`)}</option>
          ))}
        </select>
      </div>
      {list.length === 0 && <p className="muted">{t("content.noMatches")}</p>}
      {CATEGORIES.map((c) => {
        const items = list.filter((x) => x.category === c);
        if (!items.length) return null;
        return (
          <div key={c}>
            <h2 className="group-title">{t(`frameworks.cat.${c}`)}</h2>
            <div className="tile-grid">
              {items.map((x) => (
                <a key={x.id} className="tile" href={`#/frameworks/${x.id}`}>
                  <span className="tile-title">{x.name}</span>
                  <span className="tile-desc">{tx(x.desc)}</span>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function TechDetail({ tech }: { tech: TechInfo }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const lang = LANGUAGES.find((l) => l.id === tech.language);
  const fields = FIELDS.filter((f) => f.technologies.includes(tech.id));
  const alternatives = TECHNOLOGIES.filter((x) => x.category === tech.category && x.id !== tech.id);

  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/frameworks">{t("module.frameworks.title")}</a> <span aria-hidden="true">/</span> <span>{tech.name}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title">{tech.name}</h1>
        <p className="muted">
          {tx(tech.desc)} <Untranslated text={tech.desc} />
        </p>
      </header>
      <div className="grid two">
        <article className="card">
          <h2>{t("languages.overview")}</h2>
          <dl className="kv left">
            <dt>{t("frameworks.category")}</dt>
            <dd>{t(`frameworks.cat.${tech.category}`)}</dd>
            {lang && (<><dt>{t("frameworks.language")}</dt><dd><a href={`#/languages/${lang.id}`}>{lang.name}</a></dd></>)}
          </dl>
          <a className="link" href={tech.docs.url} target="_blank" rel="noreferrer noopener">
            {t("content.officialDocs")} ↗
          </a>
        </article>
        <article className="card">
          <h2>{t("frameworks.related")}</h2>
          {fields.length > 0 && (
            <p>
              <span className="muted">{t("module.fields.title")}: </span>
              {fields.map((f, i) => (<span key={f.id}>{i > 0 && ", "}<a href={`#/fields/${f.id}`}>{tx(f.name)}</a></span>))}
            </p>
          )}
          {alternatives.length > 0 && (
            <p>
              <span className="muted">{t("frameworks.alternatives")}: </span>
              {alternatives.map((x, i) => (<span key={x.id}>{i > 0 && ", "}<a href={`#/frameworks/${x.id}`}>{x.name}</a></span>))}
            </p>
          )}
        </article>
      </div>
      <p className="small">{t("frameworks.contentNote")}</p>
    </section>
  );
}
