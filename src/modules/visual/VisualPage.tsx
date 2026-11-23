import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useContent } from "../../content/useContent";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import { VISUAL_TOPICS, findTopic } from "./topics";
import type { Txt, VArrow, VItem, VPanel, VStep, VTopic } from "./types";
import "./visual.css";

/** Resolves language-neutral strings and localised L values alike. */
function useTxt() {
  const { tx } = useContent();
  return useCallback((x: Txt | undefined) => (x === undefined ? "" : typeof x === "string" ? x : tx(x)), [tx]);
}

export default function VisualPage() {
  const { t } = useI18n();
  const [id] = useRouteParams();
  const topic = findTopic(id);

  return (
    <section className="page vis" aria-labelledby="page-title">
      {topic ? (
        <TopicView key={topic.id} topic={topic} />
      ) : (
        <>
          <header className="page-head">
            <h1 id="page-title">{t("module.visual.title")}</h1>
            <p className="muted">{t("visual.intro")}</p>
          </header>
          {id && (
            <p className="banner warn" role="status">
              {t("visual.notFound")}
            </p>
          )}
          <TopicList />
        </>
      )}
    </section>
  );
}

function TopicList() {
  const { t } = useI18n();
  const { tx } = useContent();
  return (
    <nav aria-label={t("visual.topics")}>
      <ul className="tile-grid vis-tiles">
        {VISUAL_TOPICS.map((topic) => (
          <li key={topic.id}>
            <a className="tile" href={`#/visual/${topic.id}`}>
              <span className="tile-title">{tx(topic.title)}</span>
              <span className="tile-desc">{tx(topic.summary).replace(/`/g, "")}</span>
              <span className="small muted">{t("visual.stepsCount", { n: topic.steps.length })}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

function TopicView({ topic }: { topic: VTopic }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const [index, setIndex] = useState(0);
  const total = topic.steps.length;
  const step = topic.steps[index];
  const last = index === total - 1;

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);
  const reset = useCallback(() => setIndex(0), []);

  // ← / → move between steps anywhere on the page, except while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || isEditable(e.target)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [prev, next]);

  const pos = VISUAL_TOPICS.indexOf(topic);
  const prevTopic = VISUAL_TOPICS[pos - 1];
  const nextTopic = VISUAL_TOPICS[pos + 1];
  const hasOutput = topic.steps.some((s) => s.output && s.output.length > 0);

  return (
    <>
      <nav className="crumbs" aria-label={t("visual.breadcrumbs")}>
        <a href="#/visual">{t("module.visual.title")}</a> / <span>{tx(topic.title)}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title">{tx(topic.title)}</h1>
        <p className="vis-intro">
          <Rich text={tx(topic.intro)} />
        </p>
      </header>

      <div className="vis-layout">
        <div className="card vis-code">
          <h2 className="vis-h">{t("visual.code")}</h2>
          <HighlightedCode topic={topic} line={step.line} />
        </div>

        <div className="card vis-main">
          <div className="vis-controls" role="group" aria-label={t("visual.controls")}>
            <button type="button" className="btn" onClick={prev} aria-disabled={index === 0}>
              <span aria-hidden="true">← </span>
              {t("visual.prev")}
            </button>
            <span className="vis-counter" aria-hidden="true">
              {t("visual.stepOf", { n: index + 1, total })}
            </span>
            <button type="button" className="btn primary" onClick={next} aria-disabled={last}>
              {t("visual.next")}
              <span aria-hidden="true"> →</span>
            </button>
            <button type="button" className="btn" onClick={reset} aria-disabled={index === 0}>
              {t("visual.reset")}
            </button>
          </div>
          <div className="vis-progress" aria-hidden="true">
            <span style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>

          <div className="vis-caption" aria-live="polite" aria-atomic="true">
            <p className="small muted vis-caption-meta">
              {t("visual.stepOf", { n: index + 1, total })}
              {step.line !== null ? ` · ${t("visual.line", { n: step.line })}` : ""}
            </p>
            <p className="vis-caption-text">
              <Rich text={tx(step.caption)} />
            </p>
          </div>

          <Scene step={step} />
          {hasOutput && <Output lines={step.output ?? []} />}
          <p className="small muted vis-keys">{t("visual.keys")}</p>
        </div>
      </div>

      <nav className="row between wrap vis-topic-nav" aria-label={t("visual.topicNav")}>
        {prevTopic ? (
          <a className="btn" href={`#/visual/${prevTopic.id}`} aria-label={`${t("visual.prevTopic")}: ${tx(prevTopic.title)}`}>
            ← {tx(prevTopic.title)}
          </a>
        ) : (
          <span />
        )}
        {nextTopic && (
          <a className="btn" href={`#/visual/${nextTopic.id}`} aria-label={`${t("visual.nextTopic")}: ${tx(nextTopic.title)}`}>
            {tx(nextTopic.title)} →
          </a>
        )}
      </nav>
    </>
  );
}

/** CodeBlock with the executing line marked (CodeBlock itself only marks lines the user selects). */
function HighlightedCode({ topic, line }: { topic: VTopic; line: number | null }) {
  const { tx } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const lines = ref.current?.querySelectorAll<HTMLElement>(".code-line") ?? [];
    lines.forEach((el, i) => {
      const on = line !== null && i === line - 1;
      if (on) {
        el.setAttribute("data-current", "");
        el.setAttribute("aria-current", "step");
      } else {
        el.removeAttribute("data-current");
        el.removeAttribute("aria-current");
      }
    });
  }, [line, topic]);
  return (
    <div ref={ref} className="vis-codeblock">
      <CodeBlock code={topic.code.src} lang={topic.code.lang} label={tx(topic.title)} />
    </div>
  );
}

function Output({ lines }: { lines: string[] }) {
  const { t } = useI18n();
  return (
    <div className="vis-output">
      <h3 className="vis-h">{t("visual.output")}</h3>
      <pre aria-label={t("visual.output")}>{lines.length ? lines.join("\n") : " "}</pre>
    </div>
  );
}

function Scene({ step }: { step: VStep }) {
  const { t } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  const paths = useArrowPaths(stageRef, step);
  return (
    <figure className="vis-figure">
      <div className="vis-stage" ref={stageRef} role="group" aria-label={t("visual.diagram")}>
        <div className="vis-panels">
          {step.panels.map((p) => (
            <PanelView key={p.id} panel={p} />
          ))}
        </div>
        {paths.length > 0 && (
          <svg className="vis-arrows" aria-hidden="true" focusable="false">
            <defs>
              <marker id="vis-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="vis-arrowhead" />
              </marker>
            </defs>
            {paths.map((p) => (
              <path key={p.key} d={p.d} className="vis-arrow" markerEnd="url(#vis-arrowhead)" />
            ))}
          </svg>
        )}
      </div>
      <figcaption>
        <details className="small">
          <summary>{t("visual.textAlt")}</summary>
          <SceneText step={step} />
        </details>
      </figcaption>
    </figure>
  );
}

function PanelView({ panel }: { panel: VPanel }) {
  const { t } = useI18n();
  const txt = useTxt();
  const layout = panel.layout ?? "column";
  // Stacks are listed top-first, so both the picture and the reading order start at the top.
  const items = layout === "stack" ? [...panel.items].reverse() : panel.items;
  return (
    <section className="vis-panel" data-layout={layout} data-vid={panel.id} aria-label={txt(panel.title)}>
      <h3 className="vis-panel-title">{txt(panel.title)}</h3>
      {layout === "stack" && items.length > 0 && <span className="vis-hint">↑ {t("visual.stackTop")}</span>}
      {items.length === 0 ? (
        <p className="vis-empty">{t("visual.empty")}</p>
      ) : (
        <ul className="vis-items">
          {items.map((it, i) => (
            <ItemView key={it.id ?? `${txt(it.label)}-${i}`} item={it} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ItemView({ item }: { item: VItem }) {
  const { t } = useI18n();
  const txt = useTxt();
  return (
    <li className="vis-item" data-tone={item.tone} data-vid={item.id}>
      {item.tag && <span className="vis-tag">{txt(item.tag)}</span>}
      <span className="vis-label">{txt(item.label)}</span>
      {item.value !== undefined && <span className="vis-value">{txt(item.value)}</span>}
      {item.tone === "accent" && <span className="sr-only"> ({t("visual.focus")})</span>}
    </li>
  );
}

/** Text alternative: every panel with its items, plus the arrows as "from → to". */
function SceneText({ step }: { step: VStep }) {
  const { t } = useI18n();
  const txt = useTxt();
  const fmt = (it: VItem) => [txt(it.tag) && `[${txt(it.tag)}]`, txt(it.label), it.value !== undefined && `= ${txt(it.value)}`].filter(Boolean).join(" ");
  const name = (id: string) => {
    for (const p of step.panels) {
      if (p.id === id) return txt(p.title);
      const it = p.items.find((x) => x.id === id);
      if (it) return `${txt(it.label)} (${txt(p.title)})`;
    }
    return id;
  };
  return (
    <ul className="vis-text">
      {step.panels.map((p) => (
        <li key={p.id}>
          <strong>{txt(p.title)}:</strong> {p.items.length ? p.items.map(fmt).join("; ") : t("visual.empty")}
        </li>
      ))}
      {step.arrows && step.arrows.length > 0 && (
        <li>
          <strong>{t("visual.links")}:</strong> {step.arrows.map((a) => `${name(a.from)} → ${name(a.to)}`).join("; ")}
        </li>
      )}
    </ul>
  );
}

interface ArrowPath {
  key: string;
  d: string;
}

/** Measures the rendered boxes and draws a curve between each arrow's ends. */
function useArrowPaths(stageRef: RefObject<HTMLDivElement | null>, step: VStep): ArrowPath[] {
  const [paths, setPaths] = useState<ArrowPath[]>([]);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const arrows: VArrow[] = step.arrows ?? [];
    if (!stage || arrows.length === 0) {
      setPaths([]);
      return;
    }
    const compute = () => {
      const base = stage.getBoundingClientRect();
      const find = (id: string) => stage.querySelector<HTMLElement>(`[data-vid="${id}"]`);
      const out: ArrowPath[] = [];
      for (const a of arrows) {
        const f = find(a.from);
        const to = find(a.to);
        if (!f || !to) continue;
        const r1 = f.getBoundingClientRect();
        const r2 = to.getBoundingClientRect();
        const rel = (r: DOMRect) => ({ l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top });
        const A = rel(r1);
        const B = rel(r2);
        const cyA = (A.t + A.b) / 2;
        const cyB = (B.t + B.b) / 2;
        let d: string;
        if (B.l >= A.r - 2) {
          const dx = Math.max(24, (B.l - A.r) / 2);
          d = `M${A.r} ${cyA} C${A.r + dx} ${cyA} ${B.l - dx} ${cyB} ${B.l} ${cyB}`;
        } else if (B.r <= A.l + 2) {
          const dx = Math.max(24, (A.l - B.r) / 2);
          d = `M${A.l} ${cyA} C${A.l - dx} ${cyA} ${B.r + dx} ${cyB} ${B.r} ${cyB}`;
        } else {
          const cxA = (A.l + A.r) / 2;
          const cxB = (B.l + B.r) / 2;
          const down = B.t >= A.b;
          const y1 = down ? A.b : A.t;
          const y2 = down ? B.t : B.b;
          const dy = Math.max(16, Math.abs(y2 - y1) / 2) * (down ? 1 : -1);
          d = `M${cxA} ${y1} C${cxA} ${y1 + dy} ${cxB} ${y2 - dy} ${cxB} ${y2}`;
        }
        out.push({ key: `${a.from}-${a.to}`, d });
      }
      setPaths(out);
    };
    compute();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(compute);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [stageRef, step]);
  return paths;
}
