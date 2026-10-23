import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";

export const SUPPORTED_LOCALES = ["pt-BR", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt-BR";

export function normalizeLocale(raw: string | null | undefined): Locale {
  if (!raw) return DEFAULT_LOCALE;
  const lower = raw.toLowerCase();
  if (lower.startsWith("pt")) return "pt-BR";
  if (lower.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "pt-BR": { translation: ptBR },
      en: { translation: en },
    },
    fallbackLng: DEFAULT_LOCALE,
    // NOTE: no supportedLngs/nonExplicitSupportedLngs — with i18next v26 that
    // combination breaks key lookup entirely. Region variants (en-US, pt-PT)
    // resolve through the built-in hierarchy (en-US → en → pt-BR fallback).
    ns: ["translation"],
    defaultNS: "translation",
    returnNull: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    detection: {
      // pt-BR first: only an explicit user choice (persisted) overrides it
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "portfolio-locale",
    },
  });

export default i18n;
