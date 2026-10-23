import type { PortfolioContent } from "./types";

/**
 * English content. Everything marked `placeholder: true` is sample
 * structure waiting for Gabriel's real content.
 */
export const en: PortfolioContent = {
  name: "Gabriel",
  projects: [
    {
      id: "proj-01",
      year: "20XX",
      title: "[Project 01 — title]",
      context: "[In 1–2 sentences: what the project is, who it was built for, and which problem it solves.]",
      contribution:
        "[What you specifically did: parts you designed, implemented, or led.]",
      technologies: ["[Technology 1]", "[Technology 2]", "[Technology 3]"],
      links: [
        { label: "Demo", href: "" },
        { label: "Repository", href: "" },
      ],
      placeholder: true,
    },
    {
      id: "proj-02",
      year: "20XX",
      title: "[Project 02 — title]",
      context: "[Context for the second featured project.]",
      contribution: "[Your contribution to this project.]",
      technologies: ["[Technology 1]", "[Technology 2]"],
      links: [{ label: "Repository", href: "" }],
      placeholder: true,
    },
    {
      id: "proj-03",
      year: "20XX",
      title: "[Project 03 — title]",
      context: "[Context for the third featured project.]",
      contribution: "[Your contribution to this project.]",
      technologies: ["[Technology 1]", "[Technology 2]", "[Technology 3]"],
      links: [
        { label: "Demo", href: "" },
        { label: "Repository", href: "" },
      ],
      placeholder: true,
    },
  ],
  skillGroups: [
    {
      id: "sg-languages",
      label: "Languages",
      items: ["[E.g.: TypeScript]", "[E.g.: Python]", "[E.g.: Go]"],
      placeholder: true,
    },
    {
      id: "sg-frontend",
      label: "Front-end",
      items: ["[E.g.: React]", "[E.g.: Tailwind CSS]", "[E.g.: Three.js]"],
      placeholder: true,
    },
    {
      id: "sg-backend",
      label: "Back-end and data",
      items: ["[E.g.: Node.js]", "[E.g.: PostgreSQL]", "[E.g.: Redis]"],
      placeholder: true,
    },
    {
      id: "sg-tooling",
      label: "Tooling and practices",
      items: ["[E.g.: Git]", "[E.g.: Docker]", "[E.g.: Automated tests]"],
      placeholder: true,
    },
  ],
  experience: [
    {
      id: "exp-01",
      period: "20XX — present",
      role: "[Current or most recent role]",
      org: "[Company or organization]",
      summary: "[1–2 sentences about responsibilities and one relevant outcome, without invented numbers.]",
      placeholder: true,
    },
    {
      id: "exp-02",
      period: "20XX — 20XX",
      role: "[Previous role or project]",
      org: "[Company, organization, or personal project]",
      summary: "[What you did and learned during this period.]",
      placeholder: true,
    },
    {
      id: "exp-03",
      period: "20XX — 20XX",
      role: "[Education — degree or course]",
      org: "[Educational institution]",
      summary: "[Course, field of study, and relevant academic projects.]",
      placeholder: true,
    },
  ],
};
