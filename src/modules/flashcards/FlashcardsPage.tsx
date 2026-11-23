import { useMemo, useState } from "react";
import { navigate, useRouteParams } from "../../app/router";
import { useI18n } from "../../core/i18n/i18n";
import { useCollection } from "../../core/storage/useCollection";
import { useContent } from "../../content/useContent";
import type { CodeLang } from "../../content/types";
import { TERMS } from "../../knowledge/keywords";
import { newCard, review, validateCard, type Flashcard, type Grade } from "../../personal/models";
import { CodeBlock, Rich } from "../../ui/CodeBlock";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import { ImportExport } from "../../ui/ImportExport";

const LANG_LABEL: Record<string, string> = { python: "Python", javascript: "JavaScript", sql: "SQL" };

/** Front/back text of a card. Knowledge-base cards follow the current lesson language. */
function useCardText() {
  const { tx, termLabel } = useContent();
  return (c: Flashcard) => {
    const term = c.termId ? TERMS.find((x) => x.id === c.termId) : undefined;
    if (!term) return { front: c.front, back: c.back, code: c.code, codeLang: "plain" as CodeLang };
    const ex = Object.entries(term.examples)[0];
    return {
      front: term.lang ? `${term.token} · ${LANG_LABEL[term.lang] ?? term.lang}` : termLabel({ en: term.token, local: {} }),
      back: tx(term.meaning),
      code: ex?.[1] ?? "",
      codeLang: (ex?.[0] ?? "plain") as CodeLang,
    };
  };
}

export default function FlashcardsPage() {
  const [sub] = useRouteParams();
  const cards = useCollection<Flashcard>("flashcards");
  const { t } = useI18n();
  // The review queue is built once, so wait until the cards have loaded.
  if ((sub === "review" || sub === "weak") && !cards.ready) return <div className="loading">{t("common.loading")}</div>;
  if (sub === "review") return <Review cards={cards.items} save={cards.save} weakOnly={false} />;
  if (sub === "weak") return <Review cards={cards.items} save={cards.save} weakOnly />;
  return <Overview {...cards} />;
}

