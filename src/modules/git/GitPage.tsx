import { useEffect, useRef } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { GIT_GROUPS, GIT_TOPICS, findGitTopic, gitProgressId, type GitGroup, type GitTopic } from "../../content/gitAcademy";
import { Untranslated, useContent } from "../../content/useContent";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import { Quiz } from "../lesson/Quiz";

const GROUP_TITLE: Record<GitGroup, string> = { git: "git.group.git", github: "git.group.github", platforms: "git.group.platforms" };
const GROUP_DESC: Record<GitGroup, string> = { git: "git.groupDesc.git", github: "git.groupDesc.github", platforms: "git.groupDesc.platforms" };

const SECTIONS = [
  ["what", "git.section.what"],
  ["how", "git.section.how"],
  ["examples", "git.section.examples"],
  ["mistakes", "git.section.mistakes"],
  ["exercise", "git.section.exercise"],
  ["quiz", "git.section.quiz"],
  ["docs", "git.section.docs"],
] as const;

export default function GitPage() {
  const [id] = useRouteParams();
  const { t } = useI18n();
  const topic = id ? findGitTopic(id) : undefined;
  if (id && !topic)
    return (
      <section className="page">
        <p>{t("content.notFound")}</p>
        <a className="btn" href="#/git">{t("content.backToList")}</a>
      </section>
    );
  return topic ? <TopicView key={topic.id} topic={topic} /> : <TopicList />;
}

function TopicList() {
  const { t } = useI18n();
  const { tx } = useContent();
  const { records } = useProgress();
  const done = GIT_TOPICS.filter((x) => records.get(gitProgressId(x.id))?.state === "completed").length;

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("git.title")}</h1>
        <p className="muted">{t("git.intro", { n: GIT_TOPICS.length })}</p>
        <p className="small">{t("git.progress", { done, total: GIT_TOPICS.length })}</p>
      </header>
      {GIT_GROUPS.map((g) => {
        const topics = GIT_TOPICS.filter((x) => x.group === g);
        return (
          <section key={g} className="mt" aria-labelledby={`git-group-${g}`}>
            <h2 id={`git-group-${g}`}>{t(GROUP_TITLE[g])}</h2>
            <p className="muted">{t(GROUP_DESC[g])}</p>
            <div className="tile-grid">
              {topics.map((x) => {
                const state = records.get(gitProgressId(x.id))?.state ?? "new";
                return (
                  <a key={x.id} className="tile" href={`#/git/${x.id}`}>
                    <span className="tile-title">{tx(x.title)}</span>
                    <span className="tile-desc">{tx(x.summary)}</span>
                    <span><span className={`badge state-${state}`}>{t(`progress.state.${state}`)}</span></span>
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

function TopicView({ topic }: { topic: GitTopic }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { markOpened, records } = useProgress();
  const progressId = gitProgressId(topic.id);
  const state = records.get(progressId)?.state ?? "new";
  const heading = useRef<HTMLHeadingElement>(null);
  const idx = GIT_TOPICS.indexOf(topic);
  const prev = GIT_TOPICS[idx - 1];
  const next = GIT_TOPICS[idx + 1];

  useEffect(() => {
    markOpened(progressId);
  }, [progressId, markOpened]);

  useEffect(() => {
    heading.current?.focus({ preventScroll: false });
  }, [topic.id]);

  return (
    <article className="page lesson" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/git">{t("git.title")}</a> <span aria-hidden="true">/</span> <span>{t(GROUP_TITLE[topic.group])}</span>{" "}
        <span aria-hidden="true">/</span> <span>{tx(topic.title)}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title" ref={heading} tabIndex={-1}>{tx(topic.title)}</h1>
        <p className="muted">
          <Rich text={tx(topic.summary)} /> <Untranslated text={topic.summary} />
        </p>
        <div className="row wrap">
          <span className={`badge state-${state}`}>{t(`progress.state.${state}`)}</span>
          <span className="small">{t("git.topicOf", { i: idx + 1, n: GIT_TOPICS.length })}</span>
        </div>
      </header>

      <nav className="toc" aria-label={t("git.contents")}>
        {SECTIONS.map(([s, key]) => (
          <a
            key={s}
            href={`#/git/${topic.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`g-${s}`)?.scrollIntoView({ block: "start" });
            }}
          >
            {t(key)}
          </a>
        ))}
      </nav>

      <section className="card section" id="g-what">
        <h2>{t("git.section.what")}</h2>
        <p><Rich text={tx(topic.what)} /> <Untranslated text={topic.what} /></p>
      </section>

      <section className="card section" id="g-how">
        <h2>{t("git.section.how")}</h2>
        <p><Rich text={tx(topic.how)} /></p>
        {topic.viz && (
          <p>
            <a className="btn" href="#/gitviz">{t("git.tryViz")} →</a> <span className="small">{t("git.vizNote")}</span>
          </p>
        )}
      </section>

      <section className="card section" id="g-examples">
        <h2>{t("git.section.examples")}</h2>
        {topic.examples.map((x, i) => (
          <div key={i} className="example">
            <CodeBlock code={x.code} lang={x.lang} label={`${t("git.example")} ${i + 1}`} />
            <p><Rich text={tx(x.explain)} /></p>
          </div>
        ))}
      </section>

      <section className="card section" id="g-mistakes">
        <h2>{t("git.section.mistakes")}</h2>
        <ul>
          {topic.mistakes.map((m, i) => (
            <li key={i}><Rich text={tx(m)} /></li>
          ))}
        </ul>
      </section>

      <section className="card section" id="g-exercise">
        <h2>{t("git.section.exercise")}</h2>
        <p><Rich text={tx(topic.exercise)} /></p>
        <p className="small">{t("git.exerciseNote")}</p>
      </section>

      <section className="card section" id="g-quiz">
        <h2>{t("git.section.quiz")}</h2>
        <Quiz lessonId={progressId} questions={topic.quiz} />
      </section>

      <section className="card section" id="g-docs">
        <h2>{t("git.section.docs")}</h2>
        <ul className="sources">
          {topic.docs.map((d) => (
            <li key={d.url}>
              <a href={d.url} target="_blank" rel="noreferrer noopener">{d.title} ↗</a>
            </li>
          ))}
        </ul>
      </section>

      <nav className="row between wrap mt" aria-label={t("git.pager")}>
        {prev ? <a className="btn" href={`#/git/${prev.id}`}>← {t("git.prev")}: {tx(prev.title)}</a> : <span />}
        {next ? <a className="btn primary" href={`#/git/${next.id}`}>{t("git.next")}: {tx(next.title)} →</a> : <a className="btn" href="#/git">{t("content.backToList")}</a>}
      </nav>
    </article>
  );
}
