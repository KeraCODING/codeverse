import { useState } from "react";
import { useRouteParams, navigate } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { findLessonMeta } from "../../content";
import { LANGUAGES } from "../../content/catalog/languages";
import { useContent } from "../../content/useContent";
import { COMPARE_LANGS, CONCEPTS, PROFILES, type CompareLang } from "../../knowledge/compare";
import { CodeBlock, Rich } from "../../ui/CodeBlock";

export default function ComparePage() {
  const [conceptId] = useRouteParams();
  const { t } = useI18n();
  const { tx } = useContent();
  const concept = CONCEPTS.find((c) => c.id === conceptId) ?? CONCEPTS[0];
  const [left, setLeft] = useState<CompareLang>("python");
  const [right, setRight] = useState<CompareLang>("javascript");
  const sides: CompareLang[] = [left, right];

  const LangSelect = ({ value, onChange, label }: { value: CompareLang; onChange: (v: CompareLang) => void; label: string }) => (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value as CompareLang)}>
      {COMPARE_LANGS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
    </select>
  );

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.compare.title")}</h1>
        <p className="muted">{t("compare.intro")}</p>
      </header>

      <div className="row wrap">
        <label className="row">
          <span>{t("compare.concept")}</span>
          <select value={concept.id} onChange={(e) => navigate(`compare/${e.target.value}`)}>
            {CONCEPTS.map((c) => <option key={c.id} value={c.id}>{tx(c.title)}</option>)}
          </select>
        </label>
        <LangSelect value={left} onChange={setLeft} label={t("compare.left")} />
        <span aria-hidden="true">↔</span>
        <LangSelect value={right} onChange={setRight} label={t("compare.right")} />
        <button type="button" className="btn" onClick={() => { setLeft(right); setRight(left); }}>{t("compare.swap")}</button>
      </div>

      <article className="card">
        <h2>{tx(concept.title)}</h2>
        <p><Rich text={tx(concept.note)} /></p>
        <div className="compare">
          {sides.map((id, i) => {
            const l = COMPARE_LANGS.find((x) => x.id === id)!;
            return (
              <div key={i}>
                <span className="small"><a href={`#/languages/${l.catalog}`}>{l.name}</a></span>
                <CodeBlock code={concept.code[id]} lang={l.code} label={l.name} />
              </div>
            );
          })}
        </div>
        <p className="small">{t("compare.snippetNote")}</p>
        {concept.lessons.length > 0 && (
          <p className="small">
            {t("search.relatedLessons")}:{" "}
            {concept.lessons.map((lid, i) => {
              const m = findLessonMeta(lid);
              return m ? <span key={lid}>{i > 0 && ", "}<a href={`#/languages/${m.language}/${lid}`}>{tx(m.title)}</a></span> : null;
            })}
          </p>
        )}
      </article>

      <article className="card">
        <h2>{t("compare.profiles")}</h2>
        <div className="table-scroll">
          <table className="parts">
            <thead>
              <tr>
                <th scope="col">{t("compare.aspect")}</th>
                {sides.map((id, i) => <th key={i} scope="col">{COMPARE_LANGS.find((x) => x.id === id)!.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{t("languages.typing")}</th>
                {sides.map((id, i) => <td key={i}>{tx(LANGUAGES.find((x) => x.id === COMPARE_LANGS.find((c) => c.id === id)!.catalog)?.typing)}</td>)}
              </tr>
              {(["execution", "memory", "strengths", "limitations"] as const).map((k) => (
                <tr key={k}>
                  <th scope="row">{t(`compare.${k}`)}</th>
                  {sides.map((id, i) => <td key={i}><Rich text={tx(PROFILES[id][k])} /></td>)}
                </tr>
              ))}
              <tr>
                <th scope="row">{t("languages.uses")}</th>
                {sides.map((id, i) => <td key={i}>{tx(LANGUAGES.find((x) => x.id === COMPARE_LANGS.find((c) => c.id === id)!.catalog)?.uses)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small">{t("compare.profileNote")}</p>
      </article>
    </section>
  );
}