function Overview({ items, ready, save, remove, importMany }: ReturnType<typeof useCollection<Flashcard>>) {
  const { t, formatDateTime } = useI18n();
  const text = useCardText();
  const [deck, setDeck] = useState("");
  const [form, setForm] = useState({ front: "", back: "", code: "", deck: "" });
  const [confirm, setConfirm] = useState<Flashcard | null>(null);
  const now = Date.now();
  const due = items.filter((c) => c.due <= now);
  const weak = items.filter((c) => c.lapses > 0);
  const decks = useMemo(() => [...new Set(items.map((c) => c.deck).filter(Boolean))].sort(), [items]);
  const reviews = items.reduce((a, c) => a + c.reviews, 0);
  const correct = items.reduce((a, c) => a + c.correct, 0);
  const learned = items.filter((c) => c.interval >= 21).length;
  const existingTerms = new Set(items.map((c) => c.termId).filter(Boolean));

  const addStarter = async (lang: CodeLang | null) => {
    const terms = TERMS.filter((x) => x.lang === lang && !existingTerms.has(x.id));
    const deckName = lang ? LANG_LABEL[lang] : t("flashcards.conceptsDeck");
    await importMany(terms.map((term) => newCard({ termId: term.id, deck: deckName, front: term.token, back: term.meaning.en ?? "" })), false);
  };

  const add = async () => {
    if (!form.front.trim() || !form.back.trim()) return;
    await save(newCard({ front: form.front.trim().slice(0, 2000), back: form.back.trim().slice(0, 5000), code: form.code.slice(0, 10_000), deck: form.deck.trim().slice(0, 100) }));
    setForm({ front: "", back: "", code: "", deck: form.deck });
  };

  const shown = items.filter((c) => !deck || c.deck === deck).sort((a, b) => a.due - b.due);

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.flashcards.title")}</h1>
        <p className="muted">{t("flashcards.intro")}</p>
      </header>

      <div className="grid">
        <article className="card">
          <h2>{t("flashcards.dueToday")}</h2>
          <p className="stat">{due.length}</p>
          <button type="button" className="btn primary" disabled={due.length === 0} onClick={() => navigate("flashcards/review")}>{t("flashcards.startReview")}</button>
        </article>
        <article className="card">
          <h2>{t("flashcards.weak")}</h2>
          <p className="stat">{weak.length}</p>
          <button type="button" className="btn" disabled={weak.length === 0} onClick={() => navigate("flashcards/weak")}>{t("flashcards.reviewWeak")}</button>
        </article>
        <article className="card">
          <h2>{t("flashcards.retention")}</h2>
          <p className="stat">{reviews ? `${Math.round((correct / reviews) * 100)}%` : "—"}</p>
          <p className="small">{t("flashcards.stats", { total: items.length, learned, reviews })}</p>
        </article>
      </div>

      {ready && items.length === 0 && (
        <div className="banner">{t("flashcards.emptyHelp")}</div>
      )}

      <article className="card">
        <h2>{t("flashcards.starterDecks")}</h2>
        <p className="small">{t("flashcards.starterHelp")}</p>
        <div className="row wrap">
          {(["python", "javascript", "sql", null] as (CodeLang | null)[]).map((l) => {
            const left = TERMS.filter((x) => x.lang === l && !existingTerms.has(x.id)).length;
            return (
              <button key={l ?? "concepts"} type="button" className="btn" disabled={left === 0} onClick={() => void addStarter(l)}>
                + {l ? LANG_LABEL[l] : t("flashcards.conceptsDeck")} ({left})
              </button>
            );
          })}
        </div>
      </article>

      <article className="card">
        <h2>{t("flashcards.newCard")}</h2>
        <div className="form-grid">
          <label>{t("flashcards.front")}<input value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} placeholder={t("flashcards.frontPh")} /></label>
          <label>{t("flashcards.deck")}<input list="fc-decks" value={form.deck} onChange={(e) => setForm({ ...form, deck: e.target.value })} /></label>
          <datalist id="fc-decks">{decks.map((d) => <option key={d} value={d} />)}</datalist>
          <label className="span2">{t("flashcards.back")}<textarea rows={3} value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} placeholder={t("flashcards.backPh")} /></label>
          <label className="span2">{t("flashcards.code")}<textarea className="code-input" rows={3} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></label>
        </div>
        <button type="button" className="btn primary" disabled={!form.front.trim() || !form.back.trim()} onClick={() => void add()}>{t("flashcards.add")}</button>
      </article>

      <article className="card">
        <div className="row between wrap">
          <h2>{t("flashcards.allCards", { n: items.length })}</h2>
          <select aria-label={t("flashcards.deck")} value={deck} onChange={(e) => setDeck(e.target.value)}>
            <option value="">{t("flashcards.allDecks")}</option>
            {decks.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {shown.length === 0 ? (
          <p className="muted small">{t("flashcards.none")}</p>
        ) : (
          <table className="parts">
            <thead>
              <tr><th scope="col">{t("flashcards.front")}</th><th scope="col">{t("flashcards.deck")}</th><th scope="col">{t("flashcards.nextReview")}</th><th scope="col"><span className="sr-only">{t("common.delete")}</span></th></tr>
            </thead>
            <tbody>
              {shown.slice(0, 200).map((c) => (
                <tr key={c.id}>
                  <td>{text(c).front}{c.lapses > 0 && <span className="badge state-attempted">{t("flashcards.weakBadge")}</span>}</td>
                  <td className="small">{c.deck}</td>
                  <td className="small">{c.due <= now ? t("flashcards.now") : formatDateTime(c.due)}</td>
                  <td><button type="button" className="link small" onClick={() => setConfirm(c)}>{t("common.delete")}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ImportExport format="codeverse.flashcards" filename="codeverse-flashcards" items={items} validate={validateCard} onImport={(xs) => importMany(xs, false)} />
      </article>

      <ConfirmDialog
        open={!!confirm}
        title={t("flashcards.deleteTitle")}
        body={confirm ? text(confirm).front : ""}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        danger
        onConfirm={() => confirm && void remove(confirm.id)}
        onClose={() => setConfirm(null)}
      />
    </section>
  );
}

function Review({ cards, save, weakOnly }: { cards: Flashcard[]; save: (c: Flashcard) => Promise<Flashcard>; weakOnly: boolean }) {
  const { t } = useI18n();
  const text = useCardText();
  // The queue is fixed when the session starts, so answered cards do not reappear mid-session.
  const [queue] = useState(() => {
    const now = Date.now();
    return cards.filter((c) => (weakOnly ? c.lapses > 0 : c.due <= now)).sort((a, b) => a.due - b.due).slice(0, 50).map((c) => c.id);
  });
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [right, setRight] = useState(0);
  const card = cards.find((c) => c.id === queue[pos]);

  if (queue.length === 0 || !card)
    return (
      <section className="page">
        <div className="card">
          <h2>{queue.length === 0 ? t("flashcards.nothingDue") : t("flashcards.sessionDone", { right, total: queue.length })}</h2>
          <a className="btn" href="#/flashcards">{t("content.backToList")}</a>
        </div>
      </section>
    );

  const c = text(card);
  const grade = async (g: Grade) => {
    await save(review(card, g));
    if (g !== "again") setRight((r) => r + 1);
    setRevealed(false);
    setPos((p) => p + 1);
  };

  return (
    <section className="page" aria-labelledby="page-title">
      <div className="row between">
        <h1 id="page-title">{weakOnly ? t("flashcards.reviewWeak") : t("flashcards.review")}</h1>
        <span className="small">{pos + 1} / {queue.length}</span>
      </div>
      <article className="card flashcard" aria-live="polite">
        <p className="fc-front"><Rich text={c.front} /></p>
        {revealed ? (
          <>
            <hr />
            <p><Rich text={c.back} /></p>
            {c.code && <CodeBlock code={c.code} lang={c.codeLang} />}
            <p className="small">{t("flashcards.howWell")}</p>
            <div className="row wrap">
              {(["again", "hard", "good", "easy"] as Grade[]).map((g) => (
                <button key={g} type="button" className={`btn ${g === "good" ? "primary" : ""}`} onClick={() => void grade(g)}>{t(`flashcards.grade.${g}`)}</button>
              ))}
            </div>
          </>
        ) : (
          <button type="button" className="btn primary" autoFocus onClick={() => setRevealed(true)}>{t("flashcards.showAnswer")}</button>
        )}
      </article>
      <a className="small" href="#/flashcards">{t("flashcards.endSession")}</a>
    </section>
  );
}
