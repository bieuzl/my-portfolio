import type { Locale } from "@/i18n";
import type { PortfolioContent } from "./types";
import { ptBR } from "./pt-BR";
import { en } from "./en";

export type { PortfolioContent, ProjectEntry, SkillGroup, ExperienceEntry } from "./types";

const CONTENT: Record<Locale, PortfolioContent> = {
  "pt-BR": ptBR,
  en,
};

/**
 * Small interface, hidden structure: callers ask for the content of a
 * locale and never touch file layout or fallback rules.
 */
export function getPortfolioContent(locale: Locale): PortfolioContent {
  return CONTENT[locale] ?? ptBR;
}
