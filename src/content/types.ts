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

export interface SubpageSectionItem {
  title: string;
  body: string;
}

export interface SubpageSection {
  heading: string;
  paragraphs?: string[];
  callout?: {
    boldPrefix: string;
    text: string;
  };
  items?: SubpageSectionItem[];
}

export interface ProjectEntry {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  startupIntro?: string;
  role: string;
  stackSummary: string;
  team: string;
  privateRepo?: boolean;
  previewImage?: string;
  context: string;
  contribution: string;
  details: string[];
  subpageSections?: SubpageSection[];
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
  note?: string;
  placeholder: boolean;
}

export interface PortfolioContent {
  /** Displayed name — real, provided by the user settings. */
  name: string;
  projects: ProjectEntry[];
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
}
