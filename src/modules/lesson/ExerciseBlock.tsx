import { lazy, Suspense, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useSettings } from "../../core/settings/SettingsContext";
import { useProgress } from "../../core/progress/ProgressContext";
import { isRunnable } from "../../runtime";

// CodeMirror and the sandboxes load only when a lesson with a runnable exercise is opened.
const RunPanel = lazy(() => import("../../ui/editor/RunPanel").then((m) => ({ default: m.RunPanel })));
import type { Exercise } from "../../content/types";
import { useContent } from "../../content/useContent";
import { CodeBlock, Rich } from "../../ui/CodeBlock";

/**
 * Practice task. Hints and the solution follow Settings → Learning:
 *  - hints: progressive (one at a time) | onRequest (all at once on click) | off
 *  - solution: afterAttempts (after every hint was seen) | onRequest | never
 * The solution is never shown automatically. Runnable languages get an in-lesson editor with automatic checking.
 */
export function ExerciseBlock({ exercise, lessonId }: { exercise: Exercise; lessonId: string }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { settings } = useSettings();
  const { markPracticePassed, records } = useProgress();
  const [passed, setPassed] = useState(() => records.get(`practice:exercise:${lessonId}`)?.state === "completed");
  const [shownHints, setShownHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const total = exercise.hints.length;
  const hintsOff = settings.hintMode === "off";

  const solutionAvailable =
    settings.solutionMode === "onRequest" || (settings.solutionMode === "afterAttempts" && (shownHints >= total || hintsOff));

  return (
    <div className="exercise">
      <p>
        <strong>{t("exercise.objective")}:</strong> <Rich text={tx(exercise.objective)} />
      </p>
      <p>
        <Rich text={tx(exercise.task)} />
      </p>

      {!hintsOff && total > 0 && (
        <div className="hints">
          {exercise.hints.slice(0, shownHints).map((h, i) => (
            <p key={i} className="hint">
              <span className="small">{t("exercise.hint", { n: i + 1 })}</span> <Rich text={tx(h)} />
            </p>
          ))}
          {shownHints < total && (
            <button
              type="button"
              className="btn"
              onClick={() => setShownHints(settings.hintMode === "progressive" ? shownHints + 1 : total)}
            >
              {settings.hintMode === "progressive" ? t("exercise.showHint", { n: shownHints + 1, total }) : t("exercise.showHints")}
            </button>
          )}
        </div>
      )}

      {settings.solutionMode !== "never" && (
        <div className="solution">
          {showSolution ? (
            <CodeBlock code={exercise.solution} lang={exercise.lang} label={t("exercise.solution")} />
          ) : (
            <>
              <button type="button" className="btn" disabled={!solutionAvailable} onClick={() => setShowSolution(true)}>
                {t("exercise.showSolution")}
              </button>
              {!solutionAvailable && <p className="small">{t("exercise.solutionAfterHints")}</p>}
            </>
          )}
        </div>
      )}
      {exercise.check && isRunnable(exercise.lang) ? (
        <div className="try-it">
          <h3>{t("exercise.tryIt")}</h3>
          <Suspense fallback={<p className="muted">{t("common.loading")}</p>}>
            <RunPanel
              lang={exercise.lang}
              initial={exercise.check.starter}
              draftKey={`exercise.${lessonId}`}
              expected={exercise.check.expected}
              minLines={6}
              onCheck={(c) => {
                if (c.passed) {
                  setPassed(true);
                  markPracticePassed(`exercise:${lessonId}`);
                }
              }}
            />
          </Suspense>
          {passed && <p className="ok-text small">✓ {t("exercise.passed")}</p>}
        </div>
      ) : (
        <p className="small">{t("exercise.selfCheck")}</p>
      )}
    </div>
  );
}
