import { useState } from "react";
import { navigate, useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { newId } from "../../core/storage/types";
import { useCollection } from "../../core/storage/useCollection";
import { findLessonMeta } from "../../content";
import { PROJECT_GUIDES, type ProjectGuide } from "../../content/projectGuides";
import { useContent } from "../../content/useContent";
import { cleanTags, newProject, validateProject, type Note, type Project, type ProjectStatus } from "../../personal/models";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import { ImportExport } from "../../ui/ImportExport";
import { Markdown } from "../../ui/Markdown";

const STATUSES: ProjectStatus[] = ["idea", "active", "paused", "done"];

export default function ProjectsPage() {
  const [a, b] = useRouteParams();
  const col = useCollection<Project>("projects");
  const { t } = useI18n();
  if (!col.ready) return <div className="loading">{t("common.loading")}</div>;
  if (a === "guide" && b) {
    const g = PROJECT_GUIDES.find((x) => x.id === b);
    if (g) return <GuideView guide={g} onStart={async () => {
      const p = await col.save(newProject({ name: g.title.az ?? g.title.en ?? g.id, guideId: g.id, tech: g.tech, status: "active", tasks: g.milestones.map((m) => ({ id: newId(), text: m.az ?? m.en ?? "", done: false })) }));
      navigate(`projects/${p.id}`);
    }} />;
  }
  const project = col.items.find((p) => p.id === a);
  if (project) return <ProjectView key={project.id} project={project} save={col.save} remove={col.remove} />;
  return <Overview {...col} />;
}

function Overview({ items, save, importMany }: ReturnType<typeof useCollection<Project>>) {
  const { t, formatDateTime } = useI18n();
  const { tx } = useContent();
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const list = items.filter((p) => !status || p.status === status);
  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head row between wrap">
        <div>
          <h1 id="page-title">{t("module.projects.title")}</h1>
          <p className="muted">{t("projects.intro")}</p>
        </div>
        <button type="button" className="btn primary" onClick={() => void save(newProject()).then((p) => navigate(`projects/${p.id}`))}>+ {t("projects.new")}</button>
      </header>

      <article className="card">
        <div className="row between wrap">
          <h2>{t("projects.mine", { n: items.length })}</h2>
          <select aria-label={t("projects.status")} value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus | "")}>
            <option value="">{t("projects.allStatuses")}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{t(`projects.st.${s}`)}</option>)}
          </select>
        </div>
        {list.length === 0 ? (
          <p className="muted small">{items.length === 0 ? t("projects.empty") : t("content.noMatches")}</p>
        ) : (
          <ul className="results">
            {list.map((p) => {
              const done = p.tasks.filter((x) => x.done).length;
              return (
                <li key={p.id} className="result">
                  <a href={`#/projects/${p.id}`}>
                    <span className="row wrap">
                      <span className="result-title">{p.name || t("projects.untitled")}</span>
                      <span className={`badge st-${p.status}`}>{t(`projects.st.${p.status}`)}</span>
                      {p.tasks.length > 0 && <span className="small">{done}/{p.tasks.length}</span>}
                    </span>
                    <span className="result-sub">{p.tech.join(", ")}{p.tech.length ? " · " : ""}{formatDateTime(p.updatedAt)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        <ImportExport format="codeverse.projects" filename="codeverse-projects" items={items} validate={validateProject} onImport={(xs) => importMany(xs, false)} />
      </article>

      <h2 className="group-title">{t("projects.guides")}</h2>
      <p className="small">{t("projects.guidesHelp")}</p>
      <div className="tile-grid">
        {PROJECT_GUIDES.map((g) => (
          <a key={g.id} className="tile" href={`#/projects/guide/${g.id}`}>
            <span className="tile-title">{tx(g.title)}</span>
            <span className="tile-desc">{tx(g.description)}</span>
            <span className="small">{t(`projects.level.${g.level}`)} · {g.tech.join(", ")}</span>
          </a>
        ))}
      </div>
      <p className="small">{t("projects.localNote")}</p>
    </section>
  );
}

function GuideView({ guide, onStart }: { guide: ProjectGuide; onStart: () => Promise<void> }) {
  const { t } = useI18n();
  const { tx } = useContent();
  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/projects">{t("module.projects.title")}</a> <span aria-hidden="true">/</span> <span>{tx(guide.title)}</span>
      </nav>
      <header className="page-head row between wrap">
        <div>
          <h1 id="page-title">{tx(guide.title)}</h1>
          <p className="muted">{tx(guide.description)}</p>
          <p className="small">{t(`projects.level.${guide.level}`)} · {guide.tech.join(", ")}</p>
        </div>
        <button type="button" className="btn primary" onClick={() => void onStart()}>{t("projects.startGuide")}</button>
      </header>
      <div className="grid two">
        <article className="card">
          <h2>{t("projects.objectives")}</h2>
          <ul>{guide.objectives.map((o, i) => <li key={i}><Rich text={tx(o)} /></li>)}</ul>
          {guide.prerequisites.length > 0 && (
            <>
              <h3>{t("projects.prerequisites")}</h3>
              <ul className="chips">
                {guide.prerequisites.map((id) => {
                  const m = findLessonMeta(id);
                  return m ? <li key={id}><a href={`#/languages/${m.language}/${id}`}>{tx(m.title)}</a></li> : null;
                })}
              </ul>
            </>
          )}
        </article>
        <article className="card">
          <h2>{t("projects.milestones")}</h2>
          <ol>{guide.milestones.map((m, i) => <li key={i}><Rich text={tx(m)} /></li>)}</ol>
        </article>
      </div>
      <div className="grid two">
        <article className="card">
          <h2>{t("projects.testing")}</h2>
          <ul>{guide.testing.map((x, i) => <li key={i}><Rich text={tx(x)} /></li>)}</ul>
          <h3>{t("projects.evaluation")}</h3>
          <ul>{guide.evaluation.map((x, i) => <li key={i}>☐ <Rich text={tx(x)} /></li>)}</ul>
        </article>
        <article className="card">
          <h2>{t("projects.starterFiles")}</h2>
          {guide.starter.map((f) => (
            <div key={f.name}>
              <span className="small">{f.name}</span>
              <CodeBlock code={f.code} lang={f.name.endsWith(".js") ? "javascript" : f.name.endsWith(".py") ? "python" : f.name.endsWith(".sql") ? "sql" : "plain"} />
              <button type="button" className="btn" onClick={() => void navigator.clipboard?.writeText(f.code)}>{t("lab.copy")}</button>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

function ProjectView({ project, save, remove }: { project: Project; save: (p: Project) => Promise<Project>; remove: (id: string) => Promise<void> }) {
  const { t, formatDateTime } = useI18n();
  const { tx } = useContent();
  const notes = useCollection<Note>("notes");
  const [p, setP] = useState(project);
  const [task, setTask] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const guide = p.guideId ? PROJECT_GUIDES.find((g) => g.id === p.guideId) : undefined;

  const commit = (next: Project, event?: string) => {
    const withHistory = event ? { ...next, history: [...next.history, { at: Date.now(), text: event }].slice(-200) } : next;
    setP(withHistory);
    void save(withHistory);
  };
  const linkedNotes = notes.items.filter((n) => n.projectId === p.id);
  const done = p.tasks.filter((x) => x.done).length;

  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/projects">{t("module.projects.title")}</a> <span aria-hidden="true">/</span> <span>{p.name || t("projects.untitled")}</span>
      </nav>
      <article className="card">
        <input id="page-title" className="title-input" value={p.name} placeholder={t("projects.untitled")} aria-label={t("projects.name")} onChange={(e) => setP({ ...p, name: e.target.value.slice(0, 200) })} onBlur={() => commit(p)} />
        <textarea className="code-input note-body" rows={2} value={p.description} placeholder={t("projects.description")} aria-label={t("projects.description")} onChange={(e) => setP({ ...p, description: e.target.value.slice(0, 5000) })} onBlur={() => commit(p)} />
        <div className="form-grid">
          <label>
            {t("projects.status")}
            <select value={p.status} onChange={(e) => commit({ ...p, status: e.target.value as ProjectStatus }, `status:${e.target.value}`)}>
              {STATUSES.map((s) => <option key={s} value={s}>{t(`projects.st.${s}`)}</option>)}
            </select>
          </label>
          <label>
            {t("projects.tech")}
            <input defaultValue={p.tech.join(", ")} placeholder="JavaScript, SQLite" onBlur={(e) => commit({ ...p, tech: e.target.value.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 30) })} />
          </label>
          <label>
            {t("notes.tags")}
            <input defaultValue={p.tags.join(", ")} onBlur={(e) => commit({ ...p, tags: cleanTags(e.target.value) })} />
          </label>
          <label>
            {t("projects.repo")}
            <input type="url" defaultValue={p.repoUrl} placeholder="https://github.com/…" onBlur={(e) => { const v = e.target.value.trim(); if (!v || /^https:\/\//.test(v)) commit({ ...p, repoUrl: v }); }} />
          </label>
        </div>
        {p.repoUrl && <a className="small" href={p.repoUrl} target="_blank" rel="noreferrer noopener">{t("projects.openRepo")} ↗</a>}
        {guide && <p className="small">{t("projects.fromGuide")}: <a href={`#/projects/guide/${guide.id}`}>{tx(guide.title)}</a></p>}
      </article>

      <article className="card">
        <h2>{t("projects.tasks")} <span className="small">({done}/{p.tasks.length})</span></h2>
        <ul className="task-list">
          {p.tasks.map((x) => (
            <li key={x.id}>
              <label className="row">
                <input type="checkbox" checked={x.done} onChange={() => commit({ ...p, tasks: p.tasks.map((y) => (y.id === x.id ? { ...y, done: !y.done } : y)) }, x.done ? undefined : `done:${x.text.slice(0, 60)}`)} />
                <span className={x.done ? "muted" : ""}><Rich text={x.text} /></span>
              </label>
              <button type="button" className="link small" onClick={() => commit({ ...p, tasks: p.tasks.filter((y) => y.id !== x.id) })}>{t("common.delete")}</button>
            </li>
          ))}
        </ul>
        <form className="row wrap" onSubmit={(e) => { e.preventDefault(); const text = task.trim().slice(0, 500); if (!text) return; commit({ ...p, tasks: [...p.tasks, { id: newId(), text, done: false }] }); setTask(""); }}>
          <input className="search-input" value={task} placeholder={t("projects.addTaskPh")} aria-label={t("projects.addTask")} onChange={(e) => setTask(e.target.value)} />
          <button type="submit" className="btn" disabled={!task.trim()}>{t("projects.addTask")}</button>
        </form>
      </article>

      <article className="card">
        <div className="row between">
          <h2>{t("projects.notes")}</h2>
          <button type="button" className="btn" onClick={() => { if (editNotes) commit(p); setEditNotes(!editNotes); }}>{editNotes ? t("projects.doneEditing") : t("projects.edit")}</button>
        </div>
        {editNotes ? (
          <textarea className="code-input note-body" rows={10} value={p.notes} onChange={(e) => setP({ ...p, notes: e.target.value })} />
        ) : p.notes.trim() ? <Markdown text={p.notes} /> : <p className="muted small">{t("projects.noNotes")}</p>}
        <h3>{t("projects.linkedNotes")}</h3>
        {linkedNotes.length > 0 ? (
          <ul className="chips">{linkedNotes.map((n) => <li key={n.id}><a href={`#/notes/${n.id}`}>{n.title || t("notes.untitled")}</a></li>)}</ul>
        ) : <p className="muted small">{t("projects.noLinkedNotes")}</p>}
        <a className="link small" href={`#/notes/new?project=${p.id}`}>+ {t("projects.newNote")}</a>
      </article>

      <article className="card">
        <h2>{t("projects.history")}</h2>
        <ul className="list">
          {[...p.history].reverse().slice(0, 30).map((h, i) => (
            <li key={i}>
              <span>{historyText(h.text, t)}</span>
              <time className="small">{formatDateTime(h.at)}</time>
            </li>
          ))}
        </ul>
        <button type="button" className="btn danger" onClick={() => setConfirm(true)}>{t("projects.delete")}</button>
      </article>

      <ConfirmDialog open={confirm} title={t("projects.delete")} body={t("projects.deleteBody")} confirmLabel={t("common.delete")} cancelLabel={t("common.cancel")} danger
        onConfirm={() => void remove(p.id).then(() => navigate("projects"))} onClose={() => setConfirm(false)} />
    </section>
  );
}

function historyText(text: string, t: (k: string, v?: Record<string, string | number>) => string) {
  if (text === "created") return t("projects.h.created");
  if (text.startsWith("status:")) return t("projects.h.status", { status: t(`projects.st.${text.slice(7)}`) });
  if (text.startsWith("done:")) return t("projects.h.done", { task: text.slice(5) });
  return text;
}
