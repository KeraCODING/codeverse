import { useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { LESSON_INDEX } from "../../content";
import { LANGUAGES } from "../../content/catalog/languages";
import { PASS_SCORE } from "../../content/types";
import { useContent } from "../../content/useContent";
import { ConfirmDialog } from "../../ui/ConfirmDialog";

export default function ProgressPage() {
  const { t, formatDateTime } = useI18n();
  const { tx } = useContent();
  const { records, ready, clearAll } = useProgress();
  const [confirm, setConfirm] = useState(false);

  const completed = LESSON_INDEX.filter((l) => records.get(l.id)?.state === "completed");
  const weak = LESSON_INDEX.filter((l) => records.get(l.id)?.state === "attempted");
  const started = LESSON_INDEX.filter((l) => records.get(l.id)?.state === "started");
  const byLang = LANGUAGES.map((lang) => {
    const lessons = LESSON_INDEX.filter((l) => l.language === lang.id);
    return { lang, total: lessons.length, done: lessons.filter((l) => records.get(l.id)?.state === "completed").length };
  }).filter((x) => x.total > 0);
  const lessonIds = new Set(LESSON_INDEX.map((l) => l.id));
  // Average over lessons only (Git/security topics and practice tasks have their own progress).
  const scored = [...records.values()].filter((r) => r.bestScore !== null && lessonIds.has(r.lessonId));
  const avg = scored.length ? Math.round(scored.reduce((a, r) => a + (r.bestScore ?? 0), 0) / scored.length) : null;

  if (!ready) return <div className="loading">{t("common.loading")}</div>;

  const LessonLink = ({ id }: { id: string }) => {
    const meta = LESSON_INDEX.find((l) => l.id === id)!;
    return <a href={`#/languages/${meta.language}/${id}`}>{tx(meta.title)}</a>;
  };

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.progress.title")}</h1>
        <p className="muted">{t("progress.intro", { pass: PASS_SCORE })}</p>
      </header>

      <div className="grid">
        <article className="card">
          <h2>{t("progress.completed")}</h2>
          <p className="stat">{completed.length} / {LESSON_INDEX.length}</p>
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={LESSON_INDEX.length} aria-valuenow={completed.length} aria-label={t("progress.completed")}>
            <span style={{ width: `${(completed.length / Math.max(1, LESSON_INDEX.length)) * 100}%` }} />
          </div>
        </article>
        <article className="card">
          <h2>{t("progress.avgScore")}</h2>
          <p className="stat">{avg === null ? "—" : `${avg}%`}</p>
          <p className="small">{t("progress.avgNote")}</p>
        </article>
        <article className="card">
          <h2>{t("progress.inProgress")}</h2>
          <p className="stat">{started.length + weak.length}</p>
        </article>
      </div>

      <div className="grid two">
        <article className="card">
          <h2>{t("progress.byLanguage")}</h2>
          <ul className="list">
            {byLang.map(({ lang, done, total }) => (
              <li key={lang.id}>
                <a href={`#/languages/${lang.id}`}>{lang.name}</a>
                <span className="small">{done}/{total}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2>{t("progress.weak")}</h2>
          {weak.length === 0 ? (
            <p className="muted">{t("progress.weakNone")}</p>
          ) : (
            <ul className="list">
              {weak.map((l) => (
                <li key={l.id}>
                  <LessonLink id={l.id} />
                  <span className="small">{records.get(l.id)!.bestScore}%</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <article className="card">
        <h2>{t("progress.history")}</h2>
        {records.size === 0 ? (
          <p className="muted">{t("progress.empty")}</p>
        ) : (
          <table className="parts">
            <thead>
              <tr>
                <th scope="col">{t("progress.lesson")}</th>
                <th scope="col">{t("progress.status")}</th>
                <th scope="col">{t("progress.best")}</th>
                <th scope="col">{t("progress.attempts")}</th>
                <th scope="col">{t("progress.updated")}</th>
              </tr>
            </thead>
            <tbody>
              {[...records.values()]
                .filter((r) => LESSON_INDEX.some((l) => l.id === r.lessonId))
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((r) => (
                  <tr key={r.lessonId}>
                    <td><LessonLink id={r.lessonId} /></td>
                    <td><span className={`badge state-${r.state}`}>{t(`progress.state.${r.state}`)}</span></td>
                    <td>{r.bestScore === null ? "—" : `${r.bestScore}%`}</td>
                    <td>{r.attempts}</td>
                    <td className="small">{formatDateTime(r.updatedAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </article>

      {records.size > 0 && (
        <button type="button" className="btn danger" onClick={() => setConfirm(true)}>
          {t("progress.reset")}
        </button>
      )}
      <ConfirmDialog
        open={confirm}
        title={t("progress.reset")}
        body={t("progress.resetConfirm")}
        confirmLabel={t("common.clear")}
        cancelLabel={t("common.cancel")}
        danger
        onConfirm={() => void clearAll()}
        onClose={() => setConfirm(false)}
      />
    </section>
  );
}
