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
      subtitle: "Ayni Startup · Flagship ecosystem product",
      startupIntro:
        "Ayni is a technology startup that builds intelligent solutions to optimize processes, connect information, and turn business challenges into more efficient experiences powered by artificial intelligence. Ayni CRM is the first product of this ecosystem, which will expand with new upcoming projects.",
      role: "AI and commercial solutions development: intelligent agent orchestration, channel automation, lead prospecting, and proposal & contract modules.",
      stackSummary:
        "Platform technologies, AI model integration, and automation tools.",
      team: "2 developers · Collaborative development with AI agents.",
      privateRepo: true,
      context:
        "AI-powered CRM for professionals and companies selling technology services. A platform that integrates commercial management, lead prospecting, and intelligent agents into a single workflow.",
      contribution:
        "I work directly on the Artificial Intelligence layer and commercial modules of the platform: from orchestrating autonomous intelligent agents and channel automation to lead prospecting workflows, proposal generation, and contract management.",
      details: [
        "Orchestration of autonomous intelligent agents and multi-agent workflows for commercial qualification, opportunity tracking, and decision support.",
        "Omnichannel communication automation and active lead prospecting, connecting interactions directly into the commercial pipeline in real time.",
        "Integrated commercial proposal generation and contract management modules built right into the CRM flow.",
        "Lean collaborative engineering (2 developers) augmented by specialized AI agents to accelerate architecture, review, and delivery cycles.",
      ],
      technologies: [
        "Artificial Intelligence",
        "Autonomous Agents",
        "Channel Automation",
        "CRM & Commercial Flow",
        "LLM Integration",
      ],
      links: [],
      placeholder: false,
    },
    {
      id: "proj-financer-ai",
      year: "In development",
      title: "FinancerAI",
      subtitle: "Smart message-driven financial control",
      role: "Complete Back-end development (Java / Spring Boot architecture, business rules, JWT authentication, security, and persistence).",
      stackSummary:
        "React, Node.js (Fastify), Java (Spring Boot), PostgreSQL, Google Gemini",
      team: "3 developers",
      privateRepo: false,
      previewImage: "/models/financerai-preview.svg",
      context:
        "Message-based financial tracking: AI reads phrases like “Spent R$ 50 on Uber” (“Gastei R$ 50 no Uber”) and turns them into categorized income and expenses.",
      contribution:
        "Responsible for the complete Back-end development of the platform: financial business logic in Java and Spring Boot, stateless JWT authentication and authorization, API security, service integration, and PostgreSQL persistence.",
      details: [
        "Natural language processing with Google Gemini: user messages (such as “Gastei R$ 50 no Uber”) are parsed and converted into structured transactions (type, amount, category, and description).",
        "Distributed architecture combining Node.js (Fastify) for messaging/integrations and Java (Spring Boot) as the core engine for financial business rules.",
        "Security and access control powered by Spring Security and stateless JWT authentication.",
        "Relational persistence in PostgreSQL with automated income/expense categorization feeding the React dashboard in real time.",
      ],
      technologies: [
        "Java (Spring Boot)",
        "Node.js (Fastify)",
        "PostgreSQL",
        "Google Gemini",
        "React",
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
      id: "exp-impacta",
      period: "August 2026",
      role: "Systems Analysis and Development (1st semester)",
      org: "Faculdade Impacta",
      summary:
        "Degree focused on software engineering, systems architecture, data modeling, and back-end development.",
      note: "Note: Completed 3 semesters at Cruzeiro do Sul University (started March 2024) before restarting the degree at Faculdade Impacta.",
      placeholder: false,
    },
    {
      id: "exp-rocketseat",
      period: "October 2026",
      role: "Software Development Program",
      org: "Rocketseat",
      summary:
        "Hands-on specialization track focused on back-end development, Java, Spring Boot, REST APIs, and application architecture.",
      placeholder: false,
    },
    {
      id: "exp-ayni",
      period: "2026",
      role: "Back-end & AI Developer",
      org: "Ayni · Technology Startup",
      summary:
        "Building the Ayni startup and developing Ayni CRM, working on commercial solutions architecture, autonomous agent orchestration, and AI-driven automation.",
      placeholder: false,
    },
  ],
};
