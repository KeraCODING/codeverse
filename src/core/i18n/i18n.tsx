import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../settings/schema";

export type Dict = Record<string, string>;

// Each locale is its own lazy chunk: only the active one (plus English as fallback) is loaded.
const loaders = import.meta.glob<Dict>("./locales/*.json", { import: "default" });

const cache = new Map<Locale, Dict>();

export async function loadDict(locale: Locale): Promise<Dict> {
  const hit = cache.get(locale);
  if (hit) return hit;
  const load = loaders[`./locales/${locale}.json`];
  if (!load) throw new Error(`Missing locale ${locale}`);
  const dict = await load();
  cache.set(locale, dict);
  return dict;
}

/** `{name}` placeholders are replaced from `vars`. Missing keys fall back, then show the key. */
export function translate(dict: Dict, fallback: Dict | null, key: string, vars?: Record<string, string | number>): string {
  let s = dict[key] ?? fallback?.[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

export type TFn = (key: string, vars?: Record<string, string | number>) => string;

interface I18nValue {
  locale: Locale;
  t: TFn;
  formatDateTime: (ms: number) => string;
  formatDate: (ms: number) => string;
  formatNumber: (n: number, opts?: Intl.NumberFormatOptions) => string;
}

const Ctx = createContext<I18nValue | null>(null);

const INTL_TAG: Record<Locale, string> = { az: "az-Latn-AZ", tr: "tr-TR", en: "en-GB", ru: "ru-RU" };

export function I18nProvider({ locale, initial, children }: { locale: Locale; initial: Dict; children: ReactNode }) {
  const [state, setState] = useState<{ locale: Locale; dict: Dict; fallback: Dict | null }>({
    locale,
    dict: initial,
    fallback: locale === "en" ? null : (cache.get("en") ?? null),
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadDict(locale), locale === "en" ? null : loadDict("en")]).then(([dict, fallback]) => {
      if (!cancelled) setState({ locale, dict, fallback });
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const value = useMemo<I18nValue>(() => {
    const tag = INTL_TAG[state.locale];
    const dtf = new Intl.DateTimeFormat(tag, { dateStyle: "medium", timeStyle: "short" });
    const df = new Intl.DateTimeFormat(tag, { dateStyle: "long" });
    return {
      locale: state.locale,
      t: (key, vars) => translate(state.dict, state.fallback, key, vars),
      formatDateTime: (ms) => dtf.format(ms),
      formatDate: (ms) => df.format(ms),
      formatNumber: (n, opts) => new Intl.NumberFormat(tag, opts).format(n),
    };
  }, [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside I18nProvider");
  return v;
}
