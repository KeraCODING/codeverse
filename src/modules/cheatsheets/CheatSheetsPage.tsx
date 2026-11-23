import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useSettings } from "../../core/settings/SettingsContext";
import { useContent } from "../../content/useContent";
import { CHEATSHEETS, cheatKey, findCheatSheet, normalizeText, searchCheats, type CheatSheet } from "../../content/cheatsheets";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import "./cheatsheets.css";

const MAX_RESULTS = 50;

export default function CheatSheetsPage() {
  const [sheetId, sectionId] = useRouteParams();
  const { t } = useI18n();
  const sheet = findCheatSheet(sheetId);
  const bookmarks = useBookmarks();
  if (sheetId && !sheet)
    return (
      <section className="page">
        <p>{t("content.notFound")}</p>
        <a className="btn" href="#/cheatsheets">{t("content.backToList")}</a>
      </section>
    );
  return sheet ? <SheetDetail sheet={sheet} sectionId={sectionId} bookmarks={bookmarks} /> : <SheetList bookmarks={bookmarks} />;
}

interface Bookmarks {
  keys: Set<string>;
  loaded: boolean;
  toggle: (key: string) => void;
}

/** Bookmarked sections, stored as favorites with keys "cheat:<sheetId>:<sectionId>". */
function useBookmarks(): Bookmarks {
  const { storage } = useSettings();
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    storage
      .getFavorites()
      .then((all) => alive && setKeys(new Set(all.filter((k) => k.startsWith("cheat:")))))
      .catch(() => undefined)
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, [storage]);
  const toggle = useCallback(
    (key: string) => {
      const on = !keys.has(key);
      const apply = (add: boolean) =>
        setKeys((cur) => {
          const next = new Set(cur);
          if (add) next.add(key);
          else next.delete(key);
          return next;
        });
      apply(on);
      storage.setFavorite(key, on).catch(() => apply(!on));
    },
    [keys, storage],
  );
  return { keys, loaded, toggle };
}

function SheetList({ bookmarks }: { bookmarks: Bookmarks }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const [q, setQ] = useState("");
  const hits = useMemo(() => searchCheats(q), [q]);
  const searching = q.trim().length > 0;
  const entryCount = (s: CheatSheet) => s.sections.reduce((n, sec) => n + sec.entries.length, 0);

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("cheatsheets.title")}</h1>
        <p className="muted">{t("cheatsheets.intro", { n: CHEATSHEETS.length })}</p>
      </header>
      <input
        type="search"
        className="search-input big"
        placeholder={t("cheatsheets.searchPlaceholder")}
        aria-label={t("cheatsheets.searchLabel")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {searching ? (
        <div className="cs-results">
          <p className="small" role="status">
            {hits.length > MAX_RESULTS
              ? t("cheatsheets.resultsCapped", { shown: MAX_RESULTS, n: hits.length })
              : t("cheatsheets.results", { n: hits.length })}
          </p>
          {hits.length === 0 && <p className="muted">{t("content.noMatches")}</p>}
          {hits.slice(0, MAX_RESULTS).map((h, i) => (
            <article key={i} className="card cs-entry">
              <a className="small" href={`#/cheatsheets/${h.sheet.id}/${h.section.id}`}>
                {h.sheet.name} / {tx(h.section.title)}
              </a>
              <CodeBlock code={h.entry.code} lang={h.sheet.lang} label={h.sheet.name} />
              <p className="cs-note"><Rich text={tx(h.entry.note)} /></p>
            </article>
          ))}
        </div>
      ) : (
        <div className="tile-grid">
          {CHEATSHEETS.map((s) => {
            const marked = s.sections.filter((sec) => bookmarks.keys.has(cheatKey(s.id, sec.id))).length;
            return (
              <a key={s.id} className="tile" href={`#/cheatsheets/${s.id}`}>
                <span className="tile-title">{s.name}</span>
                <span className="tile-desc">{tx(s.desc)}</span>
                <span className="small">{t("cheatsheets.sheetStats", { sections: s.sections.length, entries: entryCount(s) })}</span>
                {marked > 0 && <span className="small">★ {t("cheatsheets.bookmarkedCount", { n: marked })}</span>}
              </a>
            );
          })}
        </div>
      )}
      <p className="small">{t("cheatsheets.offlineNote")}</p>
    </section>
  );
}

