import { useId, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { PASS_SCORE, type QuizQuestion } from "../../content/types";
import { useContent } from "../../content/useContent";
import { CodeBlock, Rich } from "../../ui/CodeBlock";

export function scoreQuiz(questions: QuizQuestion[], answers: (number | null)[]): number {
  if (questions.length === 0) return 0;
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  return Math.round((correct / questions.length) * 100);
}

export function Quiz({ lessonId, questions }: { lessonId: string; questions: QuizQuestion[] }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { recordQuiz, records } = useProgress();
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [result, setResult] = useState<{ score: number; newly: boolean } | null>(null);
  const baseId = useId();
  const allAnswered = answers.every((a) => a !== null);
  const best = records.get(lessonId)?.bestScore;

  const submit = async () => {
    const score = scoreQuiz(questions, answers);
    const newly = await recordQuiz(lessonId, score);
    setResult({ score, newly });
  };

  const retry = () => {
    setAnswers(questions.map(() => null));
    setResult(null);
  };

  return (
    <div className="quiz">
      <p className="small">
        {t("quiz.intro", { pass: PASS_SCORE })}
        {best != null && ` ${t("quiz.best", { score: best })}`}
      </p>
      <ol className="quiz-list">
        {questions.map((q, qi) => {
          const name = `${baseId}-q${qi}`;
          const chosen = answers[qi];
          const options = q.kind === "choice" ? q.options.map((o) => (typeof o === "string" ? o : tx(o))) : q.options;
          return (
            <li key={qi} className="quiz-q">
              <fieldset disabled={!!result}>
                <legend>
                  <Rich text={tx(q.prompt)} />
                </legend>
                {q.kind === "predict" && <CodeBlock code={q.code} lang={q.lang} />}
                {options.map((o, oi) => {
                  const state = result ? (oi === q.answer ? "right" : oi === chosen ? "wrong" : undefined) : undefined;
                  return (
                    <label key={oi} className="quiz-opt" data-state={state}>
                      <input
                        type="radio"
                        name={name}
                        checked={chosen === oi}
                        onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                      />
                      <span>{q.kind === "predict" ? <code>{o}</code> : <Rich text={o} />}</span>
                    </label>
                  );
                })}
              </fieldset>
              {result && (
                <p className={chosen === q.answer ? "ok-text" : "err-text"}>
                  {chosen === q.answer ? `✓ ${t("quiz.correct")}` : `✗ ${t("quiz.incorrect")}`} — <Rich text={tx(q.explain)} />
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {!result ? (
        <button type="button" className="btn primary" disabled={!allAnswered} onClick={() => void submit()}>
          {t("quiz.check")}
        </button>
      ) : (
        <div className={`banner ${result.score >= PASS_SCORE ? "ok" : "warn"}`} role="status">
          <span>
            {t("quiz.score", { score: result.score })}{" "}
            {result.score >= PASS_SCORE ? (result.newly ? t("quiz.passedNew") : t("quiz.passed")) : t("quiz.failed", { pass: PASS_SCORE })}
          </span>
          <button type="button" className="btn" onClick={retry}>
            {t("quiz.retry")}
          </button>
        </div>
      )}
      {!result && !allAnswered && <p className="small">{t("quiz.answerAll")}</p>}
    </div>
  );
}
