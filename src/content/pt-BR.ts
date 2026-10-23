import type { PortfolioContent } from "./types";

/**
 * Conteúdo em português. TUDO que é placeholder está marcado com
 * `placeholder: true` e deve ser substituído pelo Gabriel.
 */
export const ptBR: PortfolioContent = {
  name: "Gabriel",
  projects: [
    {
      id: "proj-01",
      year: "20XX",
      title: "[Projeto 01 — título]",
      context: "[Em 1–2 frases: o que é o projeto, para quem foi feito e qual problema resolve.]",
      contribution:
        "[O que você fez especificamente: partes que projetou, implementou ou liderou.]",
      technologies: ["[Tecnologia 1]", "[Tecnologia 2]", "[Tecnologia 3]"],
      links: [
        { label: "Demo", href: "" },
        { label: "Repositório", href: "" },
      ],
      placeholder: true,
    },
    {
      id: "proj-02",
      year: "20XX",
      title: "[Projeto 02 — título]",
      context: "[Contexto do segundo projeto em destaque.]",
      contribution: "[Sua contribuição neste projeto.]",
      technologies: ["[Tecnologia 1]", "[Tecnologia 2]"],
      links: [{ label: "Repositório", href: "" }],
      placeholder: true,
    },
    {
      id: "proj-03",
      year: "20XX",
      title: "[Projeto 03 — título]",
      context: "[Contexto do terceiro projeto em destaque.]",
      contribution: "[Sua contribuição neste projeto.]",
      technologies: ["[Tecnologia 1]", "[Tecnologia 2]", "[Tecnologia 3]"],
      links: [
        { label: "Demo", href: "" },
        { label: "Repositório", href: "" },
      ],
      placeholder: true,
    },
  ],
  skillGroups: [
    {
      id: "sg-languages",
      label: "Linguagens",
      items: ["[Ex.: TypeScript]", "[Ex.: Python]", "[Ex.: Go]"],
      placeholder: true,
    },
    {
      id: "sg-frontend",
      label: "Front-end",
      items: ["[Ex.: React]", "[Ex.: Tailwind CSS]", "[Ex.: Three.js]"],
      placeholder: true,
    },
    {
      id: "sg-backend",
      label: "Back-end e dados",
      items: ["[Ex.: Node.js]", "[Ex.: PostgreSQL]", "[Ex.: Redis]"],
      placeholder: true,
    },
    {
      id: "sg-tooling",
      label: "Ferramentas e práticas",
      items: ["[Ex.: Git]", "[Ex.: Docker]", "[Ex.: Testes automatizados]"],
      placeholder: true,
    },
  ],
  experience: [
    {
      id: "exp-01",
      period: "20XX — atual",
      role: "[Cargo atual ou mais recente]",
      org: "[Empresa ou organização]",
      summary: "[1–2 frases sobre responsabilidades e um resultado relevante, sem inventar números.]",
      placeholder: true,
    },
    {
      id: "exp-02",
      period: "20XX — 20XX",
      role: "[Cargo ou projeto anterior]",
      org: "[Empresa, organização ou projeto pessoal]",
      summary: "[O que você fez e aprendeu nesse período.]",
      placeholder: true,
    },
    {
      id: "exp-03",
      period: "20XX — 20XX",
      role: "[Formação — curso ou graduação]",
      org: "[Instituição de ensino]",
      summary: "[Curso, área de estudo e projetos acadêmicos relevantes.]",
      placeholder: true,
    },
  ],
};
