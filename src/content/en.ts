import type { PortfolioContent } from "./types";

/**
 * English content — Gabriel's professional information.
 * Entries flagged `placeholder: true` still await real data and are
 * badged in the UI.
 */
export const en: PortfolioContent = {
  name: "Gabriel",
  projects: [
    {
      id: "proj-ayni-crm",
      year: "Ayni · In development",
      title: "Ayni CRM",
      subtitle: "Ayni Startup · First product in development",
      startupIntro:
        "Ayni is an early-stage startup built by two developers. Ayni CRM is the company's first product, built to manage the commercial workflow of technology service providers from first contact to signed contract.",
      role: "AI orchestration, communication channels, lead prospecting, and proposal/contract modules.",
      stackSummary:
        "TypeScript, React, Supabase (PostgreSQL, RLS, Edge Functions / Deno), Zod",
      team: "2 developers",
      privateRepo: true,
      context:
        "CRM in development for professionals and companies selling technology services. Combines commercial pipeline management, lead prospecting, proposal generation, and AI assistants with human approval on sensitive actions.",
      contribution:
        "I own four core modules of the platform (ai, channels, prospecting, and proposals): orchestrating the Atlas and Astas AI assistants with a human-approval queue, managing the knowledge base, building the embeddable website chat widget and email dispatch flow, automating website diagnostics for lead prospecting, and implementing versioned proposals and contracts.",
      details: [
        "AI module (ai): conversation tracking, agent runs, handoffs, human-approval workflows (ai_approvals) for sensitive actions (pricing, proposals, contracts, prospecting), and document knowledge sources.",
        "Channels module (channels): embeddable website chat widget, session tracking, email delivery event logging, and global opt-out handling.",
        "Prospecting module (prospecting): filtered lead searches, automated website diagnostics, niche briefings, and lead prototypes.",
        "Proposals & Contracts module (proposals): document templates, versioned commercial proposals, contract generation, and document lifecycle events.",
        "Multi-tenant data isolation in PostgreSQL using Row Level Security (RLS) per workspace, shared Zod schemas (@ayni/shared), and Deno Edge Functions.",
      ],
      technologies: [
        "TypeScript",
        "React",
        "Supabase (PostgreSQL & RLS)",
        "Deno Edge Functions",
        "Zod",
      ],
      links: [],
      placeholder: false,
    },
    {
      id: "proj-financer-ai",
      year: "In development",
      title: "FinancerAI",
      subtitle: "Expense and income tracking via chat messages",
      role: "Java and Spring Boot back-end: business rules, JWT authentication, security, and PostgreSQL persistence.",
      stackSummary:
        "Java 17, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, Node.js (Fastify), React, Google Gemini API",
      team: "3 developers",
      privateRepo: false,
      previewImage: "/models/financerai-preview.svg",
      context:
        "Financial tracking system in development: users send WhatsApp messages like “Gastei R$ 50 no Uber” (“Spent R$ 50 on Uber”) and the application records categorized income and expenses.",
      contribution:
        "I develop the Java 17 and Spring Boot back-end service (backend-java module). I structured the layered architecture (controller, service, repository, entity, dto, and config), PostgreSQL persistence with Spring Data JPA, payload validation, and JWT authentication with Spring Security.",
      details: [
        "Node.js (Fastify) service receives WhatsApp messages and calls the Google Gemini API to extract transaction amount, type (income or expense), description, and category.",
        "Java 17 and Spring Boot 4 API handles financial business rules, user management, and request validation (Bean Validation).",
        "Stateless JWT authentication and route protection configured with Spring Security.",
        "Relational persistence in PostgreSQL via Spring Data JPA, serving consolidated transaction data to the React dashboard.",
      ],
      technologies: [
        "Java 17",
        "Spring Boot",
        "Spring Security",
        "Spring Data JPA",
        "PostgreSQL",
        "Node.js (Fastify)",
        "React",
        "Google Gemini API",
      ],
      links: [
        { label: "GitHub", href: "https://github.com/EzequielMags/FinancerAI" },
      ],
      placeholder: false,
    },
  ],
  skillGroups: [
    {
      id: "sg-backend",
      label: "Back-end Development",
      items: [
        "Java",
        "Spring Boot",
        "REST APIs",
        "Business rules",
        "Application architecture",
      ],
      placeholder: false,
    },
    {
      id: "sg-ai",
      label: "Artificial Intelligence",
      items: [
        "AI Agents",
        "Multi-agent systems",
        "Agent skills",
        "AI automation",
        "LLM integration",
      ],
      placeholder: false,
    },
    {
      id: "sg-data",
      label: "Data & Integrations",
      items: [
        "SQL",
        "PostgreSQL",
        "Relational databases",
        "Data modeling",
        "API integrations",
      ],
      placeholder: false,
    },
    {
      id: "sg-tooling",
      label: "Tools & Practices",
      items: [
        "Git",
        "GitHub",
        "IntelliJ IDEA",
        "AI-assisted development",
        "Code review & validation",
      ],
      placeholder: false,
    },
  ],
  experience: [
    {
      id: "exp-ayni",
      period: "2026",
      role: "Back-end & AI Developer",
      org: "Ayni · Technology Startup",
      summary:
        "Developing the AI, channels, prospecting, and proposals modules of Ayni CRM using TypeScript, React, Supabase (PostgreSQL with RLS), and Edge Functions.",
      placeholder: false,
    },
    {
      id: "exp-rocketseat",
      period: "October 2026",
      role: "Software Development Program",
      org: "Rocketseat",
      summary:
        "Hands-on training focused on Java, Spring Boot, REST API design, database modeling, and testing.",
      placeholder: false,
    },
    {
      id: "exp-impacta",
      period: "August 2026",
      role: "Systems Analysis and Development (1st semester)",
      org: "Faculdade Impacta",
      summary:
        "Undergraduate degree in progress focused on algorithms, software engineering, relational databases, and systems architecture.",
      note: "Note: Completed 3 semesters at Cruzeiro do Sul University (started March 2024) before restarting the degree at Faculdade Impacta.",
      placeholder: false,
    },
  ],
};
