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
      id: "proj-01",
      year: "2026",
      title: "gabriel.dev — personal portfolio",
      context:
        "My personal website: a hero with a real-time interactive 3D sculpture, animated backdrop, PT/EN internationalization and custom editorial design.",
      contribution:
        "I designed and built the entire application from scratch: React and TypeScript front-end architecture, procedural Three.js scenes with 360° free rotation, choreographed animations, automated tests and continuous deployment.",
      details: [
        "Procedural 3D rendering with Three.js (WebGL) loaded on demand via dynamic import, ensuring fast initial load and a static SVG fallback.",
        "Interactive 360° world-axis rotation (rotateOnWorldAxis) with smooth momentum inertia on mouse or touch drag.",
        "Monumental dual-layer SVG typography (animated ice-gradient fill + blue-cyan neon stroke with glow filter).",
        "Full internationalization (pt-BR / en) with compile-time structural parity and automated test suites using Vitest and Testing Library.",
      ],
      technologies: ["React", "TypeScript", "Three.js", "Tailwind CSS"],
      links: [
        { label: "GitHub", href: "https://github.com/bieuzl/my-portfolio" },
      ],
      placeholder: false,
    },
    {
      id: "proj-02",
      year: "2025",
      title: "Personal Finance API",
      context:
        "REST API for managing income, expenses and financial goals, featuring secure authentication and consolidated monthly reporting.",
      contribution:
        "I modeled the financial domain, implemented the RESTful endpoints, stateless JWT authentication, database migrations and integration tests.",
      details: [
        "Layered Spring Boot architecture cleanly separating business rules, REST controllers, persistence and input/output DTOs.",
        "Relational data modeling in PostgreSQL with schema versioning and optimized queries for monthly reports and balance consolidation.",
        "Route protection and authentication with Spring Security and JWT tokens, ensuring strict data isolation per user.",
        "Strict payload validation (Bean Validation) and centralized exception handling with standardized error responses.",
      ],
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      links: [{ label: "GitHub", href: "https://github.com/bieuzl" }],
      placeholder: false,
    },
    {
      id: "proj-03",
      year: "2025",
      title: "JWT Authentication Service",
      context:
        "Authentication and authorization microservice with JWT tokens, refresh tokens and role-based access control (RBAC).",
      contribution:
        "I implemented the full token issuing, rotation and revocation lifecycle, user registration and login with secure password hashing, and API documentation.",
      details: [
        "Short-lived Access Token flow paired with rotating Refresh Tokens to balance security and user experience.",
        "Role-based access control (RBAC) with Spring Security to guard administrative and operational endpoints.",
        "Fast in-memory storage with Redis for immediate session invalidation and revoked token tracking.",
        "BCrypt credential hashing and clean API contracts designed for seamless integration with other back-end services.",
      ],
      technologies: ["Java", "Spring Security", "Redis"],
      links: [{ label: "GitHub", href: "https://github.com/bieuzl" }],
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
      id: "exp-01",
      period: "2025 — present",
      role: "Back-end Developer",
      org: "Personal projects and freelance work",
      summary:
        "I design and implement APIs in Java with Spring Boot — data modeling, authentication, tests and containerized deployment — and maintain this portfolio as a technical showcase.",
      placeholder: false,
    },
    {
      id: "exp-02",
      period: "2024 — 2025",
      role: "Software Developer",
      org: "Applied studies and hands-on projects",
      summary:
        "I went deeper into back-end fundamentals — HTTP, relational databases, messaging — by building complete projects instead of isolated examples.",
      placeholder: false,
    },
    {
      id: "exp-03",
      period: "2024",
      role: "Software development education",
      org: "Courses and certifications",
      summary:
        "Java, Spring Boot, SQL and Git tracks, always closing each module with a practical project.",
      placeholder: false,
    },
  ],
};
