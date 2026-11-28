import { useRef, useState } from "react";
import {
  ACCENTS,
  DENSITIES,
  HINT_MODES,
  LEARNING_MODES,
  LOCALES,
  SKILL_LEVELS,
  SOLUTION_MODES,
  START_PAGES,
  THEMES,
  buildSettingsExport,
  parseSettingsExport,
  type Settings,
} from "../../core/settings/schema";
import { useSettings } from "../../core/settings/SettingsContext";
import { useI18n } from "../../core/i18n/i18n";
import { RangeField, SelectField, TextField, ToggleField } from "../../ui/fields";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import { resetStudyTime } from "../../core/study/useStudy";

const LOCALE_NAMES: Record<string, string> = { az: "Azərbaycanca", tr: "Türkçe", en: "English", ru: "Русский" };

const SECTIONS = ["general", "appearance", "language", "learning", "editor", "privacy", "data", "performance", "planned", "about"] as const;

const PLANNED = ["ai", "ide", "notifications", "sync", "updates"];

export default function SettingsPage() {
  const { t } = useI18n();
  const { settings: s, update, replaceAll, resetToDefaults, storage } = useSettings();
  const [confirm, setConfirm] = useState<null | "reset" | "clearActivity">(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "warn" | "error"; key: string; vars?: Record<string, string | number> } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Settings>(k: K) => (v: Settings[K]) => void update({ [k]: v } as Partial<Settings>);
  const opts = <T extends string>(values: readonly T[], prefix: string) => values.map((v) => ({ value: v, label: t(`${prefix}.${v}`) }));
  const localeOpts = LOCALES.map((l) => ({ value: l, label: LOCALE_NAMES[l] }));

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(buildSettingsExport(s), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codeverse-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setNotice({ kind: "ok", key: "settings.data.exported" });
  };

  const importSettings = async (file: File) => {
    if (file.size > 64 * 1024) {
      setNotice({ kind: "error", key: "settings.data.error.tooLarge" });
      return;
    }
    try {
      const { settings: next, rejected } = parseSettingsExport(await file.text());
      await replaceAll(next, "settingsImported");
      setNotice(
        rejected.length
          ? { kind: "warn", key: "settings.data.importedPartial", vars: { n: rejected.length, keys: rejected.join(", ") } }
          : { kind: "ok", key: "settings.data.imported" },
      );
    } catch (e) {
      setNotice({ kind: "error", key: `settings.data.error.${(e as Error).message}` });
    }
  };

  return (
    <section className="page settings" aria-labelledby="page-title">
      <header className="page-head">
        <h1 id="page-title">{t("module.settings.title")}</h1>
        <p className="muted">{t("settings.intro")}</p>
      </header>

      <nav className="toc" aria-label={t("settings.toc")}>
        {SECTIONS.map((id) => (
          <a key={id} href={`#/settings`} onClick={(e) => {
            e.preventDefault();
            document.getElementById(`s-${id}`)?.scrollIntoView({ block: "start" });
          }}>
            {t(`settings.${id}.title`)}
          </a>
        ))}
      </nav>

      {notice && (
        <div className={`banner ${notice.kind}`} role="status">
          {t(notice.key, notice.vars)}
          <button type="button" className="link" onClick={() => setNotice(null)}>
            {t("common.dismiss")}
          </button>
        </div>
      )}

      <div className="card section" id="s-general">
        <h2>{t("settings.general.title")}</h2>
        <SelectField label={t("settings.general.startPage")} value={s.startPage} options={START_PAGES.map((p) => ({ value: p, label: p === "last" ? t("settings.general.lastPage") : t(`module.${p}.title`) }))} onChange={set("startPage")} />
        <SelectField label={t("settings.general.learningMode")} hint={t("settings.general.learningModeHint")} value={s.defaultLearningMode} options={opts(LEARNING_MODES, "learning.mode")} onChange={set("defaultLearningMode")} />
      </div>

      <div className="card section" id="s-appearance">
        <h2>{t("settings.appearance.title")}</h2>
        <SelectField label={t("settings.appearance.theme")} hint={t("settings.appearance.themeHint")} value={s.theme} options={opts(THEMES, "theme")} onChange={set("theme")} />
        <SelectField label={t("settings.appearance.accent")} value={s.accent} options={opts(ACCENTS, "accent")} onChange={set("accent")} />
        <RangeField label={t("settings.appearance.fontSize")} value={s.fontSize} min={12} max={20} unit="px" onChange={set("fontSize")} />
        <SelectField label={t("settings.appearance.density")} value={s.density} options={opts(DENSITIES, "density")} onChange={set("density")} />
        <RangeField label={t("settings.appearance.sidebarWidth")} value={s.sidebarWidth} min={200} max={360} step={10} unit="px" onChange={set("sidebarWidth")} />
        <ToggleField label={t("settings.appearance.reduceMotion")} hint={t("settings.appearance.reduceMotionHint")} value={s.reduceMotion} onChange={set("reduceMotion")} />
      </div>

      <div className="card section" id="s-language">
        <h2>{t("settings.language.title")}</h2>
        <SelectField label={t("settings.language.ui")} value={s.uiLocale} options={localeOpts} onChange={set("uiLocale")} />
        <SelectField label={t("settings.language.lesson")} value={s.lessonLocale} options={localeOpts} onChange={set("lessonLocale")} />
        <ToggleField label={t("settings.language.englishTerms")} hint={t("settings.language.englishTermsHint")} value={s.showEnglishTerms} onChange={set("showEnglishTerms")} />
      </div>

      <div className="card section" id="s-learning">
        <h2>{t("settings.learning.title")}</h2>
        <SelectField label={t("settings.learning.level")} value={s.skillLevel} options={opts(SKILL_LEVELS, "learning.level")} onChange={set("skillLevel")} />
        <RangeField label={t("settings.learning.dailyGoal")} value={s.dailyGoalMinutes} min={5} max={240} step={5} unit={` ${t("common.min")}`} onChange={set("dailyGoalMinutes")} />
        <SelectField label={t("settings.learning.hints")} value={s.hintMode} options={opts(HINT_MODES, "learning.hints")} onChange={set("hintMode")} />
        <SelectField label={t("settings.learning.solutions")} value={s.solutionMode} options={opts(SOLUTION_MODES, "learning.solutions")} onChange={set("solutionMode")} />
      </div>

      <div className="card section" id="s-editor">
        <h2>{t("settings.editor.title")}</h2>
        <p className="muted small">{t("settings.editor.note")}</p>
        <TextField label={t("settings.editor.font")} hint={t("settings.editor.fontHint")} value={s.editorFontFamily} onCommit={(v) => void update({ editorFontFamily: v.trim() }).then((r) => r.length && setNotice({ kind: "error", key: "settings.editor.fontInvalid" }))} />
        <RangeField label={t("settings.editor.fontSize")} value={s.editorFontSize} min={10} max={28} unit="px" onChange={set("editorFontSize")} />
        <RangeField label={t("settings.editor.tabSize")} value={s.editorTabSize} min={1} max={8} onChange={set("editorTabSize")} />
        <ToggleField label={t("settings.editor.wordWrap")} value={s.editorWordWrap} onChange={set("editorWordWrap")} />
        <ToggleField label={t("settings.editor.lineNumbers")} value={s.editorLineNumbers} onChange={set("editorLineNumbers")} />
        <ToggleField label={t("settings.editor.autoSave")} value={s.editorAutoSave} onChange={set("editorAutoSave")} />
        <ToggleField label={t("settings.editor.brackets")} value={s.editorBracketMatching} onChange={set("editorBracketMatching")} />
        <pre className="code-preview" aria-label={t("settings.editor.preview")}>
          <code>{`function greet(name) {\n${" ".repeat(s.editorTabSize)}return \`Salam, \${name}!\`;\n}`}</code>
        </pre>
      </div>

      <div className="card section" id="s-privacy">
        <h2>{t("settings.privacy.title")}</h2>
        <p className="muted small">{t("settings.privacy.localOnly")}</p>
        <ToggleField label={t("settings.privacy.recordActivity")} hint={t("settings.privacy.recordActivityHint")} value={s.recordActivity} onChange={set("recordActivity")} />
        <ToggleField label={t("settings.privacy.saveSearchHistory")} hint={t("settings.privacy.saveSearchHistoryHint")} value={s.saveSearchHistory} onChange={set("saveSearchHistory")} />
        <div className="field">
          <div className="field-text">
            <span>{t("settings.privacy.searchHistory")}</span>
          </div>
          <div className="field-control">
            <button type="button" className="btn" onClick={() => void storage.clearSearches().then(() => setNotice({ kind: "ok", key: "settings.privacy.searchCleared" }))}>
              {t("search.clearRecent")}
            </button>
          </div>
        </div>
        <div className="field">
          <div className="field-text">
            <span>{t("settings.privacy.clearActivity")}</span>
          </div>
          <div className="field-control">
            <button type="button" className="btn" onClick={() => setConfirm("clearActivity")}>
              {t("settings.privacy.clearActivityBtn")}
            </button>
          </div>
        </div>
      </div>

      <div className="card section" id="s-data">
        <h2>{t("settings.data.title")}</h2>
        <div className="row wrap">
          <button type="button" className="btn" onClick={exportSettings}>
            {t("settings.data.export")}
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            {t("settings.data.import")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void importSettings(f);
            }}
          />
        </div>
        <p className="muted small">{t("settings.data.note", { backend: storage.info.backend })}</p>
      </div>

      <div className="card section" id="s-performance">
        <h2>{t("settings.performance.title")}</h2>
        <ToggleField label={t("settings.performance.lowResource")} hint={t("settings.performance.lowResourceHint")} value={s.lowResourceMode} onChange={set("lowResourceMode")} />
        <a className="btn" href="#/diagnostics">
          {t("settings.performance.openDiagnostics")}
        </a>
      </div>

      <div className="card section" id="s-planned">
        <h2>{t("settings.planned.title")}</h2>
        <p className="muted small">{t("settings.planned.note")}</p>
        <ul className="list">
          {PLANNED.map((key) => (
            <li key={key}>
              <span>{t(`settings.planned.${key}`)}</span>
              <span className="badge">{t("status.notStarted")}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card section" id="s-about">
        <h2>{t("settings.about.title")}</h2>
        <dl className="kv">
          <dt>{t("settings.about.version")}</dt>
          <dd>{__APP_VERSION__}</dd>
          <dt>{t("settings.about.platform")}</dt>
          <dd>{storage.info.backend === "sqlite" ? t("platform.desktop") : t("platform.web")}</dd>
        </dl>
        <p className="muted small">{t("app.slogan")}</p>
        <div className="field">
          <div className="field-text">
            <span>{t("settings.reset.label")}</span>
            <p className="muted small">{t("settings.reset.hint")}</p>
          </div>
          <div className="field-control">
            <button type="button" className="btn danger" onClick={() => setConfirm("reset")}>
              {t("settings.reset.button")}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "reset"}
        title={t("settings.reset.confirmTitle")}
        body={t("settings.reset.confirmBody")}
        confirmLabel={t("settings.reset.button")}
        cancelLabel={t("common.cancel")}
        danger
        onConfirm={() => void resetToDefaults().then(() => setNotice({ kind: "ok", key: "settings.reset.done" }))}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "clearActivity"}
        title={t("settings.privacy.clearActivityBtn")}
        body={t("settings.privacy.clearActivityConfirm")}
        confirmLabel={t("common.clear")}
        cancelLabel={t("common.cancel")}
        danger
        onConfirm={() => void Promise.all([storage.clearActivity(), resetStudyTime()]).then(() => setNotice({ kind: "ok", key: "settings.privacy.cleared" }))}
        onClose={() => setConfirm(null)}
      />
    </section>
  );
}
