import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useContent } from "../../content/useContent";
import { navigate, useRouteParams } from "../../app/router";
import { Rich } from "../../ui/CodeBlock";
import type { L } from "../../content/types";
import { headId, reachableSet, run, type GitState, type RepoData } from "./engine";
import { layoutGraph, NODE_R, type GraphRefs, type LabelKind } from "./graph";
import { FREE_SETUP, SCENARIOS, findScenario, startState, type Scenario } from "./scenarios";
import "./gitviz.css";

const DONE_KEY = "cv.gitviz.done";

function readDone(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(DONE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function saveDone(ids: string[]) {
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable: progress is only kept for this visit */
  }
}

function localRefs(s: GitState): GraphRefs {
  const labels: GraphRefs["labels"] = {};
  const add = (id: string, text: string, kind: LabelKind) => (labels[id] ??= []).push({ text, kind });
  const h = headId(s);
  if (s.head.kind === "detached") add(s.head.id, "HEAD", "head");
  for (const b of Object.keys(s.branches).sort()) {
    const attached = s.head.kind === "branch" && s.head.name === b;
    add(s.branches[b], attached ? `HEAD → ${b}` : b, attached ? "head" : "branch");
  }
  for (const b of Object.keys(s.tracking).sort()) add(s.tracking[b], `origin/${b}`, "remote");
  for (const t of Object.keys(s.tags).sort()) add(s.tags[t], `tag: ${t}`, "tag");
  for (const id of Object.keys(labels)) labels[id].sort((a, b) => (a.kind === "head" ? -1 : b.kind === "head" ? 1 : 0));
  return { labels, headId: h, reachable: reachableSet(s) };
}

function serverRefs(r: RepoData): GraphRefs {
  const labels: GraphRefs["labels"] = {};
  const reachable = new Set<string>();
  const add = (id: string, text: string, kind: LabelKind) => (labels[id] ??= []).push({ text, kind });
  for (const b of Object.keys(r.branches).sort()) add(r.branches[b], b, "branch");
  for (const t of Object.keys(r.tags).sort()) add(r.tags[t], `tag: ${t}`, "tag");
  for (const id of [...Object.values(r.branches), ...Object.values(r.tags)]) {
    const stack = [id];
    while (stack.length) {
      const c = stack.pop()!;
      if (reachable.has(c) || !r.commits[c]) continue;
      reachable.add(c);
      stack.push(...r.commits[c].parents);
    }
  }
  return { labels, headId: null, reachable };
}

function Graph({ repo, refs, label, emptyText }: { repo: RepoData; refs: GraphRefs; label: string; emptyText: string }) {
  const { t } = useI18n();
  const g = useMemo(() => layoutGraph(repo, refs), [repo, refs]);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [repo.order.length]);

  if (!repo.order.length) return (
      <p className="small gv-empty">
        <Rich text={emptyText} />
      </p>
    );

  const desc = t("gitviz.graphDesc", { commits: repo.order.length, branches: Object.keys(repo.branches).length });
  return (
    <div className="gv-graph-scroll" ref={scroller} tabIndex={0} aria-label={label}>
      <svg className="gv-graph" width={g.width} height={g.height} viewBox={`0 0 ${g.width} ${g.height}`} role="img" aria-label={`${label}. ${desc}`}>
        {g.lanes.map((l) => (
          <g key={l.name}>
            <line className="gv-lane" x1={88} x2={g.width} y1={l.y} y2={l.y} />
            <text className="gv-lane-name" x={8} y={l.y + 4}>
              {l.name.length > 12 ? `${l.name.slice(0, 11)}…` : l.name}
            </text>
          </g>
        ))}
        {g.edges.map((e) => (
          <path key={e.key} className="gv-edge" data-faded={e.faded || undefined} d={e.d} />
        ))}
        {g.nodes.map((n) => (
          <g key={n.id} className="gv-node" data-faded={!n.reachable || undefined} data-head={n.isHead || undefined} style={{ transform: `translate(${n.x}px, ${n.y}px)` }}>
            <title>{`${n.id}: ${n.commit.message}`}</title>
            <circle r={NODE_R} data-merge={n.commit.parents.length > 1 || undefined} />
            <text className="gv-node-id" y={3.5}>
              {n.id}
            </text>
            {n.labels.map((l, i) => (
              <g key={l.text} className="gv-label" data-kind={l.kind} transform={`translate(${-l.width / 2}, ${NODE_R + 6 + i * 21})`}>
                <rect width={l.width} height={18} rx={4} />
                <text x={l.width / 2} y={12.5}>
                  {l.text}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Accessible text alternative for the graph. */
function GraphText({ s }: { s: GitState }) {
  const { t } = useI18n();
  const refs = localRefs(s);
  const ids = [...s.order].reverse();
  return (
    <details className="gv-alt">
      <summary>{t("gitviz.textAlt")}</summary>
      <p className="small">
        {s.head.kind === "branch" ? t("gitviz.headOnBranch", { branch: s.head.name }) : t("gitviz.headDetached", { id: s.head.id })}
      </p>
      {ids.length ? (
        <ul className="gv-alt-list">
          {ids.map((id) => {
            const c = s.commits[id];
            const ls = (refs.labels[id] ?? []).map((l) => l.text);
            return (
              <li key={id}>
                <strong>{id}</strong> “{c.message}” —{" "}
                {c.parents.length ? t("gitviz.parents", { list: c.parents.join(", ") }) : t("gitviz.root")}
                {ls.length ? ` — ${t("gitviz.pointedBy", { list: ls.join(", ") })}` : ""}
                {!refs.reachable.has(id) ? ` — ${t("gitviz.unreachable")}` : ""}
                {c.copyOf ? ` — ${t("gitviz.copyOf", { id: c.copyOf })}` : ""}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="small">{t("gitviz.noCommits")}</p>
      )}
    </details>
  );
}

interface Entry {
  n: number;
  cmd: string;
  output: string[];
  ok: boolean;
}

function Sandbox({ setup, scenario, onComplete, onReset }: { setup: string[]; scenario?: Scenario; onComplete: (id: string) => void; onReset: () => void }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const [state, setState] = useState<GitState>(() => startState(setup));
  const [log, setLog] = useState<Entry[]>([]);
  const [explain, setExplain] = useState<{ text: L; ok: boolean } | null>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  const completed = scenario ? scenario.check(state) : false;
  useEffect(() => {
    if (completed && scenario) onComplete(scenario.id);
  }, [completed, scenario, onComplete]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const exec = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const r = run(state, cmd);
    setState(r.state);
    setHistory((h) => (h[h.length - 1] === cmd ? h : [...h, cmd].slice(-100)));
    setHistPos(null);
    setInput("");
    if (r.clear) {
      setLog([]);
      setExplain(null);
      return;
    }
    setLog((l) => [...l, { n: counter.current++, cmd, output: r.output, ok: r.ok }].slice(-200));
    setExplain(r.explain.az || r.explain.en ? { text: r.explain, ok: r.ok } : null);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      if (!history.length) return;
      e.preventDefault();
      const p = histPos === null ? history.length - 1 : Math.max(0, histPos - 1);
      setHistPos(p);
      setInput(history[p]);
    } else if (e.key === "ArrowDown") {
      if (histPos === null) return;
      e.preventDefault();
      const p = histPos + 1;
      if (p >= history.length) {
        setHistPos(null);
        setInput("");
      } else {
        setHistPos(p);
        setInput(history[p]);
      }
    }
  };

  const insert = (cmd: string) => {
    setInput(cmd);
    inputRef.current?.focus();
  };

  const localGraphRefs = useMemo(() => localRefs(state), [state]);
  const serverGraphRefs = useMemo(() => serverRefs(state.server), [state.server]);
  const showServer = state.server.order.length > 0 || !!state.remoteUrl;

  return (
    <div className="gv-layout">
      <div className="gv-main">
        <article className="card gv-card" aria-labelledby="gv-graph-title">
          <div className="row between wrap">
            <h2 id="gv-graph-title">{t("gitviz.localRepo")}</h2>
            <span className="small">
              {state.initialized
                ? state.head.kind === "branch"
                  ? t("gitviz.headOnBranch", { branch: state.head.name })
                  : t("gitviz.headDetached", { id: state.head.id })
                : <Rich text={t("gitviz.notInitialized")} />}
            </span>
          </div>
          <Graph repo={state} refs={localGraphRefs} label={t("gitviz.localRepo")} emptyText={state.initialized ? t("gitviz.noCommits") : t("gitviz.notInitialized")} />
          <div className="row wrap gv-work small">
            <span>{t("gitviz.workingTree")}:</span>
            {state.merge && <span className="badge state-attempted">{t("gitviz.merging")}</span>}
            {state.staged.length > 0 && <span className="badge state-started">{t("gitviz.staged", { list: state.staged.join(", ") })}</span>}
            {state.modified.length > 0 && <span className="badge warn-badge">{t("gitviz.modified", { list: state.modified.join(", ") })}</span>}
            {!state.merge && !state.staged.length && !state.modified.length && <span>{t("gitviz.clean")}</span>}
          </div>
          <GraphText s={state} />
        </article>

        {showServer && (
          <article className="card gv-card" aria-labelledby="gv-server-title">
            <div className="row between wrap">
              <h2 id="gv-server-title">{t("gitviz.server")}</h2>
              <span className="small">{state.remoteUrl ?? t("gitviz.noRemote")}</span>
            </div>
            <Graph repo={state.server} refs={serverGraphRefs} label={t("gitviz.server")} emptyText={t("gitviz.serverEmpty")} />
          </article>
        )}

        <article className="card gv-card" aria-labelledby="gv-term-title">
          <div className="row between wrap">
            <h2 id="gv-term-title">{t("gitviz.terminal")}</h2>
            <button type="button" className="btn" onClick={onReset}>
              {t("gitviz.reset")}
            </button>
          </div>
          <div className="gv-log" ref={logRef} role="log" aria-label={t("gitviz.output")}>
            {log.length === 0 && (
              <p className="small">
                <Rich text={t("gitviz.logEmpty")} />
              </p>
            )}
            {log.map((e) => (
              <div key={e.n} className="gv-entry" data-ok={e.ok}>
                <div className="gv-cmd">
                  <span aria-hidden="true">$ </span>
                  {e.cmd}
                </div>
                {e.output.length > 0 && <pre className="gv-out">{e.output.join("\n")}</pre>}
              </div>
            ))}
          </div>
          <form
            className="gv-prompt"
            onSubmit={(e) => {
              e.preventDefault();
              exec(input);
            }}
          >
            <span className="gv-dollar" aria-hidden="true">
              $
            </span>
            <input
              ref={inputRef}
              className="code-input gv-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setHistPos(null);
              }}
              onKeyDown={onKey}
              aria-label={t("gitviz.inputLabel")}
              placeholder={t("gitviz.placeholder")}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button type="submit" className="btn primary">
              {t("gitviz.run")}
            </button>
          </form>
          <p className="small">{t("gitviz.inputHint")}</p>
        </article>
      </div>

      <aside className="gv-side">
        <section className="card gv-card" aria-labelledby="gv-explain-title">
          <h2 id="gv-explain-title">{t("gitviz.explanation")}</h2>
          <div aria-live="polite" className={`gv-explain ${explain ? (explain.ok ? "" : "gv-explain-err") : ""}`}>
            {explain ? (
              <p>
                <Rich text={tx(explain.text)} />
              </p>
            ) : (
              <p className="small">{t("gitviz.explainEmpty")}</p>
            )}
          </div>
        </section>

        {scenario ? (
          <section className="card gv-card" aria-labelledby="gv-scn-title">
            <h2 id="gv-scn-title">{tx(scenario.title)}</h2>
            <h3>{t("gitviz.goal")}</h3>
            <p>
              <Rich text={tx(scenario.goal)} />
            </p>
            <div aria-live="polite">
              {completed ? (
                <div className="banner ok">
                  <span>
                    <strong>{t("gitviz.completed")}</strong> <Rich text={tx(scenario.done)} />
                  </span>
                </div>
              ) : (
                <p className="small">{t("gitviz.notYet")}</p>
              )}
            </div>
            <h3>{t("gitviz.steps")}</h3>
            <ol className="gv-steps">
              {scenario.steps.map((st, i) => (
                <li key={i}>
                  <span>
                    <Rich text={tx(st.text)} />
                  </span>
                  {st.cmd && (
                    <span className="row gv-step-cmd">
                      <code>{st.cmd}</code>
                      <button type="button" className="link" onClick={() => insert(st.cmd!)} aria-label={t("gitviz.insertCmd", { cmd: st.cmd })}>
                        {t("gitviz.insert")}
                      </button>
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {scenario.concept && (
              <>
                <h3>{t("gitviz.concept")}</h3>
                <p>
                  <Rich text={tx(scenario.concept)} />
                </p>
              </>
            )}
          </section>
        ) : (
          <section className="card gv-card" aria-labelledby="gv-free-title">
            <h2 id="gv-free-title">{t("gitviz.modeFree")}</h2>
            <p>
              <Rich text={t("gitviz.freeIntro")} />
            </p>
            <ul className="gv-steps">
              {["git status", 'git commit -m "Try it"', "git switch -c experiment", "git merge experiment", 'sim teammate "Remote change"', "git pull", "help"].map((c) => (
                <li key={c}>
                  <span className="row gv-step-cmd">
                    <code>{c}</code>
                    <button type="button" className="link" onClick={() => insert(c)} aria-label={t("gitviz.insertCmd", { cmd: c })}>
                      {t("gitviz.insert")}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}

export default function GitVizPage() {
  const { t } = useI18n();
  const { tx } = useContent();
  const params = useRouteParams();
  const free = params[0] === "free";
  const scenario = free ? undefined : (findScenario(params[0]) ?? SCENARIOS[0]);
  const [nonce, setNonce] = useState(0);
  const [done, setDone] = useState<string[]>(readDone);

  const onComplete = useMemo(
    () => (id: string) =>
      setDone((d) => {
        if (d.includes(id)) return d;
        const next = [...d, id];
        saveDone(next);
        return next;
      }),
    [],
  );

  const modeKey = free ? "free" : scenario!.id;

  return (
    <section className="page gv-page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("gitviz.title")}</h1>
        <p className="muted">{t("gitviz.intro")}</p>
      </header>
      <div className="banner">
        <span className="small">{t("gitviz.safe")}</span>
      </div>

      <div className="tabs" role="tablist" aria-label={t("gitviz.mode")}>
        <button type="button" role="tab" className="tab" aria-selected={!free} onClick={() => navigate(`gitviz/${scenario?.id ?? SCENARIOS[0].id}`)}>
          {t("gitviz.modeScenarios")}
        </button>
        <button type="button" role="tab" className="tab" aria-selected={free} onClick={() => navigate("gitviz/free")}>
          {t("gitviz.modeFree")}
        </button>
      </div>

      {!free && (
        <nav aria-label={t("gitviz.scenarioList")}>
          <ol className="gv-scn-list">
            {SCENARIOS.map((s, i) => (
              <li key={s.id}>
                <button type="button" className="btn gv-scn-btn" aria-current={s.id === scenario!.id ? "step" : undefined} onClick={() => navigate(`gitviz/${s.id}`)}>
                  <span className="gv-scn-num">{i + 1}</span> {tx(s.title)}
                  {done.includes(s.id) && (
                    <span className="badge state-completed" title={t("gitviz.completed")}>
                      ✓<span className="sr-only"> {t("gitviz.completed")}</span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <Sandbox key={`${modeKey}:${nonce}`} setup={scenario ? scenario.setup : FREE_SETUP} scenario={scenario} onComplete={onComplete} onReset={() => setNonce((n) => n + 1)} />
    </section>
  );
}
