import { lazy, Suspense, useEffect, useState } from "react";
import { navigate, useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { useSettings } from "../../core/settings/SettingsContext";
import { LESSON_INDEX, findLessonMeta, loadLesson } from "../../content";
import { CHALLENGES, DEBUG_TASKS, type PracticeTask } from "../../content/practice";
import type { QuizQuestion } from "../../content/types";
import { useContent } from "../../content/useContent";
import { CodeBlock, Rich } from "../../ui/CodeBlock";

// The editor (CodeMirror) loads only when a task is opened.
const RunPanel = lazy(() => import("../../ui/editor/RunPanel").then((m) => ({ default: m.RunPanel })));

const MODES = ["challenges", "debug", "predict", "practice"] as const;
const LANG_LABEL: Record<string, string> = { javascript: "JavaScript", typescript: "TypeScript", python: "Python", sql: "SQL" };
type Mode = (typeof MODES)[number];

export default function InteractivePage() {
  const { t } = useI18n();
  const [modeParam, taskId] = useRouteParams();
  const { settings } = useSettings();
  // Without a mode in the URL, Settings → General → Default learning mode decides the first tab.
  const fallback: Mode = settings.defaultLearningMode === "challenge" ? "challenges" : "practice";
  const mode: Mode = (MODES as readonly string[]).includes(modeParam) ? (modeParam as Mode) : fallback;
  const all = [...CHALLENGES, ...DEBUG_TASKS];
  const task = taskId ? all.find((x) => x.id === taskId) : undefined;

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.interactive.title")}</h1>
        <p className="muted">{t("practice.intro")}</p>
      </header>
      <div className="tabs" role="tablist" aria-label={t("practice.modes")}>
        {MODES.map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className="tab" onClick={() => navigate(`interactive/${m}`)}>
            {t(`practice.mode.${m}`)}
          </button>
        ))}
      </div>
      <p className="small">{t(`practice.modeHelp.${mode}`)}</p>

      {task ? (
        <TaskView key={task.id} task={task} debug={mode === "debug"} />
      ) : mode === "challenges" ? (
        <TaskList tasks={CHALLENGES} mode="challenges" />
      ) : mode === "debug" ? (
        <TaskList tasks={DEBUG_TASKS} mode="debug" />
      ) : mode === "predict" ? (
        <PredictMode />
      ) : (
        <PracticeList />
      )}
    </section>
  );
}

