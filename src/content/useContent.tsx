import { useMemo } from "react";
import { useSettings } from "../core/settings/SettingsContext";
import { useI18n } from "../core/i18n/i18n";
import { contentChain, pick, type L, type Term } from "./types";
import type { Locale } from "../core/settings/schema";

const LOCALE_NAMES: Record<Locale, string> = { az: "Azərbaycanca", tr: "Türkçe", en: "English", ru: "Русский" };

/** Content is shown in the lesson language (Settings → Language), with az → en fallback. */
export function useContent() {
  const { settings } = useSettings();
  const preferred = settings.lessonLocale;
  return useMemo(() => {
    const chain = contentChain(preferred);
    return {
      preferred,
      tx: (text: L | null | undefined) => pick(text, chain),
      /** Locale actually used for this text, or null when nothing is available. */
      shownIn: (text: L | null | undefined): Locale | null => chain.find((l) => text?.[l]) ?? null,
      termLabel: (term: Term) => {
        const local = pick(term.local, chain.filter((l) => l !== "en"));
        if (preferred === "en" || !local) return term.en;
        return settings.showEnglishTerms ? `${local} (${term.en})` : local;
      },
      showEnglishTerms: settings.showEnglishTerms,
    };
  }, [preferred, settings.showEnglishTerms]);
}

/** Small notice when text is shown in a fallback language. Renders nothing when translated. */
export function Untranslated({ text }: { text: L | null | undefined }) {
  const { t } = useI18n();
  const { preferred, shownIn } = useContent();
  const used = shownIn(text);
  if (!used || used === preferred) return null;
  return (
    <span className="badge warn-badge" title={t("content.untranslatedLong", { lang: LOCALE_NAMES[preferred], shown: LOCALE_NAMES[used] })}>
      {t("content.untranslated", { shown: LOCALE_NAMES[used] })}
    </span>
  );
}

export { LOCALE_NAMES };
