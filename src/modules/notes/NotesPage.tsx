import { useEffect, useMemo, useRef, useState } from "react";
import { navigate, useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { downloadText, useCollection } from "../../core/storage/useCollection";
import { LESSON_INDEX, findLessonMeta } from "../../content";
import { useContent } from "../../content/useContent";
import { normalize } from "../../knowledge/search";
import { cleanTags, newNote, validateNote, type Note, type Project } from "../../personal/models";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import { ImportExport } from "../../ui/ImportExport";
import { Markdown } from "../../ui/Markdown";

export default function NotesPage() {
  const { t, formatDateTime } = useI18n();
  const { tx } = useContent();
  const [selId] = useRouteParams();
  const { items, ready, save, remove, importMany } = useCollection<Note>("notes");
  const projects = useCollection<Project>("projects");
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("");
  const [tag, setTag] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  // #/notes/new?lesson=<id>&project=<id> creates a linked note once.
  const created = useRef(false);
  useEffect(() => {
    if (!ready || selId !== "new" || created.current) return;
    created.current = true;
    const params = new URLSearchParams(location.hash.split("?")[1] ?? "");
    const lessonId = params.get("lesson");
    const projectId = params.get("project");
    const lesson = lessonId ? findLessonMeta(lessonId) : undefined;
    const n = newNote({ lessonId: lesson ? lesson.id : null, projectId, title: lesson ? tx(lesson.title) : "" });
    void save(n).then(() => navigate(`notes/${n.id}`));
  }, [ready, selId, save, tx]);

  const folders = useMemo(() => [...new Set(items.map((n) => n.folder).filter(Boolean))].sort(), [items]);
  const tags = useMemo(() => [...new Set(items.flatMap((n) => n.tags))].sort(), [items]);
  const query = normalize(q);
  const list = items.filter(
    (n) =>
      (!folder || n.folder === folder) &&
      (!tag || n.tags.includes(tag)) &&
      (!favOnly || n.favorite) &&
      (!query || normalize(`${n.title} ${n.body} ${n.tags.join(" ")}`).includes(query)),
  );
  const selected = items.find((n) => n.id === selId) ?? null;

  const createNote = async () => {
    const n = await save(newNote({ folder }));
    navigate(`notes/${n.id}`);
  };

  return (
    <section className="page wide" aria-labelledby="page-title">
      <header className="page-head row between wrap">
        <div>
          <h1 id="page-title">{t("module.notes.title")}</h1>
          <p className="muted">{t("notes.intro")}</p>
        </div>
        <button type="button" className="btn primary" onClick={() => void createNote()}>+ {t("notes.new")}</button>
      </header>

      <div className="split">
        <aside className="card split-list" aria-label={t("notes.list")}>
          <input type="search" className="search-input" placeholder={t("content.filter")} aria-label={t("content.filter")} value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="row wrap small">
            <select aria-label={t("notes.folder")} value={folder} onChange={(e) => setFolder(e.target.value)}>
              <option value="">{t("notes.allFolders")}</option>
              {folders.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select aria-label={t("notes.tag")} value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">{t("notes.allTags")}</option>
              {tags.map((x) => <option key={x} value={x}>#{x}</option>)}
            </select>
            <label className="row"><input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} /> ★</label>
          </div>
          {!ready ? (
            <p className="muted">{t("common.loading")}</p>
          ) : list.length === 0 ? (
            <p className="muted small">{items.length === 0 ? t("notes.empty") : t("content.noMatches")}</p>
          ) : (
            <ul className="item-list">
              {list.map((n) => (
                <li key={n.id}>
                  <a href={`#/notes/${n.id}`} aria-current={n.id === selId ? "true" : undefined}>
                    <span className="item-title">{n.favorite ? "★ " : ""}{n.title || t("notes.untitled")}</span>
                    <span className="small">{n.folder ? `${n.folder} · ` : ""}{formatDateTime(n.updatedAt)}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <ImportExport
            format="codeverse.notes"
            filename="codeverse-notes"
            items={items}
            validate={validateNote}
            onImport={(xs) => importMany(xs, false)}
          />
        </aside>

        <div className="split-main">
          {selected ? (
            <NoteEditor key={selected.id} note={selected} onSave={save} onDelete={async () => { await remove(selected.id); navigate("notes"); }} projects={projects.items} folders={folders} />
          ) : (
            <div className="card"><p className="muted">{items.length ? t("notes.pick") : t("notes.empty")}</p></div>
          )}
        </div>
      </div>
    </section>
  );
}

function NoteEditor({ note, onSave, onDelete, projects, folders }: { note: Note; onSave: (n: Note) => Promise<Note>; onDelete: () => Promise<void>; projects: Project[]; folders: string[] }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const [draft, setDraft] = useState(note);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(draft);
  latest.current = draft;

  // Automatic saving: 700 ms after the last change, and when leaving the note.
  const change = (patch: Partial<Note>) => {
    setDraft((d) => ({ ...d, ...patch }));
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

  const lesson = draft.lessonId ? findLessonMeta(draft.lessonId) : undefined;
  return (
    <article className="card note-editor">
      <div className="row between wrap">
        <input className="title-input" value={draft.title} placeholder={t("notes.untitled")} aria-label={t("notes.titleLabel")} onChange={(e) => change({ title: e.target.value })} />
        <span className="small" role="status">{saved ? t("notes.saved") : t("notes.saving")}</span>
      </div>
      <div className="row wrap small">
        <label className="row">
          {t("notes.folder")}
          <input list="note-folders" value={draft.folder} onChange={(e) => change({ folder: e.target.value.slice(0, 100) })} />
          <datalist id="note-folders">{folders.map((f) => <option key={f} value={f} />)}</datalist>
        </label>
        <label className="row">
          {t("notes.tags")}
          <input defaultValue={draft.tags.join(", ")} placeholder="python, loops" onBlur={(e) => change({ tags: cleanTags(e.target.value) })} />
        </label>
        <button type="button" className="icon-btn star" aria-pressed={draft.favorite} aria-label={t("search.favorite")} onClick={() => change({ favorite: !draft.favorite })}>
          {draft.favorite ? "★" : "☆"}
        </button>
      </div>
      <div className="row wrap small">
        <label className="row">
          {t("notes.lesson")}
          <select value={draft.lessonId ?? ""} onChange={(e) => change({ lessonId: e.target.value || null })}>
            <option value="">—</option>
            {LESSON_INDEX.map((l) => <option key={l.id} value={l.id}>{tx(l.title)}</option>)}
          </select>
        </label>
        {lesson && <a href={`#/languages/${lesson.language}/${lesson.id}`}>{t("notes.openLesson")} →</a>}
        <label className="row">
          {t("notes.project")}
          <select value={draft.projectId ?? ""} onChange={(e) => change({ projectId: e.target.value || null })}>
            <option value="">—</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name || t("projects.untitled")}</option>)}
          </select>
        </label>
      </div>

      <div className="tabs" role="tablist">
        <button type="button" role="tab" className="tab" aria-selected={!preview} onClick={() => setPreview(false)}>{t("notes.write")}</button>
        <button type="button" role="tab" className="tab" aria-selected={preview} onClick={() => setPreview(true)}>{t("notes.preview")}</button>
      </div>
      {preview ? (
        <Markdown text={draft.body || t("notes.emptyBody")} />
      ) : (
        <textarea
          className="code-input note-body"
          rows={16}
          value={draft.body}
          placeholder={t("notes.bodyPlaceholder")}
          aria-label={t("notes.bodyLabel")}
          onChange={(e) => change({ body: e.target.value })}
        />
      )}
      <p className="small">{t("notes.markdownHelp")}</p>
      <div className="row wrap">
        <button type="button" className="btn" onClick={() => downloadText(`${(draft.title || "note").replace(/[^\w\-ə ]+/gi, "_")}.md`, `# ${draft.title}\n\n${draft.body}\n`, "text/markdown")}>
          {t("notes.exportMd")}
        </button>
        <button type="button" className="btn danger" onClick={() => setConfirm(true)}>{t("common.delete")}</button>
      </div>
      <ConfirmDialog
        open={confirm}
        title={t("notes.deleteTitle")}
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
