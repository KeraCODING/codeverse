import { useI18n } from "../../core/i18n/i18n";
import { findLessonMeta } from "../../content";
import { useContent } from "../../content/useContent";
import type { CodeLang } from "../../content/types";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import type { TermEntry } from "../../knowledge/keywords";

const LANG_NAME: Partial<Record<CodeLang, string>> = { python: "Python", javascript: "JavaScript", typescript: "TypeScript", sql: "SQL" };

/** Meaning + examples + related lessons for one keyword/concept. Used by Search and Explain. */
export function TermCard({ term, compact }: { term: TermEntry; compact?: boolean }) {
  const { t } = useI18n();
  const { tx } = useContent();
  return (
    <article className="card term-card">
      <header className="row wrap">
        <h3 className="term-token"><code>{term.token}</code></h3>
        <span className="badge">{term.lang ? LANG_NAME[term.lang] : t("search.crossLanguage")}</span>
        <span className="small">{t(`search.kind.${term.kind}`)}</span>
      </header>
      <p><Rich text={tx(term.meaning)} /></p>
      {Object.entries(term.examples).map(([lang, code]) => (
        <div key={lang}>
          {Object.keys(term.examples).length > 1 && <span className="small">{LANG_NAME[lang as CodeLang]}</span>}
          <CodeBlock code={code!} lang={lang as CodeLang} />
        </div>
      ))}
      {!compact && term.lessons.length > 0 && (
        <p className="small">
          {t("search.relatedLessons")}:{" "}
          {term.lessons.map((id, i) => {
            const m = findLessonMeta(id);
            return m ? (
              <span key={id}>{i > 0 && ", "}<a href={`#/languages/${m.language}/${id}`}>{tx(m.title)}</a></span>
            ) : null;
          })}
        </p>
      )}
      {compact && <a className="link small" href={`#/search/term/${term.id}`}>{t("search.openTerm")} →</a>}
    </article>
  );
}
