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
        "My personal website: a hero with a real-time 3D sculpture, animated backdrop, PT/EN internationalization and autoral design — the very site you are browsing now.",
      contribution:
        "I designed and built everything: front-end architecture, procedural Three.js scenes, animations, automated tests and deployment.",
      technologies: ["React", "TypeScript", "Three.js", "Tailwind CSS"],
      links: [
        { label: "Demo", href: "" },
        { label: "Repository", href: "https://github.com/bieuzl/my-portfolio" },
      ],
      placeholder: false,
    },
    {
      id: "proj-02",
      year: "2025",
      title: "Personal Finance API",
      context:
        "REST API to organize income, expenses and goals, with authentication and a consolidated monthly view. A personal project to go deeper into the Spring ecosystem.",
      contribution:
        "I modeled the domain, implemented the endpoints, JWT authentication, database migrations and the integration test suite.",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      links: [{ label: "Repository", href: "" }],
      placeholder: false,
    },
    {
      id: "proj-03",
      year: "2025",
      title: "JWT Authentication Service",
      context:
        "Authentication and authorization service with JWT tokens, refresh tokens and role-based access control, designed to be reused across other projects.",
      contribution:
        "I implemented token issuing and validation, user signup and login, and the endpoint documentation.",
      technologies: ["Java", "Spring Security", "Redis"],
      links: [{ label: "Repository", href: "" }],
      placeholder: false,
    },
  ],
  skillGroups: [
    {
      id: "sg-languages",
      label: "Languages",
      items: ["Java", "TypeScript", "SQL"],
      placeholder: false,
    },
    {
      id: "sg-frontend",
      label: "Front-end",
      items: ["React", "Tailwind CSS", "Semantic HTML"],
      placeholder: false,
    },
    {
      id: "sg-backend",
      label: "Back-end and data",
      items: ["Spring Boot", "REST APIs", "PostgreSQL", "Redis"],
      placeholder: false,
    },
    {
      id: "sg-tooling",
      label: "Tooling and practices",
      items: ["Git", "Docker", "Automated tests", "CI/CD"],
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
