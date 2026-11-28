import { useMemo, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useProgress } from "../../core/progress/ProgressContext";
import { LESSON_INDEX } from "../../content";
import { LANGUAGES } from "../../content/catalog/languages";
import type { Level, LessonMeta } from "../../content/types";
import { useContent } from "../../content/useContent";
import { normalize } from "../../knowledge/normalize";
import { Icon } from "../../ui/Icon";

const LEVELS: Level[] = ["absolute", "beginner", "intermediate", "advanced", "professional"];
type Status = "all" | "new" | "inProgress" | "completed";

/** Every lesson in one place: search, filter by language / level / status, see progress. */
export default function LessonsPage() {
  const { t } = useI18n();
  const { tx } = useContent();
  const { records } = useProgress();
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("all");
  const [level, setLevel] = useState<Level | "all">("all");
  const [status, setStatus] = useState<Status>("all");

  const langs = useMemo(() => LANGUAGES.filter((l) => LESSON_INDEX.some((x) => x.language === l.id)), []);
  const stateOf = (l: LessonMeta) => records.get(l.id)?.state;
  const statusOf = (l: LessonMeta): Exclude<Status, "all"> => {
    const s = stateOf(l);
    return s === "completed" ? "completed" : s ? "inProgress" : "new";
  };

  const q = normalize(query);
  const shown = LESSON_INDEX.filter((l) => {
    if (lang !== "all" && l.language !== lang) return false;
    if (level !== "all" && l.level !== level) return false;
    if (status !== "all" && statusOf(l) !== status) return false;
    if (!q) return true;
    const name = langs.find((x) => x.id === l.language)?.name ?? "";
    return normalize(Object.values(l.title).join(" ") + " " + name).includes(q);
  });

  const done = LESSON_INDEX.filter((l) => stateOf(l) === "completed").length;
  const filtered = query || lang !== "all" || level !== "all" || status !== "all";
  const reset = () => {
    setQuery("");
    setLang("all");
    setLevel("all");
    setStatus("all");
  };

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.lessons.title")}</h1>
        <p className="muted">{t("lessons.intro", { n: LESSON_INDEX.length, langs: langs.length, done })}</p>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={LESSON_INDEX.length} aria-valuenow={done} aria-label={t("lessons.overall")}>
          <span style={{ width: `${Math.round((done / LESSON_INDEX.length) * 100)}%` }} />
        </div>
      </header>

      <div className="lesson-filters">
        <input
          type="search"
          className="search-input big"
          placeholder={t("lessons.search")}
          aria-label={t("lessons.search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select aria-label={t("lessons.language")} value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="all">{t("lessons.allLanguages")}</option>
          {langs.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <select aria-label={t("lessons.level")} value={level} onChange={(e) => setLevel(e.target.value as Level | "all")}>
          <option value="all">{t("lessons.allLevels")}</option>
          {LEVELS.filter((lv) => LESSON_INDEX.some((l) => l.level === lv)).map((lv) => (
            <option key={lv} value={lv}>{t(`learning.level.${lv}`)}</option>
          ))}
        </select>
        <div className="seg" role="radiogroup" aria-label={t("lessons.status")}>
          {(["all", "new", "inProgress", "completed"] as Status[]).map((s) => (
            <button key={s} type="button" role="radio" aria-checked={status === s} className="seg-btn" onClick={() => setStatus(s)}>
              {t(`lessons.status.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card">
          <p>{t("lessons.none")}</p>
          <div className="row wrap">
            {filtered && <button type="button" className="btn" onClick={reset}>{t("lessons.reset")}</button>}
            {query && <a className="btn" href={`#/search?q=${encodeURIComponent(query)}`}><Icon name="search" /> {t("lessons.searchEverywhere", { q: query })}</a>}
          </div>
        </div>
      ) : (
        langs
          .filter((l) => shown.some((x) => x.language === l.id))
          .map((l) => {
            const all = LESSON_INDEX.filter((x) => x.language === l.id);
            const list = shown.filter((x) => x.language === l.id).sort((a, b) => a.order - b.order);
            const finished = all.filter((x) => stateOf(x) === "completed").length;
            return (
              <article key={l.id} className="card lesson-group">
                <header className="row between wrap">
                  <h2><a href={`#/languages/${l.id}`}>{l.name}</a></h2>
                  <span className="path-meter small">
                    {finished}/{all.length}
                    <span className="bar"><span style={{ width: `${Math.round((finished / all.length) * 100)}%` }} /></span>
                  </span>
                </header>
                <ol className="lesson-rows">
                  {list.map((x) => {
                    const st = statusOf(x);
                    return (
                      <li key={x.id}>
                        <a href={`#/languages/${x.language}/${x.id}`} className="lesson-row">
                          <span className={`lesson-dot ${st}`} aria-hidden="true">{st === "completed" ? <Icon name="check" size={14} /> : x.order}</span>
                          <span className="lesson-row-title">{tx(x.title)}</span>
                          <span className="badge">{t(`learning.level.${x.level}`)}</span>
                          <span className={`badge state-${stateOf(x) ?? "new"}`}>{t(`progress.state.${stateOf(x) ?? "new"}`)}</span>
                          <Icon name="arrow" size={16} />
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </article>
            );
          })
      )}
      <p className="small">{t("lessons.more")}</p>
    </section>
  );
}
