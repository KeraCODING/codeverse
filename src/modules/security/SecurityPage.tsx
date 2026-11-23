import { useEffect, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { useRouteParams } from "../../app/router";
import { useContent } from "../../content/useContent";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import { Quiz } from "../lesson/Quiz";
import {
  LEGAL_NOTICE_MODULES,
  SECURITY_MODULES,
  SECURITY_TOPICS,
  findSecurityTopic,
  securityProgressId,
  topicsOf,
  type SecExercise,
  type SecTopic,
} from "../../content/security";
import "./security.css";

export default function SecurityPage() {
  const [topicId] = useRouteParams();
  if (!topicId) return <AcademyIndex />;
  const topic = findSecurityTopic(topicId);
  return topic ? <TopicView key={topic.id} topic={topic} /> : <NotFound />;
}

function IntegrationNote() {
  const { t } = useI18n();
  return (
    <p className="banner sec-note" role="note">
      {t("security.integration")}
    </p>
  );
}

function AcademyIndex() {
  const { t } = useI18n();
  const { tx } = useContent();
  const { records } = useProgress();
  const done = (id: string) => records.get(securityProgressId(id))?.state === "completed";
  const totalDone = SECURITY_TOPICS.filter((x) => done(x.id)).length;

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("security.title")}</h1>
        <p className="muted">{t("security.intro", { n: SECURITY_TOPICS.length })}</p>
        <p className="small">{t("security.progress", { done: totalDone, total: SECURITY_TOPICS.length })}</p>
      </header>

      <p className="banner" role="note">{t("security.safety")}</p>
      <IntegrationNote />
      <div className="row wrap">
        <span className="small">{t("security.roadmapHint")}</span>
        <a className="btn" href="#/security/security-roadmap">{t("security.openRoadmap")}</a>
      </div>

      {SECURITY_MODULES.map((m) => {
        const topics = topicsOf(m.id);
        const modDone = topics.filter((x) => done(x.id)).length;
        return (
          <section key={m.id} className="sec-module" aria-labelledby={`mod-${m.id}`}>
            <div className="row between wrap">
              <h2 id={`mod-${m.id}`}>
                <span className="badge">{t("security.moduleLabel", { letter: m.letter })}</span> {tx(m.title)}
              </h2>
              <span className="small">
                {t("security.topicCount", { n: topics.length })} · {t("security.progress", { done: modDone, total: topics.length })}
              </span>
            </div>
            <p className="muted">{tx(m.desc)}</p>
            <div className="tile-grid">
              {topics.map((x) => {
                const state = records.get(securityProgressId(x.id))?.state ?? "new";
                return (
                  <a key={x.id} className="tile" href={`#/security/${x.id}`}>
                    <span className="tile-title">{tx(x.title)}</span>
                    <span className="tile-desc">{tx(x.intro)}</span>
                    <span className={`badge state-${state}`}>{t(`progress.state.${state}`)}</span>
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}
    </section>
  );
}

function NotFound() {
  const { t } = useI18n();
  return (
    <section className="page">
      <p>{t("security.notFound")}</p>
      <a className="btn" href="#/security">{t("security.back")}</a>
    </section>
  );
}

const SECTION_IDS = ["intro", "concepts", "examples", "mistakes", "exercise", "quiz", "refs"] as const;

function TopicView({ topic }: { topic: SecTopic }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { markOpened, records } = useProgress();
  const pid = securityProgressId(topic.id);
  const state = records.get(pid)?.state ?? "new";
  const mod = SECURITY_MODULES.find((m) => m.id === topic.module)!;
  const idx = SECURITY_TOPICS.findIndex((x) => x.id === topic.id);
  const prev = SECURITY_TOPICS[idx - 1];
  const next = SECURITY_TOPICS[idx + 1];
  const legal = LEGAL_NOTICE_MODULES.includes(topic.module);
  const hasCommands = topic.examples.some((e) => e.lang === "plain");

  useEffect(() => {
    markOpened(pid);
  }, [pid, markOpened]);

  const sectionTitle: Record<(typeof SECTION_IDS)[number], string> = {
    intro: t("security.section.intro"),
    concepts: t("security.section.concepts"),
    examples: t("security.section.examples"),
    mistakes: t("security.section.mistakes"),
    exercise: t("security.section.exercise"),
    quiz: t("security.section.quiz"),
    refs: t("security.section.refs"),
  };

  return (
    <article className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/security">{t("security.title")}</a> <span aria-hidden="true">/</span>{" "}
        <span>{t("security.moduleLabel", { letter: mod.letter })} · {tx(mod.title)}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title">{tx(topic.title)}</h1>
        <div className="row wrap">
          <span className="badge">{t("security.moduleLabel", { letter: mod.letter })}</span>
          <span className={`badge state-${state}`}>{t(`progress.state.${state}`)}</span>
          {legal && <span className="badge warn-badge">{t("security.legalShort")}</span>}
        </div>
      </header>

      {legal && (
        <div className="banner warn" role="note">
          <strong>{t("security.legal")}</strong>
        </div>
      )}
      {(topic.module === "kali" || topic.module === "labs") && <IntegrationNote />}

      <nav className="toc" aria-label={t("security.contents")}>
        {SECTION_IDS.map((s) => (
          <a
            key={s}
            href={`#/security/${topic.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`s-${s}`)?.scrollIntoView({ block: "start" });
            }}
          >
            {sectionTitle[s]}
          </a>
        ))}
      </nav>

      <section className="card section" id="s-intro">
        <h2>{sectionTitle.intro}</h2>
        <p><Rich text={tx(topic.intro)} /></p>
      </section>

      <section className="card section" id="s-concepts">
        <h2>{sectionTitle.concepts}</h2>
        <dl className="sec-concepts">
          {topic.concepts.map((c, i) => (
            <div key={i}>
              <dt><Rich text={tx(c.name)} /></dt>
              <dd><Rich text={tx(c.text)} /></dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card section" id="s-examples">
        <h2>{sectionTitle.examples}</h2>
        {hasCommands && <p className="small">{t("security.readOnly")}</p>}
        {topic.examples.map((ex, i) => (
          <div key={i} className="example">
            <h3>{tx(ex.title)}</h3>
            <CodeBlock code={ex.code} lang={ex.lang} label={tx(ex.title)} />
            <p><Rich text={tx(ex.explain)} /></p>
          </div>
        ))}
      </section>

      <section className="card section" id="s-mistakes">
        <h2>{sectionTitle.mistakes}</h2>
        {topic.mistakes.map((m, i) => (
          <div key={i} className="mistake">
            <h3>{tx(m.title)}</h3>
            {m.wrong && m.right && (
              <div className="compare">
                <div>
                  <span className="small err-text">✗ {t("security.smell")}</span>
                  <CodeBlock code={m.wrong} lang={m.lang ?? "plain"} label={t("security.smell")} />
                </div>
                <div>
                  <span className="small ok-text">✓ {t("security.fixed")}</span>
                  <CodeBlock code={m.right} lang={m.lang ?? "plain"} label={t("security.fixed")} />
                </div>
              </div>
            )}
            <p><Rich text={tx(m.why)} /></p>
          </div>
        ))}
      </section>

      <section className="card section" id="s-exercise">
        <h2>{sectionTitle.exercise}</h2>
        <ExerciseView exercise={topic.exercise} />
      </section>

      <section className="card section" id="s-quiz">
        <h2>{sectionTitle.quiz}</h2>
        <Quiz lessonId={pid} questions={topic.quiz} />
      </section>

      <section className="card section" id="s-refs">
        <h2>{sectionTitle.refs}</h2>
        <ul className="sources">
          {topic.refs.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer noopener">{r.title} ↗</a>
            </li>
          ))}
        </ul>
      </section>

      <nav className="row between wrap" aria-label={t("security.contents")}>
        {prev ? (
          <a className="btn" href={`#/security/${prev.id}`}>← {t("security.prev")}: {tx(prev.title)}</a>
        ) : (
          <a className="btn" href="#/security">← {t("security.back")}</a>
        )}
        {next ? (
          <a className="btn primary" href={`#/security/${next.id}`}>{t("security.next")}: {tx(next.title)} →</a>
        ) : (
          <a className="btn primary" href="#/security">{t("security.back")}</a>
        )}
      </nav>
    </article>
  );
}

function ExerciseView({ exercise }: { exercise: SecExercise }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const [hints, setHints] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="sec-exercise">
      <p><Rich text={tx(exercise.task)} /></p>
      {exercise.material && (
        <>
          <h3>{t("security.material")}</h3>
          <CodeBlock code={exercise.material.code} lang={exercise.material.lang} label={t("security.material")} />
        </>
      )}
      {exercise.hints.slice(0, hints).map((h, i) => (
        <p key={i} className="small">
          <strong>{t("security.hint", { n: i + 1 })}:</strong> <Rich text={tx(h)} />
        </p>
      ))}
      <div className="row wrap">
        {hints < exercise.hints.length && (
          <button type="button" className="btn" onClick={() => setHints(hints + 1)}>
            {t("security.showHint", { n: hints + 1, total: exercise.hints.length })}
          </button>
        )}
        <button type="button" className="btn" aria-expanded={showAnswer} onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? t("security.hideAnswer") : t("security.showAnswer")}
        </button>
      </div>
      {showAnswer && (
        <div className="sec-answer" role="region" aria-label={t("security.answer")}>
          <h3>{t("security.answer")}</h3>
          <p><Rich text={tx(exercise.answer)} /></p>
        </div>
      )}
    </div>
  );
}
