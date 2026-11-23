import { Fragment, useId, useState, type ReactNode } from "react";
import type { CodeLang } from "../content/types";
import { tokenizeLine } from "./highlight";

/** Renders `inline code` spans inside plain text. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") && p.endsWith("`") && p.length > 2 ? <code key={i}>{p.slice(1, -1)}</code> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

function Line({ text, lang }: { text: string; lang: CodeLang }) {
  return (
    <>
      {tokenizeLine(text, lang).map((t, i) =>
        t.type === "text" ? <Fragment key={i}>{t.text}</Fragment> : <span key={i} className={`tk-${t.type}`}>{t.text}</span>,
      )}
    </>
  );
}

/**
 * Highlighted code. When `notes` are given, every line becomes a button: selecting it shows
 * that line's explanation (keyboard accessible, explanation announced via aria-live).
 */
export function CodeBlock({
  code,
  lang,
  notes,
  label,
  footer,
}: {
  code: string;
  lang: CodeLang;
  notes?: string[];
  label?: string;
  footer?: ReactNode;
}) {
  const lines = code.split("\n");
  const [sel, setSel] = useState<number | null>(null);
  const id = useId();
  const interactive = !!notes;

  return (
    <div className="code-wrap">
      <pre className="code" aria-label={label} data-lang={lang}>
        <code>
          {lines.map((l, i) => (
            <span className="code-line" key={i} data-selected={sel === i || undefined}>
              <span className="ln" aria-hidden="true">
                {i + 1}
              </span>
              {interactive && notes![i] ? (
                <button
                  type="button"
                  className="line-btn"
                  aria-pressed={sel === i}
                  aria-controls={`${id}-note`}
                  onClick={() => setSel(sel === i ? null : i)}
                >
                  <Line text={l} lang={lang} />
                </button>
              ) : (
                <span className="line-txt">
                  <Line text={l || " "} lang={lang} />
                </span>
              )}
            </span>
          ))}
        </code>
      </pre>
      {interactive && (
        <div id={`${id}-note`} className="line-note" aria-live="polite">
          {sel !== null && notes![sel] ? (
            <>
              <strong>{sel + 1}:</strong> <Rich text={notes![sel]} />
            </>
          ) : null}
        </div>
      )}
      {footer}
    </div>
  );
}