function TaskList({ tasks, mode }: { tasks: PracticeTask[]; mode: Mode }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { records } = useProgress();
  return (
    <ul className="results">
      {tasks.map((x) => {
        const done = records.get(`practice:${x.id}`)?.state === "completed";
        return (
          <li key={x.id} className="result">
            <a href={`#/interactive/${mode}/${x.id}`}>
              <span className="row wrap">
                <span className="badge">{LANG_LABEL[x.lang]}</span>
                <span className="result-title">{tx(x.title)}</span>
                <span className="small">{"●".repeat(x.level)}{"○".repeat(3 - x.level)}</span>
                {done && <span className="badge state-completed">✓ {t("practice.solved")}</span>}
              </span>
              <span className="result-sub">{tx(x.task).replace(/`/g, "")}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function TaskView({ task, debug }: { task: PracticeTask; debug: boolean }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { settings } = useSettings();
  const { markPracticePassed, records } = useProgress();
  const [failures, setFailures] = useState(0);
  const [passed, setPassed] = useState(false);
  const [shownHints, setShownHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const hintsOff = settings.hintMode === "off";
  const solvedBefore = records.get(`practice:${task.id}`)?.state === "completed";

  // Hints are offered after a failed attempt (not before the learner has tried).
  const canHint = !hintsOff && shownHints < task.hints.length && (failures > 0 || settings.hintMode === "onRequest");
  const solutionAvailable =
    settings.solutionMode === "onRequest" ||
    (settings.solutionMode === "afterAttempts" && failures >= 2 && (shownHints >= task.hints.length || hintsOff));

  return (
    <article className="card">
      <a className="small" href={`#/interactive/${debug ? "debug" : "challenges"}`}>← {t("content.backToList")}</a>
      <h2 className="mt">{tx(task.title)}</h2>
      <p><Rich text={tx(task.task)} /></p>
      {solvedBefore && !passed && <p className="small ok-text">✓ {t("practice.solvedBefore")}</p>}
      <details className="small">
        <summary>{t("practice.expectedOutput")}</summary>
        <pre className="expected">{task.expected}</pre>
      </details>

      <Suspense fallback={<p className="muted">{t("common.loading")}</p>}>
        <RunPanel
          lang={task.lang}
          initial={task.starter}
          draftKey={`practice.${task.id}`}
          expected={task.expected}
          minLines={6}
          onCheck={(c) => {
            if (c.passed) {
              setPassed(true);
              markPracticePassed(task.id);
            } else setFailures((n) => n + 1);
          }}
        />
      </Suspense>

      {passed && task.why && (
        <p className="banner ok"><span><strong>{t("practice.whatWasWrong")}</strong> <Rich text={tx(task.why)} /></span></p>
      )}

      {!passed && (
        <div className="hints">
          {task.hints.slice(0, shownHints).map((h, i) => (
            <p key={i} className="hint">
              <span className="small">{t("exercise.hint", { n: i + 1 })}</span> <Rich text={tx(h)} />
            </p>
          ))}
          {canHint && (
            <button type="button" className="btn" onClick={() => setShownHints(settings.hintMode === "progressive" ? shownHints + 1 : task.hints.length)}>
              {t("exercise.showHint", { n: shownHints + 1, total: task.hints.length })}
            </button>
          )}
          {!hintsOff && failures === 0 && settings.hintMode === "progressive" && <p className="small">{t("practice.hintAfterTry")}</p>}
        </div>
      )}

      {settings.solutionMode !== "never" && (
        <div className="solution">
          {showSolution ? (
            <CodeBlock code={task.solution} lang={task.lang} label={t("exercise.solution")} />
          ) : (
            <>
              <button type="button" className="btn" disabled={!solutionAvailable && !passed} onClick={() => setShowSolution(true)}>
                {t("exercise.showSolution")}
              </button>
              {!solutionAvailable && !passed && <p className="small">{t("practice.solutionLocked")}</p>}
            </>
          )}
        </div>
      )}

      {task.lessons.length > 0 && (
        <p className="small">
          {t("search.relatedLessons")}:{" "}
          {task.lessons.map((id, i) => {
            const m = findLessonMeta(id);
            return m ? <span key={id}>{i > 0 && ", "}<a href={`#/languages/${m.language}/${id}`}>{tx(m.title)}</a></span> : null;
          })}
        </p>
      )}
    </article>
  );
}

/** Predict-the-output: every "predict" question from all lessons, one at a time. */
function PredictMode() {
  const { t } = useI18n();
  const { tx } = useContent();
  const [items, setItems] = useState<{ q: Extract<QuizQuestion, { kind: "predict" }>; lessonId: string }[] | null>(null);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  useEffect(() => {
    let live = true;
    Promise.all(LESSON_INDEX.map((m) => loadLesson(m.id))).then((lessons) => {
      if (!live) return;
      const all = lessons.flatMap((l) =>
        l ? l.quiz.filter((q): q is Extract<QuizQuestion, { kind: "predict" }> => q.kind === "predict").map((q) => ({ q, lessonId: l.id })) : [],
      );
      setItems(all);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!items) return <p className="muted">{t("common.loading")}</p>;
  if (items.length === 0) return <p className="muted">{t("search.none")}</p>;
  const { q, lessonId } = items[i % items.length];
  const meta = findLessonMeta(lessonId);

  return (
    <article className="card">
      <div className="row between">
        <span className="small">{t("practice.questionOf", { n: (i % items.length) + 1, total: items.length })}</span>
        <span className="small">{t("practice.score", { right: score.right, total: score.total })}</span>
      </div>
      <p><Rich text={tx(q.prompt)} /></p>
      <CodeBlock code={q.code} lang={q.lang} />
      <div className="quiz-q">
        {q.options.map((o, oi) => (
          <button
            key={oi}
            type="button"
            className="quiz-opt option-btn"
            data-state={chosen === null ? undefined : oi === q.answer ? "right" : oi === chosen ? "wrong" : undefined}
            disabled={chosen !== null}
            onClick={() => {
              setChosen(oi);
              setScore((s) => ({ right: s.right + (oi === q.answer ? 1 : 0), total: s.total + 1 }));
            }}
          >
            <code>{o}</code>
          </button>
        ))}
      </div>
      {chosen !== null && (
        <>
          <p className={chosen === q.answer ? "ok-text" : "err-text"}>
            {chosen === q.answer ? `✓ ${t("quiz.correct")}` : `✗ ${t("quiz.incorrect")}`} — <Rich text={tx(q.explain)} />
          </p>
          <div className="row wrap">
            <button type="button" className="btn primary" onClick={() => { setI(i + 1); setChosen(null); }}>{t("practice.next")} →</button>
            {meta && <a className="small" href={`#/languages/${meta.language}/${lessonId}`}>{tx(meta.title)}</a>}
          </div>
        </>
      )}
    </article>
  );
}

/** Lesson exercises with automatic checking live inside the lessons; this lists them. */
function PracticeList() {
  const { t } = useI18n();
  const { tx } = useContent();
  return (
    <article className="card">
      <p>{t("practice.practiceText")}</p>
      <ul className="list">
        {LESSON_INDEX.map((l) => (
          <li key={l.id}>
            <a href={`#/languages/${l.language}/${l.id}`}>{tx(l.title)}</a>
            <span className="small">{t("practice.autoCheck")}</span>
          </li>
        ))}
      </ul>
      <p className="small">{t("practice.buildMode")}</p>
    </article>
  );
}
