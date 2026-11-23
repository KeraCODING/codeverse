import { lazy, Suspense, useMemo, useState } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { LANGUAGES } from "../../content/catalog/languages";
import { FIELDS } from "../../content/catalog/fields";
import { TECHNOLOGIES } from "../../content/catalog/technologies";
import { lessonsFor } from "../../content";
import { Untranslated, useContent } from "../../content/useContent";
import type { LanguageInfo } from "../../content/types";

const LessonView = lazy(() => import("../lesson/LessonView"));

export default function LanguagesPage() {
  const [langId, lessonId] = useRouteParams();
  const lang = LANGUAGES.find((l) => l.id === langId);
  const { t } = useI18n();
  if (langId && !lang) return <NotFound />;
  if (lang && lessonId)
    return (
      <Suspense fallback={<div className="loading">{t("common.loading")}</div>}>
        <LessonView languageId={lang.id} lessonId={lessonId} />
      </Suspense>
    );
  if (lang) return <LanguageDetail lang={lang} />;
  return <LanguageList />;
}

function NotFound() {
  const { t } = useI18n();
  return (
    <section className="page">
      <p>{t("content.notFound")}</p>
      <a className="btn" href="#/languages">{t("content.backToList")}</a>
    </section>
  );
}

const KINDS: LanguageInfo["kind"][] = ["programming", "markup", "stylesheet", "query", "shell"];

function LanguageList() {
  const { t } = useI18n();
  const { tx } = useContent();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const list = useMemo(
    () => LANGUAGES.filter((l) => !query || l.name.toLowerCase().includes(query) || tx(l.desc).toLowerCase().includes(query)),
    [query, tx],
  );

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.languages.title")}</h1>
        <p className="muted">{t("languages.intro", { n: LANGUAGES.length })}</p>
      </header>
      <input
        type="search"
        className="search-input"
        placeholder={t("content.filter")}
        aria-label={t("content.filter")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {list.length === 0 && <p className="muted">{t("content.noMatches")}</p>}
      {KINDS.map((kind) => {
        const items = list.filter((l) => l.kind === kind);
        if (!items.length) return null;
        return (
          <div key={kind}>
            <h2 className="group-title">{t(`languages.kind.${kind}`)}</h2>
            <div className="tile-grid">
              {items.map((l) => {
                const n = lessonsFor(l.id).length;
                return (
                  <a key={l.id} className="tile" href={`#/languages/${l.id}`}>
                    <span className="tile-title">{l.name}</span>
                    <span className="tile-desc">{tx(l.desc)}</span>
                    <span className="small">{n ? t("languages.lessonCount", { n }) : t("languages.noLessonsShort")}</span>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function LanguageDetail({ lang }: { lang: LanguageInfo }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { records } = useProgress();
  const lessons = lessonsFor(lang.id);
  const fields = FIELDS.filter((f) => f.languages.includes(lang.id));
  const techs = TECHNOLOGIES.filter((x) => x.language === lang.id);
  const done = lessons.filter((l) => records.get(l.id)?.state === "completed").length;

  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/languages">{t("module.languages.title")}</a> <span aria-hidden="true">/</span> <span>{lang.name}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title">{lang.name}</h1>
        <p className="muted">
          {tx(lang.desc)} <Untranslated text={lang.desc} />
        </p>
      </header>

      <div className="grid two">
        <article className="card">
          <h2>{t("languages.overview")}</h2>
          <dl className="kv left">
            <dt>{t("languages.kindLabel")}</dt>
            <dd>{t(`languages.kind.${lang.kind}`)}</dd>
            {lang.firstAppeared && (<><dt>{t("languages.firstAppeared")}</dt><dd>{lang.firstAppeared}</dd></>)}
            {lang.creators && (<><dt>{t("languages.creators")}</dt><dd>{lang.creators}</dd></>)}
            {lang.typing && (<><dt>{t("languages.typing")}</dt><dd>{tx(lang.typing)}</dd></>)}
            <dt>{t("languages.uses")}</dt>
            <dd>{tx(lang.uses)}</dd>
          </dl>
          <a className="link" href={lang.docs.url} target="_blank" rel="noreferrer noopener">
            {t("content.officialDocs")}: {lang.docs.title} ↗
          </a>
        </article>

        <article className="card">
          <h2>{t("languages.lessons")}</h2>
          {lessons.length === 0 ? (
            <p className="muted">{t("languages.noLessons")}</p>
          ) : (
            <>
              <p className="small">{t("languages.progress", { done, total: lessons.length })}</p>
              <ol className="lesson-list">
                {lessons.map((l) => {
                  const rec = records.get(l.id);
                  return (
                    <li key={l.id}>
                      <a href={`#/languages/${lang.id}/${l.id}`}>{tx(l.title)}</a>
                      <span className="row">
                        <span className="small">{t(`learning.level.${l.level}`)}</span>
                        <span className={`badge state-${rec?.state ?? "new"}`}>{t(`progress.state.${rec?.state ?? "new"}`)}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </article>
      </div>

      {(fields.length > 0 || techs.length > 0) && (
        <article className="card">
          <h2>{t("languages.related")}</h2>
          {fields.length > 0 && (
            <p>
              <span className="muted">{t("module.fields.title")}: </span>
              {fields.map((f, i) => (
                <span key={f.id}>{i > 0 && ", "}<a href={`#/fields/${f.id}`}>{tx(f.name)}</a></span>
              ))}
            </p>
          )}
          {techs.length > 0 && (
            <p>
              <span className="muted">{t("module.frameworks.title")}: </span>
              {techs.map((x, i) => (
                <span key={x.id}>{i > 0 && ", "}<a href={`#/frameworks/${x.id}`}>{x.name}</a></span>
              ))}
            </p>
          )}
        </article>
      )}
    </section>
  );
}
