import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useSettings } from "../../core/settings/SettingsContext";
import { useContent } from "../../content/useContent";
import { TERMS } from "../../knowledge/keywords";
import { getIndex, normalize, related, search, type DocType, type SearchDoc } from "../../knowledge/search";
import { TermCard } from "./TermCard";

const TYPES: (DocType | "all")[] = ["all", "term", "lesson", "language", "error", "comparison", "technology", "field"];

function useSearchStore() {
  const { storage, settings } = useSettings();
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  useEffect(() => {
    void storage.recentSearches(8).then(setRecent);
    void storage.getFavorites().then((f) => setFavorites(new Set(f)));
  }, [storage]);
  const remember = useCallback(
    (q: string) => {
      const query = q.trim();
      if (!query || !settings.saveSearchHistory) return;
      void storage.addSearch(query.slice(0, 200)).then(() => storage.recentSearches(8).then(setRecent));
    },
    [storage, settings.saveSearchHistory],
  );
  const toggleFavorite = useCallback(
    (key: string) => {
      const on = !favorites.has(key);
      setFavorites((s) => {
        const n = new Set(s);
        if (on) n.add(key);
        else n.delete(key);
        return n;
      });
      void storage.setFavorite(key, on);
    },
    [favorites, storage],
  );
  const clearRecent = useCallback(() => void storage.clearSearches().then(() => setRecent([])), [storage]);
  return { recent, favorites, remember, toggleFavorite, clearRecent };
}

export default function SearchPage() {
  const [sub, id] = useRouteParams();
  if (sub === "term" && id) return <TermPage id={id} />;
  return <SearchMain />;
}

