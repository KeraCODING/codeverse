import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useSettings } from "../../core/settings/SettingsContext";
import { useContent } from "../../content/useContent";
import { checkOutput, runCode, type CheckResult, type RunResult, type RunnableLang } from "../../runtime";
import { fillGroups, matchErrors } from "../../knowledge/errors";
import { Rich } from "../CodeBlock";
import { CodeEditor } from "./CodeEditor";

const DRAFT_PREFIX = "cv.draft.";

function loadDraft(key?: string): string | null {
  if (!key) return null;
  try {
    return localStorage.getItem(DRAFT_PREFIX + key);
  } catch {
    return null;
  }
}

/**
 * Editor + Run + output console. With `expected`, every run is also checked against the expected
 * output and `onCheck` reports the result (exercises, challenges, debug tasks).
 */
export function RunPanel({
  lang,
  initial,
  draftKey,
  expected,
  onCheck,
  minLines = 8,
  extraActions,
}: {
  lang: RunnableLang;
  initial: string;
  draftKey?: string; // enables auto-save of the draft (Settings → Editor → Auto save)
  expected?: string;
  onCheck?: (r: CheckResult) => void;
  minLines?: number;
  extraActions?: (code: string) => React.ReactNode;
}) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { settings } = useSettings();
  const [code, setCode] = useState(() => (settings.editorAutoSave && loadDraft(draftKey)) || initial);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [check, setCheck] = useState<CheckResult | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced draft auto-save; only while the user is typing (no timers otherwise).
  useEffect(() => {
    if (!draftKey || !settings.editorAutoSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        if (code === initial) localStorage.removeItem(DRAFT_PREFIX + draftKey);
        else localStorage.setItem(DRAFT_PREFIX + draftKey, code);
      } catch {
        /* storage unavailable */
      }
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [code, draftKey, initial, settings.editorAutoSave]);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setCheck(null);
    const r = await runCode(lang, code);
    setResult(r);
    setRunning(false);
    if (expected !== undefined) {
      const c = checkOutput(r, expected);
      setCheck(c);
      onCheck?.(c);
    }
  };

  const err = result?.error;
  const known = err ? matchErrors(`${err.name}: ${err.message}`)[0] : undefined;

  return (
    <div className="run-panel">
      <CodeEditor value={code} onChange={setCode} lang={lang} label={t("lab.editorLabel")} minLines={minLines} onRun={() => void run()} />
      <div className="row wrap">
        <button type="button" className="btn primary" onClick={() => void run()} disabled={running || !code.trim()}>
          {running ? t("lab.running") : expected !== undefined ? t("lab.runCheck") : t("lab.run")}
        </button>
        <button type="button" className="btn" onClick={() => { setCode(initial); setResult(null); setCheck(null); }}>
          {t("lab.reset")}
        </button>
        <button type="button" className="btn" onClick={() => void navigator.clipboard?.writeText(code)}>
          {t("lab.copy")}
        </button>
        {extraActions?.(code)}
        <span className="small">{t("lab.shortcut")}</span>
      </div>

      {result && (
        <div className="console" role="log" aria-live="polite" aria-label={t("lab.output")}>
          <div className="console-head small">
            {t("lab.output")} · {result.durationMs} ms{result.truncated ? ` · ${t("lab.truncated")}` : ""}
          </div>
          {result.output ? <pre>{result.output}</pre> : !err && <p className="muted small">{t("lab.noOutput")}</p>}
          {err && (
            <div className="console-error">
              <pre className="err-text">
                {err.detail ? err.detail.trimEnd() : `${err.name}: ${err.message}`}
                {err.line && !err.detail ? ` (${t("errors.line", { n: err.line })})` : ""}
              </pre>
              {err.name === "InputNotSupported" && <p className="small"><Rich text={t("lab.inputHelp")} /></p>}
              {result.timedOut && <p className="small"><Rich text={t("lab.timeoutHelp")} /></p>}
              {known && (
                <p className="small">
                  <strong>{fillGroups(tx(known.pattern.title), known.groups)}</strong> — <Rich text={fillGroups(tx(known.pattern.meaning), known.groups)} />{" "}
                  <a href={`#/errors/${known.pattern.id}`}>{t("lab.moreAboutError")} →</a>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {check && (
        <div className={`banner ${check.passed ? "ok" : "warn"}`} role="status">
          {check.passed ? (
            <span>✓ {t("lab.checkPassed")}</span>
          ) : (
            <div className="check-diff">
              <span>✗ {t("lab.checkFailed")}</span>
              <div className="compare">
                <div>
                  <span className="small">{t("lab.expected")}</span>
                  <pre>{check.expected || "∅"}</pre>
                </div>
                <div>
                  <span className="small">{t("lab.actual")}</span>
                  <pre>{check.actual || "∅"}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
