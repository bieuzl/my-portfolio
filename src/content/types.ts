/**
 * Portfolio content schema. Both locale files must satisfy these types —
 * the compiler enforces structural parity between pt-BR and en.
 */
export interface ProjectLink {
  label: string;
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
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  org: string;
  summary: string;
  note?: string;
}

export interface PortfolioContent {
  name: string;
  projects: ProjectEntry[];
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
}
