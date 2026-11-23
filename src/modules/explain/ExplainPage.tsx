import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useContent } from "../../content/useContent";
import { detectLanguage, explainCode, type ExplainLang, type Explanation, type WordInfo } from "../../knowledge/explain";
import { findTerm } from "../../knowledge/keywords";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import { TermCard } from "../search/TermCard";

const SAMPLES: Record<ExplainLang, string> = {
  python: 'def average(numbers):\n    if len(numbers) == 0:\n        return 0\n    total = 0\n    for n in numbers:\n        total += n\n    return total / len(numbers)\n\nscores = [78, 92, 85]\nprint(average(scores))',
  javascript: 'const prices = [12, 45, 8];\nlet total = 0;\nfor (const p of prices) {\n  total += p;\n}\nconst label = total > 50 ? "big" : "small";\nconsole.log(`${total} (${label})`);',
  sql: "SELECT name, city\nFROM users\nWHERE age >= 18\nORDER BY name\nLIMIT 10;",
};

const MAX_CHARS = 20000;

type Focus = { kind: "all" } | { kind: "lines"; from: number; to: number } | { kind: "word"; word: string; line: number };

export default function ExplainPage() {
  const { t } = useI18n();
  const { tx } = useContent();
  // Code sent from Code Lab ("Explain this code") arrives once via sessionStorage.
  const [handoff] = useState<{ code: string; lang: ExplainLang } | null>(() => {
    try {
      // Removed after mount (not here: StrictMode may call this initializer twice).
      const raw = sessionStorage.getItem("cv.explain.handoff");
      const v = raw ? JSON.parse(raw) : null;
      return v && typeof v.code === "string" && ["python", "javascript", "sql"].includes(v.lang) ? v : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.removeItem("cv.explain.handoff");
    } catch {
      /* ignore */
    }
  }, []);
  const [code, setCode] = useState(handoff?.code ?? SAMPLES.python);
  const [langChoice, setLangChoice] = useState<ExplainLang | "auto">(handoff?.lang ?? "auto");
  const [result, setResult] = useState<Explanation | null>(() => (handoff ? explainCode(handoff.code.slice(0, MAX_CHARS), handoff.lang) : null));
  const [focus, setFocus] = useState<Focus>({ kind: "all" });
  const [needLang, setNeedLang] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  const detected = useMemo(() => detectLanguage(code), [code]);
  const lang: ExplainLang | null = langChoice === "auto" ? detected : langChoice;

  const run = (f: Focus) => {
    if (!lang) {
      setNeedLang(true);
      return;
    }
    setNeedLang(false);
    setResult(explainCode(code.slice(0, MAX_CHARS), lang));
    setFocus(f);
  };

  const explainSelection = () => {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const before = code.slice(0, s);
    const fromLine = before.split("\n").length;
    const selected = code.slice(s, e);
    if (!selected.trim()) {
      // caret only: explain the line it is on
      run({ kind: "lines", from: fromLine, to: fromLine });
      return;
    }
    const word = selected.trim();
    if (/^[^\s]+$/.test(word) && !word.includes("\n")) run({ kind: "word", word, line: fromLine });
    else run({ kind: "lines", from: fromLine, to: fromLine + selected.split("\n").length - 1 });
  };

  const visibleLines = result
    ? result.lines.filter((l) => focus.kind === "all" || (focus.kind === "lines" && l.line >= focus.from && l.line <= focus.to) || (focus.kind === "word" && l.line === focus.line))
    : [];

  const wordInfo: WordInfo | null = useMemo(() => {
    if (!result || focus.kind !== "word") return null;
    const w = focus.word;
    const found = result.words.find((x) => x.token === w || x.term?.aliases?.includes(w) || (result.lang === "sql" && x.token.toLowerCase() === w.toLowerCase()));
    if (found) return found;
    const term = findTerm(w, result.lang);
    return term ? { token: w, term, lines: [] } : { token: w, lines: [] };
  }, [result, focus]);

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.explain.title")}</h1>
        <p className="muted">{t("explain.intro")}</p>
      </header>

      <div className="card">
        <div className="row wrap between">
          <label className="row">
            <span>{t("explain.language")}</span>
            <select value={langChoice} onChange={(e) => setLangChoice(e.target.value as ExplainLang | "auto")}>
              <option value="auto">{t("explain.auto")}{langChoice === "auto" && detected ? ` (${t(`explain.lang.${detected}`)})` : ""}</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="sql">SQL</option>
            </select>
          </label>
          <span className="row wrap small">
            {t("explain.samples")}:
            {(Object.keys(SAMPLES) as ExplainLang[]).map((k) => (
              <button key={k} type="button" className="link" onClick={() => { setCode(SAMPLES[k]); setLangChoice("auto"); setResult(null); }}>
                {t(`explain.lang.${k}`)}
              </button>
            ))}
          </span>
        </div>
        <textarea
          ref={ta}
          className="code-input"
          spellCheck={false}
          value={code}
          maxLength={MAX_CHARS}
          aria-label={t("explain.codeLabel")}
          onChange={(e) => setCode(e.target.value)}
          rows={Math.min(18, Math.max(6, code.split("\n").length + 1))}
        />
        <div className="row wrap">
          <button type="button" className="btn primary" onClick={() => run({ kind: "all" })} disabled={!code.trim()}>
            {t("explain.all")}
          </button>
          <button type="button" className="btn" onMouseDown={(e) => e.preventDefault()} onClick={explainSelection} disabled={!code.trim()}>
            {t("explain.selection")}
          </button>
          <span className="small">{t("explain.privacy")}</span>
        </div>
        {needLang && <p className="err-text small">{t("explain.chooseLanguage")}</p>}
      </div>

      {result && (
        <>
          <div className={`banner ${result.recognised >= 80 ? "ok" : "warn"}`} role="status">
            {t("explain.coverage", { pct: result.recognised, lang: t(`explain.lang.${result.lang}`) })}
            {focus.kind !== "all" && (
              <button type="button" className="link" onClick={() => setFocus({ kind: "all" })}>{t("explain.showAll")}</button>
            )}
          </div>

          {wordInfo && (
            <article className="card">
              <h2><Rich text={t("explain.wordTitle", { word: wordInfo.token })} /></h2>
              {wordInfo.term ? (
                <TermCard term={wordInfo.term} compact />
              ) : wordInfo.definedAt ? (
                <p><Rich text={t(`explain.defined.${wordInfo.definedAt.as}`, { name: wordInfo.token, line: wordInfo.definedAt.line })} /></p>
              ) : (
                <p className="muted">{t("explain.wordUnknown")}</p>
              )}
            </article>
          )}

          <div className="grid explain-grid">
            <article className="card">
              <h2>{t("explain.lineByLine")}</h2>
              <ol className="explain-lines">
                {visibleLines.map((l) =>
                  l.kind === "blank" ? null : (
                    <li key={l.line} data-kind={l.kind} style={{ marginLeft: `${Math.min(l.depth, 6) * 14}px` }}>
                      <div className="row">
                        <span className="ln-badge">{l.line}</span>
                        <code className="explain-code">{l.code.trim()}</code>
                      </div>
                      <p className={l.kind === "unknown" ? "muted small" : "small"}><Rich text={tx(l.text)} /></p>
                    </li>
                  ),
                )}
              </ol>
            </article>

            <article className="card">
              <h2>{t("explain.words")}</h2>
              {result.words.length === 0 ? (
                <p className="muted small">{t("explain.noWords")}</p>
              ) : (
                <ul className="word-list">
                  {result.words.map((w) => (
                    <li key={w.term ? w.term.id : `d:${w.token}`}>
                      <button type="button" className="link" onClick={() => setFocus({ kind: "word", word: w.token, line: w.lines[0] })}>
                        <code>{w.token}</code>
                      </button>{" "}
                      <span className="small">
                        {w.term
                          ? tx(w.term.meaning).replace(/`/g, "").slice(0, 110) + (tx(w.term.meaning).length > 110 ? "…" : "")
                          : t(`explain.defined.${w.definedAt!.as}`, { name: w.token, line: w.definedAt!.line }).replace(/`/g, "")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <p className="small">{t("explain.limits")}</p>
          <details>
            <summary className="small">{t("explain.showCode")}</summary>
            <CodeBlock code={code} lang={result.lang} notes={result.lines.map((l) => tx(l.text))} />
          </details>
        </>
      )}
    </section>
  );
}
