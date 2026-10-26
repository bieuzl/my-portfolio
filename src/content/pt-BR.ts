import type { PortfolioContent } from "./types";

/**
 * Conteúdo em português — informações profissionais do Gabriel.
 * Entradas com `placeholder: true` ainda aguardam dados reais e são
 * sinalizadas na interface.
 */
export const ptBR: PortfolioContent = {
  name: "Gabriel",
  projects: [
    {
      id: "proj-01",
      year: "2026",
      title: "gabriel.dev — portfólio pessoal",
      context:
        "Meu site pessoal: hero com escultura 3D renderizada em tempo real, fundo animado, internacionalização PT/EN e design autoral — este que você está vendo agora.",
      contribution:
        "Projetei e desenvolvi tudo: arquitetura front-end, cenas Three.js procedurais, animações, testes automatizados e deploy.",
      technologies: ["React", "TypeScript", "Three.js", "Tailwind CSS"],
      links: [
        { label: "Demo", href: "" },
        { label: "Repositório", href: "https://github.com/bieuzl/my-portfolio" },
      ],
      placeholder: false,
    },
    {
      id: "proj-02",
      year: "2025",
      title: "API de Finanças Pessoais",
      context:
        "API REST para organizar receitas, despesas e metas, com autenticação e visão mensal consolidada. Projeto autoral para aprofundar o ecossistema Spring.",
      contribution:
        "Modelei o domínio, implementei os endpoints, a autenticação JWT, as migrações de banco e a suíte de testes de integração.",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      links: [{ label: "Repositório", href: "" }],
      placeholder: false,
    },
    {
      id: "proj-03",
      year: "2025",
      title: "Serviço de Autenticação JWT",
      context:
        "Serviço de autenticação e autorização com tokens JWT, refresh tokens e controle de acesso por papéis, pensado para ser reutilizado em outros projetos.",
      contribution:
        "Implementei emissão e validação de tokens, cadastro e login de usuários, e a documentação dos endpoints.",
      technologies: ["Java", "Spring Security", "Redis"],
      links: [{ label: "Repositório", href: "" }],
      placeholder: false,
    },
  ],
  skillGroups: [
    {
      id: "sg-backend",
      label: "Desenvolvimento Back-end",
      items: [
        "Java",
        "Spring Boot",
        "APIs REST",
        "Regras de negócio",
        "Arquitetura de aplicações",
      ],
      placeholder: false,
    },
    {
      id: "sg-ai",
      label: "Inteligência Artificial",
      items: [
        "Agentes de IA",
        "Sistemas multiagentes",
        "Skills para agentes",
        "Automação com IA",
        "Integração com LLMs",
      ],
      placeholder: false,
    },
    {
      id: "sg-data",
      label: "Dados e Integrações",
      items: [
        "SQL",
        "PostgreSQL",
        "Bancos de dados relacionais",
        "Modelagem de dados",
        "Integração entre APIs",
      ],
      placeholder: false,
    },
    {
      id: "sg-tooling",
      label: "Ferramentas e Práticas",
      items: [
        "Git",
        "GitHub",
        "IntelliJ IDEA",
        "Desenvolvimento assistido por IA",
        "Revisão e validação de código",
      ],
      placeholder: false,
    },
  ],
  experience: [
    {
      id: "exp-01",
      period: "2025 — atual",
      role: "Desenvolvedor Back-end",
      org: "Projetos autorais e freelance",
      summary:
        "Desenho e implemento APIs em Java com Spring Boot — modelagem de dados, autenticação, testes e deploy containerizado — e mantenho este portfólio como vitrine técnica.",
      placeholder: false,
    },
    {
      id: "exp-02",
      period: "2024 — 2025",
      role: "Desenvolvedor de Software",
      org: "Estudos aplicados e projetos práticos",
      summary:
        "Aprofundei os fundamentos de back-end — HTTP, bancos relacionais, mensageria — construindo projetos completos em vez de exemplos isolados.",
      placeholder: false,
    },
    {
      id: "exp-03",
      period: "2024",
      role: "Formação em desenvolvimento de software",
      org: "Cursos e certificações",
      summary:
        "Trilhas de Java, Spring Boot, SQL e Git, sempre com um projeto prático ao final de cada módulo.",
      placeholder: false,
    },
  ],
};
