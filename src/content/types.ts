/**
 * Portfolio content schema. Both locale files must satisfy these types —
 * the compiler enforces structural parity between pt-BR and en.
 *
 * `placeholder: true` marks sample entries that must be replaced with real
 * content. The UI badges them so nothing fictional reads as fact.
 */
export interface ProjectLink {
  label: string;
  /** Empty string means "link not provided yet" — rendered as inert text. */
  href: string;
}

export interface ProjectEntry {
  id: string;
  year: string;
  title: string;
  context: string;
  contribution: string;
  technologies: string[];
  links: ProjectLink[];
  placeholder: boolean;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
  placeholder: boolean;
}

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  org: string;
  summary: string;
  placeholder: boolean;
}

export interface PortfolioContent {
  /** Displayed name — real, provided by the user settings. */
  name: string;
  projects: ProjectEntry[];
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
}
