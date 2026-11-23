import { useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { RUNTIMES, type RunnableLang } from "../../runtime";
import { SAMPLE_DB_TABLES } from "../../runtime/sampleDb";
import { RunPanel } from "../../ui/editor/RunPanel";

const STARTERS: Record<RunnableLang, string> = {
  javascript: '// Write JavaScript and press Run (Ctrl+Enter)\nconst names = ["Aysel", "Murad", "Leyla"];\nfor (const name of names) {\n  console.log(`Salam, ${name}!`);\n}\n',
  sql: "-- Practice database: users, orders\nSELECT u.name, o.product, o.amount\nFROM orders o\nJOIN users u ON u.id = o.user_id\nORDER BY o.amount DESC;\n",
};

/** Hands code to Smart Code Explanation (same device, session storage only). */
function explainLink(code: string, lang: RunnableLang) {
  try {
    sessionStorage.setItem("cv.explain.handoff", JSON.stringify({ code, lang }));
  } catch {
    /* ignore */
  }
  location.hash = "#/explain";
}

export default function CodeLabPage() {
  const { t } = useI18n();
  const [lang, setLang] = useState<RunnableLang>("javascript");

  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.codelab.title")}</h1>
        <p className="muted">{t("lab.intro")}</p>
      </header>

      <div className="row wrap">
        <label className="row">
          <span>{t("explain.language")}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as RunnableLang)}>
            <option value="javascript">JavaScript</option>
            <option value="sql">SQL (SQLite)</option>
          </select>
        </label>
        {lang === "sql" && (
          <span className="small">
            {t("lab.sampleDb")}: {SAMPLE_DB_TABLES.map((x) => `${x.name}(${x.columns})`).join(", ")}
          </span>
        )}
      </div>

      <RunPanel
        key={lang}
        lang={lang}
        initial={STARTERS[lang]}
        draftKey={`lab.${lang}`}
        minLines={12}
        extraActions={(code) => (
          <button type="button" className="btn" onClick={() => explainLink(code, lang)}>
            {t("lab.explain")}
          </button>
        )}
      />

      <article className="card">
        <h2>{t("lab.runtimes")}</h2>
        <ul className="list">
          {RUNTIMES.map((r) => (
            <li key={r.lang}>
              <span>{t(`lab.rt.${r.lang}`)}</span>
              <span className={`badge ${r.available ? "state-completed" : ""}`}>{r.available ? t("lab.available") : t("lab.notAvailable")}</span>
            </li>
          ))}
        </ul>
        <h3>{t("lab.safety")}</h3>
        <p className="small">{t("lab.safetyText")}</p>
      </article>
    </section>
  );
}
