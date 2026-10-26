import type { PortfolioContent } from "./types";

/**
 * English content — Gabriel's professional information.
 */
export const en: PortfolioContent = {
  name: "Gabriel",
  projects: [
    {
      id: "proj-ayni-crm",
      year: "Ayni · In development",
      title: "Ayni CRM",
      subtitle: "Ayni Startup · First product · In development",
      role: "AI orchestration, communication channels, lead prospecting, and proposal/contract modules.",
      stackSummary:
        "TypeScript · React · Supabase · PostgreSQL · Row Level Security (RLS) · Deno Edge Functions · Zod",
      team: "2 developers",
      privateRepo: true,
      context:
        "CRM in development for professionals and companies selling technology services. Combines commercial pipeline management, lead prospecting, proposal generation, and AI assistants with human approval on sensitive actions.",
      contribution:
        "I am responsible for developing the platform's Artificial Intelligence and commercial operations modules.",
      details: [],
      subpageSections: [
        {
          heading: "About the product",
          paragraphs: [
            "Ayni is a startup developing an AI-powered CRM tailored for professionals and companies that sell technology services.",
            "Its first product, Ayni CRM, was designed to organize the commercial process in a single environment. The goal is to reduce manual prospecting and follow-up work, centralize contact history, and streamline the journey from prospect to signed contract.",
            "The MVP initially focuses on freelancers, web designers, and small studios that sell websites, landing pages, and digital identities.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "The workflow starts by identifying potential clients. The platform is designed to support niche searches, analyze website data, and organize relevant information for sales outreach.",
            "From there, contacts are tracked through the CRM with deal stages, activities, and full history. The Atlas and Astas AI assistants participate in this flow, helping with lead interactions and commercial tasks.",
            "The platform also includes features to create briefings, browse website templates, generate prompts, and prepare commercial proposals. When it is time to close the deal, the client can accept a proposal via a public link and the contract flow integrates with ZapSign.",
          ],
          callout: {
            boldPrefix: "AI does not act without boundaries:",
            text: "sensitive actions—such as decisions involving pricing, proposals, contracts, and prospecting—go through a human approval workflow defined in the product architecture.",
          },
        },
        {
          heading: "My role",
          paragraphs: [
            "I am responsible for developing the platform's Artificial Intelligence and commercial operations modules.",
          ],
          items: [
            {
              title: "AI Orchestration — Atlas and Astas",
              body: "Structuring communication between the assistants, request routing, conversation history, and human handoff when needed. The architecture also includes a human approval queue for sensitive actions and knowledge source management.",
            },
            {
              title: "Channels — Customer communication channels",
              body: "Developing the module designed to connect the CRM to external channels, including an embeddable website chat widget, session management, email event logging, and opt-out controls.",
            },
            {
              title: "Prospecting — Smart prospecting",
              body: "Building features for niche lead searches, technical website diagnostics, briefing creation, and access to a catalog of templates and prototypes. The module also covers custom prompt generation by Atlas based on lead data.",
            },
            {
              title: "Proposals & Contracts",
              body: "Developing the commercial document structure, templates, proposal versioning, public-link acceptance, and planned ZapSign integration for contract signing.",
            },
          ],
        },
        {
          heading: "Architecture and technical decisions",
          paragraphs: [
            "The platform follows a modular architecture where each area has well-defined responsibilities and communicates through shared contracts.",
            "A key principle is the isolation between AI modules and the CRM core: AI modules do not write directly to commercial tables. Changes must go through service functions exposed by the core, keeping business rules centralized.",
            "The architecture also enforces workspace data isolation with Row Level Security (RLS), schema validation with Zod, and Deno Edge Functions running on Supabase.",
          ],
        },
        {
          heading: "Technologies",
          items: [
            {
              title: "Documented project stack",
              body: "TypeScript · React · Supabase · PostgreSQL · Row Level Security (RLS) · Deno Edge Functions · Zod",
            },
          ],
        },
        {
          heading: "Team and development",
          paragraphs: [
            "Developed by a two-developer team, splitting responsibilities between the platform core and the AI and commercial operations modules.",
          ],
          items: [
            {
              title: "Status",
              body: "In development. The features described represent the defined MVP scope; availability of each feature depends on the current implementation stage.",
            },
            {
              title: "Source code",
              body: "Private repository.",
            },
          ],
        },
      ],
      technologies: [
        "TypeScript",
        "React",
        "Supabase",
        "PostgreSQL",
        "Row Level Security (RLS)",
        "Deno Edge Functions",
        "Zod",
      ],
      links: [],
    },
    {
      id: "proj-financer-ai",
      year: "In development",
      title: "FinancerAI",
      subtitle: "Smart message-driven financial control · In development",
      role: "Java and Spring Boot back-end: business rules, JWT authentication, security, and PostgreSQL persistence.",
      stackSummary:
        "Java 17 · Spring Boot · Spring Security · Spring Data JPA · PostgreSQL · Node.js (Fastify) · React · Google Gemini API",
      team: "3 developers",
      privateRepo: false,
      previewImage: "/models/financerai-preview.svg",
      context:
        "Message-based financial tracking: AI reads WhatsApp messages like “Gastei R$ 50 no Uber” (“Spent R$ 50 on Uber”) and turns them into categorized income and expenses.",
      contribution:
        "Responsible for developing the Java 17 and Spring Boot back-end module (backend-java): layered architecture, financial business rules, JWT authentication with Spring Security, and PostgreSQL persistence.",
      details: [],
      subpageSections: [
        {
          heading: "About the product",
          paragraphs: [
            "FinancerAI is a financial tracking platform that uses Artificial Intelligence to automate logging income, expenses, and financial reports directly through WhatsApp.",
            "The goal is to let users record daily financial transactions in natural language without filling out spreadsheets or manual forms.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "The user sends a simple message on WhatsApp, such as “Gastei R$ 50 no Uber” (“Spent R$ 50 on Uber”).",
            "The integration service receives the message and calls the AI model (Google Gemini) to parse the text and extract the transaction type (income or expense), amount, description, and category.",
            "Next, the core Java and Spring Boot API validates the business rules, persists the transaction in PostgreSQL, and serves the updated data to the React dashboard.",
          ],
        },
        {
          heading: "My role",
          paragraphs: [
            "I am responsible for developing the Java and Spring Boot back-end module (backend-java), which handles the platform's business rules, security, and data persistence.",
          ],
          items: [
            {
              title: "Layered Architecture — Java 17 & Spring Boot",
              body: "Structuring the backend-java module with clear separation of concerns across controller (HTTP/JSON requests), service (business rules and validations), repository (data access), entity (JPA mapping), dto, and config.",
            },
            {
              title: "JWT Authentication & Security — Spring Security",
              body: "Implementing stateless authentication and authorization with JWT tokens, route protection, and credential validation.",
            },
            {
              title: "Business Rules & Persistence — Spring Data JPA & PostgreSQL",
              body: "Modeling user and financial entities in PostgreSQL, validating payloads with Bean Validation, and exposing REST endpoints.",
            },
          ],
        },
        {
          heading: "Architecture and technical decisions",
          paragraphs: [
            "The system uses a distributed service architecture: the Node.js (Fastify) service handles WhatsApp communication (Baileys) and Google Gemini API calls, while the Java (Spring Boot) service acts as the core engine for financial business rules and data integrity.",
            "This separation keeps the financial domain isolated in a strongly typed Java API backed by PostgreSQL and consumed by the React dashboard.",
          ],
        },
        {
          heading: "Technologies",
          items: [
            {
              title: "Documented repository stack",
              body: "Java 17 · Spring Boot · Spring Security · Spring Data JPA · JWT · PostgreSQL · Node.js (Fastify) · Google Gemini API · React · Docker",
            },
          ],
        },
        {
          heading: "Team and development",
          paragraphs: [
            "Developed by a 3-developer team, splitting responsibilities across the Java/Spring Boot back-end, the Node.js/AI integration service, and the React front-end dashboard.",
          ],
          items: [
            {
              title: "Status",
              body: "In development.",
            },
            {
              title: "GitHub Repository",
              body: "https://github.com/EzequielMags/FinancerAI",
            },
          ],
        },
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
    },
    {
      id: "exp-rocketseat",
      period: "October 2026",
      role: "Software Development Program",
      org: "Rocketseat",
      summary:
        "Hands-on training focused on Java, Spring Boot, REST API design, database modeling, and testing.",
    },
    {
      id: "exp-impacta",
      period: "August 2026",
      role: "Systems Analysis and Development (1st semester)",
      org: "Faculdade Impacta",
      summary:
        "Undergraduate degree in progress focused on algorithms, software engineering, relational databases, and systems architecture.",
      note: "Note: Completed 3 semesters at Cruzeiro do Sul University (started March 2024) before restarting the degree at Faculdade Impacta.",
    },
  ],
};