function SheetDetail({ sheet, sectionId, bookmarks }: { sheet: CheatSheet; sectionId?: string; bookmarks: Bookmarks }) {
  const { t } = useI18n();
  const { tx, preferred } = useContent();
  const [q, setQ] = useState("");
  const [onlyMarked, setOnlyMarked] = useState(false);

  const words = normalizeText(q).split(" ").filter(Boolean);
  const sections = sheet.sections
    .filter((sec) => !onlyMarked || bookmarks.keys.has(cheatKey(sheet.id, sec.id)))
    .map((sec) => {
      if (words.length === 0) return sec;
      const titleHay = normalizeText(Object.values(sec.title).join(" "));
      const entries = sec.entries.filter((en) => {
        const hay = `${titleHay} ${normalizeText(`${en.code} ${Object.values(en.note).join(" ")}`)}`;
        return words.every((w) => hay.includes(w));
      });
      return { ...sec, entries };
    })
    .filter((sec) => sec.entries.length > 0);

  const needsFallback = sheet.sections.some((sec) => sec.entries.some((en) => !en.note[preferred]));

  // Section links (#/cheatsheets/<sheet>/<section>) scroll to and focus the section heading.
  useEffect(() => {
    if (!sectionId) return;
    const el = document.getElementById(`cs-${sectionId}`);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    el.focus({ preventScroll: true });
  }, [sectionId, sheet.id]);

  return (
    <section className="page" aria-labelledby="page-title">
      <nav className="crumbs" aria-label={t("content.breadcrumb")}>
        <a href="#/cheatsheets">{t("cheatsheets.title")}</a> <span aria-hidden="true">/</span> <span>{sheet.name}</span>
      </nav>
      <header className="page-head">
        <h1 id="page-title">{sheet.name}</h1>
        <p className="muted">{tx(sheet.desc)}</p>
        <p className="small">
          <a href={sheet.docs.url} target="_blank" rel="noopener noreferrer">
            {t("content.officialDocs")}: {sheet.docs.title}
          </a>
        </p>
      </header>

      <nav className="toc" aria-label={t("cheatsheets.toc")}>
        {sheet.sections.map((sec) => (
          <a key={sec.id} href={`#/cheatsheets/${sheet.id}/${sec.id}`}>
            {bookmarks.keys.has(cheatKey(sheet.id, sec.id)) && <span aria-hidden="true">★ </span>}
            {tx(sec.title)}
          </a>
        ))}
      </nav>

      <div className="row wrap">
        <input
          type="search"
          className="search-input"
          placeholder={t("content.filter")}
          aria-label={t("cheatsheets.filterSheet", { name: sheet.name })}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="button" className="btn" aria-pressed={onlyMarked} onClick={() => setOnlyMarked((v) => !v)}>
          {onlyMarked ? "★" : "☆"} {t("cheatsheets.bookmarkedOnly")}
        </button>
      </div>
      {needsFallback && <p className="small">{t("cheatsheets.fallbackNote")}</p>}

      {sections.length === 0 && (
        <p className="muted">{onlyMarked && bookmarks.loaded && words.length === 0 ? t("cheatsheets.noBookmarks") : t("content.noMatches")}</p>
      )}

      {sections.map((sec) => {
        const key = cheatKey(sheet.id, sec.id);
        const marked = bookmarks.keys.has(key);
        const title = tx(sec.title);
        return (
          <article key={sec.id} className="card cs-section" aria-labelledby={`cs-${sec.id}`}>
            <div className="row between">
              <h2 id={`cs-${sec.id}`} tabIndex={-1}>{title}</h2>
              <button
                type="button"
                className="icon-btn cs-mark"
                aria-pressed={marked}
                aria-label={t(marked ? "cheatsheets.bookmarkRemove" : "cheatsheets.bookmarkAdd", { name: title })}
                title={t(marked ? "cheatsheets.bookmarkRemove" : "cheatsheets.bookmarkAdd", { name: title })}
                onClick={() => bookmarks.toggle(key)}
              >
                <span aria-hidden="true">{marked ? "★" : "☆"}</span>
              </button>
            </div>
            {sec.entries.map((en, i) => (
              <div key={i} className="cs-entry">
                <CodeBlock code={en.code} lang={sheet.lang} label={`${sheet.name}: ${title}`} />
                <p className="cs-note"><Rich text={tx(en.note)} /></p>
              </div>
            ))}
          </article>
        );
      })}
    </section>
  );
}
