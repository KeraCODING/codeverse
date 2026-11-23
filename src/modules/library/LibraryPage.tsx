import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { navigate, useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useCollection } from "../../core/storage/useCollection";
import { LESSON_INDEX, findLessonMeta } from "../../content";
import type { CodeLang } from "../../content/types";
import { useContent } from "../../content/useContent";
import { normalize } from "../../knowledge/search";
import { SNIPPET_LANGS, cleanTags, newSnippet, validateSnippet, type Snippet } from "../../personal/models";
import { CodeBlock } from "../../ui/CodeBlock";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import { ImportExport } from "../../ui/ImportExport";
import { Markdown } from "../../ui/Markdown";

const CodeEditor = lazy(() => import("../../ui/editor/CodeEditor"));
const EDITOR_LANGS = new Set(["javascript", "typescript", "python", "sql"]);
const HIGHLIGHT: Partial<Record<string, CodeLang>> = { javascript: "javascript", typescript: "typescript", python: "python", sql: "sql", java: "java", csharp: "csharp", cpp: "cpp", go: "go" };
const SORTS = ["updated", "title", "lang"] as const;

export default function LibraryPage() {
  const { t } = useI18n();
  const [selId] = useRouteParams();
  const { items, ready, save, remove, importMany } = useCollection<Snippet>("snippets");
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("updated");

  // #/library/new?lesson=<id> — creates a snippet linked to a lesson.
  const created = useRef(false);
  useEffect(() => {
    if (!ready || selId !== "new" || created.current) return;
    created.current = true;
    const lessonId = new URLSearchParams(location.hash.split("?")[1] ?? "").get("lesson");
    const meta = lessonId ? findLessonMeta(lessonId) : undefined;
    const s = newSnippet({ lessonId: meta?.id ?? null, lang: meta?.language === "python" ? "python" : meta?.language === "sql" ? "sql" : "javascript" });
    void save(s).then(() => navigate(`library/${s.id}`));
  }, [ready, selId, save]);

  const query = normalize(q);
  const list = items
    .filter((s) => (!lang || s.lang === lang) && (!favOnly || s.favorite) && (!query || normalize(`${s.title} ${s.description} ${s.code} ${s.tags.join(" ")}`).includes(query)))
    .sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : sort === "lang" ? a.lang.localeCompare(b.lang) || b.updatedAt - a.updatedAt : b.updatedAt - a.updatedAt));
  const selected = items.find((s) => s.id === selId) ?? null;

  return (
    <section className="page wide" aria-labelledby="page-title">
      <header className="page-head row between wrap">
        <div>
          <h1 id="page-title">{t("module.library.title")}</h1>
          <p className="muted">{t("library.intro")}</p>
        </div>
        <button type="button" className="btn primary" onClick={() => void save(newSnippet()).then((s) => navigate(`library/${s.id}`))}>+ {t("library.new")}</button>
      </header>

      <div className="split">
        <aside className="card split-list" aria-label={t("library.list")}>
          <input type="search" className="search-input" placeholder={t("content.filter")} aria-label={t("content.filter")} value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="row wrap small">
            <select aria-label={t("explain.language")} value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="">{t("library.allLangs")}</option>
              {SNIPPET_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select aria-label={t("library.sort")} value={sort} onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}>
              {SORTS.map((s) => <option key={s} value={s}>{t(`library.sort.${s}`)}</option>)}
            </select>
            <label className="row"><input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} /> ★</label>
          </div>
          {!ready ? (
            <p className="muted">{t("common.loading")}</p>
          ) : list.length === 0 ? (
            <p className="muted small">{items.length === 0 ? t("library.empty") : t("content.noMatches")}</p>
          ) : (
            <ul className="item-list">
              {list.map((s) => (
                <li key={s.id}>
                  <a href={`#/library/${s.id}`} aria-current={s.id === selId ? "true" : undefined}>
                    <span className="item-title">{s.favorite ? "★ " : ""}{s.title || t("library.untitled")}</span>
                    <span className="small">{s.lang}{s.tags.length ? ` · #${s.tags.join(" #")}` : ""}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <ImportExport format="codeverse.snippets" filename="codeverse-snippets" items={items} validate={validateSnippet} onImport={(xs) => importMany(xs, false)} />
        </aside>
        <div className="split-main">
          {selected ? (
            <SnippetEditor key={selected.id} snippet={selected} onSave={save} onDelete={async () => { await remove(selected.id); navigate("library"); }} />
          ) : (
            <div className="card"><p className="muted">{items.length ? t("library.pick") : t("library.empty")}</p></div>
          )}
        </div>
      </div>
    </section>
  );
}

function SnippetEditor({ snippet, onSave, onDelete }: { snippet: Snippet; onSave: (s: Snippet) => Promise<Snippet>; onDelete: () => Promise<void> }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const [d, setD] = useState(snippet);
  const [saved, setSaved] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(d);
  latest.current = d;

  const change = (patch: Partial<Snippet>) => {
    setD((x) => ({ ...x, ...patch }));
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void onSave(latest.current).then(() => setSaved(true)), 700);
  };
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
        void onSave(latest.current);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const explain = () => {
    try {
      sessionStorage.setItem("cv.explain.handoff", JSON.stringify({ code: d.code, lang: d.lang === "typescript" ? "javascript" : d.lang }));
    } catch {
      /* ignore */
    }
    location.hash = "#/explain";
  };
  const lesson = d.lessonId ? findLessonMeta(d.lessonId) : undefined;

  return (
    <article className="card note-editor">
      <div className="row between wrap">
        <input className="title-input" value={d.title} placeholder={t("library.untitled")} aria-label={t("notes.titleLabel")} onChange={(e) => change({ title: e.target.value })} />
        <span className="small" role="status">{saved ? t("notes.saved") : t("notes.saving")}</span>
      </div>
      <input className="search-input full" value={d.description} placeholder={t("library.description")} aria-label={t("library.description")} onChange={(e) => change({ description: e.target.value.slice(0, 2000) })} />
      <div className="row wrap small">
        <label className="row">
          {t("explain.language")}
          <select value={d.lang} onChange={(e) => change({ lang: e.target.value })}>
            {SNIPPET_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label className="row">
          {t("notes.tags")}
          <input defaultValue={d.tags.join(", ")} placeholder="array, loop" onBlur={(e) => change({ tags: cleanTags(e.target.value) })} />
        </label>
        <label className="row">
          {t("notes.lesson")}
          <select value={d.lessonId ?? ""} onChange={(e) => change({ lessonId: e.target.value || null })}>
            <option value="">—</option>
            {LESSON_INDEX.map((l) => <option key={l.id} value={l.id}>{tx(l.title)}</option>)}
          </select>
        </label>
        {lesson && <a href={`#/languages/${lesson.language}/${lesson.id}`}>{t("notes.openLesson")} →</a>}
        <button type="button" className="icon-btn star" aria-pressed={d.favorite} aria-label={t("search.favorite")} onClick={() => change({ favorite: !d.favorite })}>{d.favorite ? "★" : "☆"}</button>
      </div>

      {EDITOR_LANGS.has(d.lang) ? (
        <Suspense fallback={<CodeBlock code={d.code || " "} lang={HIGHLIGHT[d.lang] ?? "plain"} />}>
          <CodeEditor key={d.lang} value={d.code} onChange={(code) => change({ code })} lang={d.lang === "typescript" ? "javascript" : (d.lang as "javascript" | "python" | "sql")} label={t("lab.editorLabel")} minLines={8} />
        </Suspense>
      ) : (
        <textarea className="code-input" rows={12} spellCheck={false} value={d.code} aria-label={t("lab.editorLabel")} onChange={(e) => change({ code: e.target.value })} />
      )}

      <h3>{t("library.explanation")}</h3>
      <textarea className="code-input note-body" rows={5} value={d.explanation} placeholder={t("library.explanationPlaceholder")} onChange={(e) => change({ explanation: e.target.value })} />
      {d.explanation.trim() && <Markdown text={d.explanation} />}

      <div className="row wrap">
        <button type="button" className="btn" onClick={() => void navigator.clipboard?.writeText(d.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}>
          {copied ? `✓ ${t("library.copied")}` : t("lab.copy")}
        </button>
        {["javascript", "typescript", "python", "sql"].includes(d.lang) && <button type="button" className="btn" onClick={explain}>{t("lab.explain")}</button>}
        <button type="button" className="btn danger" onClick={() => setConfirm(true)}>{t("common.delete")}</button>
      </div>
      <ConfirmDialog
        open={confirm}
        title={t("library.deleteTitle")}
        body={t("notes.deleteBody")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        danger
        onConfirm={() => {
          if (timer.current) clearTimeout(timer.current);
          timer.current = null;
          void onDelete();
        }}
        onClose={() => setConfirm(false)}
      />
    </article>
  );
}
