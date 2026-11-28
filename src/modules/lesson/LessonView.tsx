import { useEffect, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { findLessonMeta, lessonsFor, loadLesson } from "../../content";
import { LANGUAGES } from "../../content/catalog/languages";
import { translationCompleteness, type Lesson } from "../../content/types";
import { LOCALE_NAMES, useContent } from "../../content/useContent";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import { Quiz } from "./Quiz";
import { ExerciseBlock } from "./ExerciseBlock";
import { Icon } from "../../ui/Icon";

const SECTIONS = ["intro", "syntax", "examples", "mistakes", "exercise", "quiz", "related"] as const;

export default function LessonView({ languageId, lessonId }: { languageId: string; lessonId: string }) {
  const { t } = useI18n();
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined);
  const { markOpened, records } = useProgress();

  useEffect(() => {
    let live = true;
    setLesson(undefined);
    loadLesson(lessonId).then((l) => live && setLesson(l && l.language === languageId ? l : null));
    return () => {
      live = false;
    };
  }, [lessonId, languageId]);

  useEffect(() => {
    if (lesson) markOpened(lesson.id);
  }, [lesson, markOpened]);

  if (lesson === undefined) return <div className="loading">{t("common.loading")}</div>;
  if (lesson === null)
    return (
      <section className="page">
        <p>{t("content.notFound")}</p>
        <a className="btn" href={`#/languages/${languageId}`}>{t("content.backToList")}</a>
      </section>
    );
  return <LessonBody lesson={lesson} state={records.get(lesson.id)?.state} />;
}

function LessonBody({ lesson, state }: { lesson: Lesson; state?: string }) {
  const { t, formatDate } = useI18n();
  const { tx, preferred, termLabel } = useContent();
  const lang = LANGUAGES.find((l) => l.id === lesson.language)!;
  const completeness = translationCompleteness(lesson, preferred);
  const siblings = lessonsFor(lesson.language);
  const idx = siblings.findIndex((s) => s.id === lesson.id);
  const next = siblings[idx + 1];

  return (
    <article className="page lesson" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/languages">{t("module.languages.title")}</a> <span aria-hidden="true">/</span>{" "}
        <a href={`#/languages/${lang.id}`}>{lang.name}</a> <span aria-hidden="true">/</span> <span>{tx(lesson.title)}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title">{tx(lesson.title)}</h1>
        <div className="row wrap">
          <span className="badge">{t(`learning.level.${lesson.level}`)}</span>
          <span className={`badge state-${state ?? "new"}`}>{t(`progress.state.${state ?? "new"}`)}</span>
          <span className="small">{t(`lesson.verification.${lesson.verification}`)}</span>
        </div>
      </header>

      {completeness < 100 && (
        <div className="banner warn" role="note">
          {t("lesson.partialTranslation", { lang: LOCALE_NAMES[preferred], pct: completeness })}
        </div>
      )}

      <aside className="simple-box" aria-labelledby="l-simple">
        <h2 id="l-simple"><Icon name="spark" /> {t("lesson.simple")}</h2>
        <p><Rich text={tx(lesson.simple)} /></p>
      </aside>

      <nav className="toc" aria-label={t("lesson.contents")}>
        {SECTIONS.map((s) => (
          <a key={s} href={`#/languages/${lesson.language}/${lesson.id}`} onClick={(e) => {
            e.preventDefault();
            document.getElementById(`l-${s}`)?.scrollIntoView({ block: "start" });
          }}>
            {t(`lesson.section.${s}`)}
          </a>
        ))}
      </nav>

      <section className="card section" id="l-intro">
        <h2>{t("lesson.section.intro")}</h2>
        <h3>{t("lesson.what")}</h3>
        <p><Rich text={tx(lesson.intro.what)} /></p>
        <h3>{t("lesson.why")}</h3>
        <p><Rich text={tx(lesson.intro.why)} /></p>
        <h3>{t("lesson.where")}</h3>
        <p><Rich text={tx(lesson.intro.where)} /></p>
        {lesson.terms.length > 0 && (
          <>
            <h3>{t("lesson.terms")}</h3>
            <ul className="chips">
              {lesson.terms.map((term) => (
                <li key={term.en}>{termLabel(term)}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="card section" id="l-syntax">
        <h2>{t("lesson.section.syntax")}</h2>
        <CodeBlock code={lesson.syntax.code} lang={lesson.syntax.lang} label={t("lesson.section.syntax")} />
        <table className="parts">
          <caption className="sr-only">{t("lesson.syntaxParts")}</caption>
          <thead>
            <tr><th scope="col">{t("lesson.part")}</th><th scope="col">{t("lesson.meaning")}</th></tr>
          </thead>
          <tbody>
            {lesson.syntax.parts.map((p) => (
              <tr key={p.token}>
                <td><code>{p.token}</code></td>
                <td><Rich text={tx(p.role)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card section" id="l-examples">
        <h2>{t("lesson.section.examples")}</h2>
        <p className="small">{t("lesson.clickLines")}</p>
        {lesson.examples.map((ex, i) => (
          <div key={i} className="example">
            <h3>{tx(ex.title)}</h3>
            <CodeBlock
              code={ex.code}
              lang={ex.lang}
              notes={ex.lines.map((n) => tx(n))}
              label={tx(ex.title)}
              footer={ex.output !== undefined && (
                <div className="output" aria-label={t("lesson.output")}>
                  <span className="small">{t("lesson.output")}</span>
                  <pre>{ex.output}</pre>
                </div>
              )}
            />
          </div>
        ))}
      </section>

      <section className="card section" id="l-mistakes">
        <h2>{t("lesson.section.mistakes")}</h2>
        {lesson.mistakes.map((m, i) => (
          <div key={i} className="mistake">
            <h3>{tx(m.title)}</h3>
            <div className="compare">
              <div>
                <span className="small err-text">✗ {t("lesson.wrong")}</span>
                <CodeBlock code={m.wrong} lang={lesson.syntax.lang} />
              </div>
              <div>
                <span className="small ok-text">✓ {t("lesson.right")}</span>
                <CodeBlock code={m.right} lang={lesson.syntax.lang} />
              </div>
            </div>
            <p><Rich text={tx(m.why)} /></p>
          </div>
        ))}
      </section>

      <section className="card section" id="l-exercise">
        <h2>{t("lesson.section.exercise")}</h2>
        <ExerciseBlock exercise={lesson.exercise} lessonId={lesson.id} />
      </section>

      <section className="card section" id="l-quiz">
        <h2>{t("lesson.section.quiz")}</h2>
        <Quiz lessonId={lesson.id} questions={lesson.quiz} />
      </section>

      <section className="card section" id="l-related">
        <h2>{t("lesson.section.related")}</h2>
        <ul className="list">
          {lesson.related.map((id) => {
            const meta = findLessonMeta(id);
            if (!meta) return null;
            const l = LANGUAGES.find((x) => x.id === meta.language);
            return (
              <li key={id}>
                <a href={`#/languages/${meta.language}/${id}`}>{tx(meta.title)}</a>
                <span className="small">{l?.name}</span>
              </li>
            );
          })}
        </ul>
        <h3>{t("lesson.sources")}</h3>
        <ul className="sources">
          {lesson.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener">{s.title} ↗</a>
            </li>
          ))}
        </ul>
        <p className="small">{t("lesson.reviewed", { date: formatDate(Date.parse(lesson.reviewedAt)) })}</p>
        {next && (
          <a className="btn primary" href={`#/languages/${lesson.language}/${next.id}`}>
            {t("lesson.next")}: {tx(next.title)} →
          </a>
        )}
      </section>
    </article>
  );
}
