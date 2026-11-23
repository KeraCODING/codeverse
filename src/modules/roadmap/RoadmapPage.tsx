import { useState } from "react";
import { navigate, useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { useSettings } from "../../core/settings/SettingsContext";
import { newId } from "../../core/storage/types";
import { useCollection } from "../../core/storage/useCollection";
import { findLessonMeta } from "../../content";
import { PATHS, type LearningPath, type PathStep } from "../../content/paths";
import { useContent } from "../../content/useContent";
import { emptyRoadmap, type RoadmapState } from "../../personal/models";

type Records = ReturnType<typeof useProgress>["records"];

function stepDone(step: PathStep, state: RoadmapState, records: Records) {
  if (step.kind === "lesson") return records.get(step.ref)?.state === "completed";
  return state.doneSteps.includes(step.id);
}

export function pathProgress(path: LearningPath, state: RoadmapState, records: Records) {
  const total = path.steps.length + state.customSteps.length;
  const done = path.steps.filter((s) => stepDone(s, state, records)).length + state.customSteps.filter((s) => state.doneSteps.includes(s.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export default function RoadmapPage() {
  const [pathId] = useRouteParams();
  const { items, ready, save } = useCollection<RoadmapState>("roadmaps");
  const { t } = useI18n();
  const stateFor = (id: string) => items.find((x) => x.id === id) ?? emptyRoadmap(id);
  if (!ready) return <div className="loading">{t("common.loading")}</div>;
  const path = PATHS.find((p) => p.id === pathId);
  if (path) return <PathView path={path} state={stateFor(path.id)} save={save} />;
  return <Overview stateFor={stateFor} save={save} />;
}

function Overview({ stateFor, save }: { stateFor: (id: string) => RoadmapState; save: (s: RoadmapState) => Promise<RoadmapState> }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { records } = useProgress();
  const followed = PATHS.filter((p) => stateFor(p.id).followed);
  const weak = [...records.values()].filter((r) => r.state === "attempted" && !r.lessonId.includes(":"));

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.roadmap.title")}</h1>
        <p className="muted">{t("roadmap.intro")}</p>
      </header>

      {followed.length === 0 && <Assessment onPick={(id) => void save({ ...stateFor(id), followed: true }).then(() => navigate(`roadmap/${id}`))} />}

      {followed.length > 0 && (
        <article className="card">
          <h2>{t("roadmap.myPaths")}</h2>
          <ul className="list">
            {followed.map((p) => {
              const s = stateFor(p.id);
              const pr = pathProgress(p, s, records);
              const next = p.steps.find((st) => !stepDone(st, s, records));
              return (
                <li key={p.id} className="path-row">
                  <div>
                    <a href={`#/roadmap/${p.id}`}><strong>{tx(p.title)}</strong></a>
                    {next && <p className="small">{t("roadmap.next")}: <StepLabel step={next} /></p>}
                  </div>
                  <div className="path-meter">
                    <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pr.pct} aria-label={tx(p.title)}><span style={{ width: `${pr.pct}%` }} /></div>
                    <span className="small">{pr.done}/{pr.total}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      )}

      {weak.length > 0 && (
        <article className="card">
          <h2>{t("roadmap.revise")}</h2>
          <p className="small">{t("roadmap.reviseHelp")}</p>
          <ul className="chips">
            {weak.map((r) => {
              const meta = findLessonMeta(r.lessonId);
              return meta ? <li key={r.lessonId}><a href={`#/languages/${meta.language}/${meta.id}`}>{tx(meta.title)} ({r.bestScore}%)</a></li> : null;
            })}
          </ul>
        </article>
      )}

      <h2 className="group-title">{t("roadmap.allPaths")}</h2>
      <div className="tile-grid">
        {PATHS.map((p) => {
          const s = stateFor(p.id);
          const pr = pathProgress(p, s, records);
          return (
            <a key={p.id} className="tile" href={`#/roadmap/${p.id}`}>
              <span className="tile-title">{tx(p.title)}</span>
              <span className="small">{t("roadmap.steps", { n: p.steps.length })}{s.followed ? ` · ${pr.pct}%` : ""}</span>
              {s.followed && <span className="badge state-started">{t("roadmap.following")}</span>}
            </a>
          );
        })}
      </div>
    </section>
  );
}

/** Optional starting questions: sets the skill level and recommends a path. */
function Assessment({ onPick }: { onPick: (pathId: string) => void }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { settings, update } = useSettings();
  const [level, setLevel] = useState(settings.skillLevel);
  const [goal, setGoal] = useState("");
  return (
    <article className="card">
      <h2>{t("roadmap.assessTitle")}</h2>
      <p className="small">{t("roadmap.assessHelp")}</p>
      <div className="form-grid">
        <label>
          {t("settings.learning.level")}
          <select value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
            {(["absolute", "beginner", "intermediate", "advanced", "professional"] as const).map((x) => <option key={x} value={x}>{t(`learning.level.${x}`)}</option>)}
          </select>
        </label>
        <label>
          {t("roadmap.goalQuestion")}
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="">—</option>
            {PATHS.map((p) => <option key={p.id} value={p.id}>{tx(p.title)}</option>)}
          </select>
        </label>
      </div>
      <button
        type="button"
        className="btn primary"
        disabled={!goal}
        onClick={() => {
          void update({ skillLevel: level });
          onPick(goal);
        }}
      >
        {t("roadmap.start")}
      </button>
    </article>
  );
}

function StepLabel({ step }: { step: PathStep }) {
  const { tx } = useContent();
  if (step.kind === "lesson") {
    const meta = findLessonMeta(step.ref);
    return meta ? <a href={`#/languages/${meta.language}/${meta.id}`}>{tx(meta.title)}</a> : <>{step.ref}</>;
  }
  if (step.kind === "module") return <a href={`#/${step.ref}`}>{tx(step.text)}</a>;
  return <>{tx(step.text)}</>;
}

function PathView({ path, state, save }: { path: LearningPath; state: RoadmapState; save: (s: RoadmapState) => Promise<RoadmapState> }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { records } = useProgress();
  const [custom, setCustom] = useState("");
  const pr = pathProgress(path, state, records);
  const toggle = (id: string) => void save({ ...state, doneSteps: state.doneSteps.includes(id) ? state.doneSteps.filter((x) => x !== id) : [...state.doneSteps, id] });
  const firstOpen = path.steps.find((s) => !stepDone(s, state, records));

  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/roadmap">{t("module.roadmap.title")}</a> <span aria-hidden="true">/</span> <span>{tx(path.title)}</span>
      </nav>
      <header className="page-head row between wrap">
        <div>
          <h1 id="page-title">{tx(path.title)}</h1>
          <p className="small">{t("roadmap.progress", { done: pr.done, total: pr.total, pct: pr.pct })}</p>
        </div>
        <button type="button" className={`btn ${state.followed ? "" : "primary"}`} onClick={() => void save({ ...state, followed: !state.followed })}>
          {state.followed ? t("roadmap.unfollow") : t("roadmap.follow")}
        </button>
      </header>
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pr.pct} aria-label={tx(path.title)}><span style={{ width: `${pr.pct}%` }} /></div>

      <article className="card">
        <ol className="roadmap-steps">
          {path.steps.map((s) => {
            const done = stepDone(s, state, records);
            return (
              <li key={s.id} data-done={done || undefined} data-next={s === firstOpen || undefined}>
                {s.kind === "lesson" ? (
                  <span className="step-check" aria-label={done ? t("progress.state.completed") : t("roadmap.autoStep")} title={t("roadmap.autoStep")}>{done ? "✓" : "○"}</span>
                ) : (
                  <input type="checkbox" checked={done} aria-label={t("roadmap.markDone")} onChange={() => toggle(s.id)} />
                )}
                <span><StepLabel step={s} /> {s.kind === "lesson" && <span className="small">({t("roadmap.lessonStep")})</span>}</span>
                {s === firstOpen && <span className="badge state-started">{t("roadmap.next")}</span>}
              </li>
            );
          })}
          {state.customSteps.map((s) => (
            <li key={s.id} data-done={state.doneSteps.includes(s.id) || undefined}>
              <input type="checkbox" checked={state.doneSteps.includes(s.id)} aria-label={t("roadmap.markDone")} onChange={() => toggle(s.id)} />
              <span>{s.text} <span className="small">({t("roadmap.myStep")})</span></span>
              <button type="button" className="link small" onClick={() => void save({ ...state, customSteps: state.customSteps.filter((x) => x.id !== s.id), doneSteps: state.doneSteps.filter((x) => x !== s.id) })}>
                {t("common.delete")}
              </button>
            </li>
          ))}
        </ol>
        <form
          className="row wrap"
          onSubmit={(e) => {
            e.preventDefault();
            const text = custom.trim().slice(0, 300);
            if (!text) return;
            void save({ ...state, followed: true, customSteps: [...state.customSteps, { id: newId(), text }] });
            setCustom("");
          }}
        >
          <input className="search-input" value={custom} placeholder={t("roadmap.addStepPh")} aria-label={t("roadmap.addStep")} onChange={(e) => setCustom(e.target.value)} />
          <button type="submit" className="btn" disabled={!custom.trim()}>{t("roadmap.addStep")}</button>
        </form>
      </article>

      <article className="card">
        <h2>{t("roadmap.goal")}</h2>
        <textarea
          rows={2}
          className="code-input note-body"
          defaultValue={state.goal}
          placeholder={t("roadmap.goalPh")}
          aria-label={t("roadmap.goal")}
          onBlur={(e) => e.target.value !== state.goal && void save({ ...state, goal: e.target.value.slice(0, 500) })}
        />
        <p className="small"><a href={`#/fields/${path.field}`}>{t("roadmap.fieldInfo")} →</a></p>
      </article>
    </section>
  );
}
