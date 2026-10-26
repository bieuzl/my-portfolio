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
        "Meu site pessoal: hero com escultura 3D interativa em tempo real, fundo animado, internacionalização PT/EN e design autoral.",
      contribution:
        "Projetei e desenvolvi toda a aplicação do zero: arquitetura front-end em React e TypeScript, cenas Three.js procedurais com rotação livre em 360°, animações coreografadas, suíte de testes automatizados e deploy contínuo.",
      details: [
        "Renderização 3D procedural com Three.js (WebGL) carregada sob demanda via dynamic import, garantindo carregamento rápido e fallback estático em SVG.",
        "Rotação interativa em 360° nos eixos globais (rotateOnWorldAxis) com física de inércia suave ao arrastar com o mouse ou toque.",
        "Tipografia monumental em duas camadas SVG sincronizadas (preenchimento em gradiente gelo animado + contorno neon azul-ciano com filtro de brilho).",
        "Internacionalização completa (pt-BR / en) com paridade estrutural validada em tempo de compilação e por testes automatizados com Vitest e Testing Library.",
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
      title: "API de Finanças Pessoais",
      context:
        "API REST para gestão de receitas, despesas e metas financeiras, com autenticação segura e visão mensal consolidada.",
      contribution:
        "Modelei o domínio financeiro, implementei os endpoints RESTful, autenticação stateless com JWT, migrações de banco de dados e testes de integração.",
      details: [
        "Arquitetura em camadas com Spring Boot separando regras de negócio, controladores REST, persistência e DTOs de entrada/saída.",
        "Modelagem relacional no PostgreSQL com versionamento de schema e consultas otimizadas para relatórios mensais e consolidação de saldo.",
        "Autenticação e proteção de rotas com Spring Security e tokens JWT, garantindo isolamento completo dos dados de cada usuário.",
        "Validação rigorosa de payloads (Bean Validation) e tratamento global de exceções com respostas padronizadas de erro.",
      ],
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      links: [{ label: "GitHub", href: "https://github.com/bieuzl" }],
      placeholder: false,
    },
    {
      id: "proj-03",
      year: "2025",
      title: "Serviço de Autenticação JWT",
      context:
        "Microsserviço de autenticação e autorização com tokens JWT, refresh tokens e controle de acesso baseado em papéis (RBAC).",
      contribution:
        "Implementei o fluxo completo de emissão, rotação e revogação de tokens, cadastro e login de usuários com hash seguro de senhas e documentação da API.",
      details: [
        "Fluxo de Access Token de curta duração combinado com Refresh Token rotativo para equilibrar segurança e experiência do usuário.",
        "Controle de acesso baseado em papéis (RBAC) com Spring Security para proteger endpoints administrativos e operacionais.",
        "Armazenamento rápido em memória com Redis para invalidação imediata de sessões e controle de tokens revogados.",
        "Criptografia de credenciais com BCrypt e contratos de API claros para integração direta com outros serviços back-end.",
      ],
      technologies: ["Java", "Spring Security", "Redis"],
      links: [{ label: "GitHub", href: "https://github.com/bieuzl" }],
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
