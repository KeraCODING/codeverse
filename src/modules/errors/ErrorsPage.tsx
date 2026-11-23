import { useState } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { findLessonMeta } from "../../content";
import { useContent } from "../../content/useContent";
import { ERROR_PATTERNS, fillGroups, matchErrors, type ErrorMatch, type ErrorPattern } from "../../knowledge/errors";
import { CodeBlock, Rich } from "../../ui/CodeBlock";

const TECH_NAME: Record<ErrorPattern["tech"], string> = { python: "Python", javascript: "JavaScript", node: "Node.js", sql: "SQL" };

export default function ErrorsPage() {
  const [id] = useRouteParams();
  // Re-mount when the route changes (e.g. opening another error from Search).
  return <ErrorsView key={id ?? ""} id={id} />;
}

function ErrorsView({ id }: { id?: string }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const preset = ERROR_PATTERNS.find((p) => p.id === id);
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<ErrorMatch[] | null>(preset ? [{ pattern: preset, groups: [], line: null }] : null);

  const translate = () => setMatches(matchErrors(text.slice(0, 10000)));

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.errors.title")}</h1>
        <p className="muted">{t("errors.intro")}</p>
      </header>

      <div className="card">
        <textarea
          className="code-input"
          rows={6}
          spellCheck={false}
          value={text}
          placeholder={t("errors.placeholder")}
          aria-label={t("errors.placeholder")}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="row wrap">
          <button type="button" className="btn primary" disabled={!text.trim()} onClick={translate}>{t("errors.translate")}</button>
          <span className="small">{t("explain.privacy")}</span>
        </div>
      </div>

      {matches && matches.length === 0 && (
        <div className="card">
          <h2>{t("errors.noMatchTitle")}</h2>
          <p>{t("errors.noMatch")}</p>
          <ul className="small">
            <li>{t("errors.tip1")}</li>
            <li>{t("errors.tip2")}</li>
          </ul>
          <a className="link" href={`#/search?q=${encodeURIComponent(text.trim().split("\n").pop()!.slice(0, 80))}`}>{t("errors.searchInstead")} →</a>
        </div>
      )}

      {matches?.map((m) => <ErrorResult key={m.pattern.id} m={m} generic={!!preset && !text} />)}

      <details className="card">
        <summary>{t("errors.supported", { n: ERROR_PATTERNS.length })}</summary>
        <ul className="list">
          {ERROR_PATTERNS.map((p) => (
            <li key={p.id}>
              <a href={`#/errors/${p.id}`} onClick={() => { setMatches([{ pattern: p, groups: [], line: null }]); setText(""); }}>
                {fillGroups(tx(p.title), ["…", "…", "…"])}
              </a>
              <span className="small">{TECH_NAME[p.tech]}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

function ErrorResult({ m, generic }: { m: ErrorMatch; generic: boolean }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const g = generic ? ["…", "…", "…"] : m.groups;
  const f = (s: string) => fillGroups(s, g);
  const p = m.pattern;
  return (
    <article className="card error-result">
      <header className="row wrap">
        <h2>{f(tx(p.title))}</h2>
        <span className="badge">{TECH_NAME[p.tech]}</span>
        {!generic && <span className="badge state-completed">{t("errors.recognised")}</span>}
        {m.line !== null && <span className="badge">{t("errors.line", { n: m.line })}</span>}
      </header>
      <h3>{t("errors.meaning")}</h3>
      <p><Rich text={f(tx(p.meaning))} /></p>
      <h3>{t("errors.causes")}</h3>
      <p className="small">{t("errors.causesNote")}</p>
      <ul>{p.causes.map((c, i) => <li key={i}><Rich text={f(tx(c))} /></li>)}</ul>
      <h3>{t("errors.fixes")}</h3>
      <ul>{p.fixes.map((c, i) => <li key={i}><Rich text={f(tx(c))} /></li>)}</ul>
      {p.example && (
        <div className="compare">
          <div>
            <span className="small err-text">✗ {t("lesson.wrong")}</span>
            <CodeBlock code={p.example.wrong} lang={p.example.lang} />
          </div>
          <div>
            <span className="small ok-text">✓ {t("lesson.right")}</span>
            <CodeBlock code={p.example.right} lang={p.example.lang} />
          </div>
        </div>
      )}
      {p.lessons.length > 0 && (
        <p className="small">
          {t("search.relatedLessons")}:{" "}
          {p.lessons.map((id, i) => {
            const meta = findLessonMeta(id);
            return meta ? <span key={id}>{i > 0 && ", "}<a href={`#/languages/${meta.language}/${id}`}>{tx(meta.title)}</a></span> : null;
          })}
        </p>
      )}
    </article>
  );
}