function SearchMain() {
  const { t } = useI18n();
  const { tx } = useContent();
  const [query, setQuery] = useState(() => new URLSearchParams(location.hash.split("?")[1] ?? "").get("q") ?? "");
  const [type, setType] = useState<DocType | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const store = useSearchStore();

  useEffect(() => inputRef.current?.focus(), []);

  const hits = useMemo(() => search(query, { type, limit: 40 }), [query, type]);
  const q = normalize(query);
  // Contextual cards: every knowledge-base entry whose token or alias equals the query (e.g. "async").
  const contextual = useMemo(
    () => (q ? TERMS.filter((x) => normalize(x.token) === q || x.aliases?.some((a) => normalize(a) === q)).slice(0, 4) : []),
    [q],
  );
  const favDocs = useMemo(() => getIndex().filter((d) => store.favorites.has(d.key)), [store.favorites]);

  const title = (d: SearchDoc) => (typeof d.title === "string" ? d.title : tx(d.title));
  const subtitle = (d: SearchDoc) => (d.subtitle ? (typeof d.subtitle === "string" ? d.subtitle : tx(d.subtitle)) : "");

  const ResultRow = ({ d, fuzzy }: { d: SearchDoc; fuzzy?: boolean }) => (
    <li className="result">
      <a href={d.href} onClick={() => store.remember(query)}>
        <span className="row wrap">
          <span className={`badge type-${d.type}`}>{t(`search.type.${d.type}`)}</span>
          <span className="result-title">{title(d)}</span>
          {fuzzy && <span className="small">{t("search.similar")}</span>}
        </span>
        {subtitle(d) && <span className="result-sub">{subtitle(d).replace(/`/g, "")}</span>}
      </a>
      <button
        type="button"
        className="icon-btn star"
        aria-pressed={store.favorites.has(d.key)}
        aria-label={store.favorites.has(d.key) ? t("search.unfavorite") : t("search.favorite")}
        title={store.favorites.has(d.key) ? t("search.unfavorite") : t("search.favorite")}
        onClick={() => store.toggleFavorite(d.key)}
      >
        {store.favorites.has(d.key) ? "★" : "☆"}
      </button>
    </li>
  );

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.search.title")}</h1>
        <p className="muted">{t("search.intro")}</p>
      </header>

      <form
        className="search-bar"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          store.remember(query);
        }}
      >
        <input
          ref={inputRef}
          type="search"
          className="search-input big"
          value={query}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select aria-label={t("search.category")} value={type} onChange={(e) => setType(e.target.value as DocType | "all")}>
          {TYPES.map((x) => (
            <option key={x} value={x}>{t(`search.type.${x}`)}</option>
          ))}
        </select>
      </form>
      <p className="small">{t("search.shortcut")}</p>

      {!q && (
        <div className="grid two">
          <article className="card">
            <div className="row between">
              <h2>{t("search.recent")}</h2>
              {store.recent.length > 0 && (
                <button type="button" className="link small" onClick={store.clearRecent}>{t("search.clearRecent")}</button>
              )}
            </div>
            {store.recent.length === 0 ? (
              <p className="muted small">{t("search.noRecent")}</p>
            ) : (
              <ul className="chips">
                {store.recent.map((r) => (
                  <li key={r}><button type="button" className="link" onClick={() => setQuery(r)}>{r}</button></li>
                ))}
              </ul>
            )}
            <h2 className="mt">{t("search.try")}</h2>
            <ul className="chips">
              {["async", "for", "===", "dəyişən", "NameError: name 'x' is not defined", "SELECT"].map((s) => (
                <li key={s}><button type="button" className="link" onClick={() => setQuery(s)}>{s}</button></li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>{t("search.favorites")}</h2>
            {favDocs.length === 0 ? (
              <p className="muted small">{t("search.noFavorites")}</p>
            ) : (
              <ul className="results">{favDocs.map((d) => <ResultRow key={d.key} d={d} />)}</ul>
            )}
          </article>
        </div>
      )}

      {q && contextual.length > 0 && (
        <div className="contextual">
          <h2 className="group-title">{t("search.meaning")}</h2>
          <div className="grid two">
            {contextual.map((term) => <TermCard key={term.id} term={term} compact />)}
          </div>
        </div>
      )}

      {q && (
        <div aria-live="polite">
          <h2 className="group-title">{t("search.results", { n: hits.length })}</h2>
          {hits.length === 0 ? (
            <p className="muted">{t("search.none")}</p>
          ) : (
            <ul className="results">{hits.map((h) => <ResultRow key={h.doc.key} d={h.doc} fuzzy={h.fuzzy} />)}</ul>
          )}
        </div>
      )}
    </section>
  );
}

function TermPage({ id }: { id: string }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const term = TERMS.find((x) => x.id === id);
  const doc = getIndex().find((d) => d.key === `term:${id}`);
  if (!term || !doc)
    return (
      <section className="page">
        <p>{t("content.notFound")}</p>
        <a className="btn" href="#/search">{t("content.backToList")}</a>
      </section>
    );
  const siblings = TERMS.filter((x) => x.id !== term.id && (normalize(x.token) === normalize(term.token) || x.aliases?.includes(term.token)));
  const rel = related(doc, 6).filter((d) => !siblings.some((s) => d.key === `term:${s.id}`));
  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/search">{t("module.search.title")}</a> <span aria-hidden="true">/</span> <span>{term.token}</span>
      </nav>
      <h1 id="page-title"><code>{term.token}</code></h1>
      <TermCard term={term} />
      {siblings.length > 0 && (
        <>
          <h2 className="group-title">{t("search.otherLanguages")}</h2>
          <div className="grid two">{siblings.map((s) => <TermCard key={s.id} term={s} compact />)}</div>
        </>
      )}
      {rel.length > 0 && (
        <article className="card">
          <h2>{t("search.related")}</h2>
          <ul className="list">
            {rel.map((d) => (
              <li key={d.key}>
                <a href={d.href}>{typeof d.title === "string" ? d.title : tx(d.title)}</a>
                <span className="small">{t(`search.type.${d.type}`)}</span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
