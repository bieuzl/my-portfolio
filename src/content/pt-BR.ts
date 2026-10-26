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
      id: "proj-ayni-crm",
      year: "Ayni · Em desenvolvimento",
      title: "Ayni CRM",
      subtitle: "Startup Ayni · Primeiro produto do ecossistema",
      startupIntro:
        "A Ayni é uma startup de tecnologia que desenvolve soluções inteligentes para otimizar processos, conectar informações e transformar desafios de negócio em experiências mais eficientes, com o apoio da inteligência artificial. O Ayni CRM marca o início desse ecossistema, que contará com novos projetos e produtos próprios.",
      role: "Desenvolvimento de IA e soluções comerciais: orquestração de agentes inteligentes, automação de canais, prospecção de leads e módulos de propostas e contratos.",
      stackSummary:
        "Tecnologias da plataforma, integração com modelos de IA e ferramentas de automação.",
      team: "2 desenvolvedores · Desenvolvimento colaborativo com agentes de IA.",
      privateRepo: true,
      context:
        "CRM com Inteligência Artificial para profissionais e empresas que vendem serviços de tecnologia. Plataforma que integra gestão comercial, prospecção de leads e agentes inteligentes em um único fluxo.",
      contribution:
        "Atuo diretamente no desenvolvimento da camada de Inteligência Artificial e dos módulos comerciais da plataforma: desde a orquestração de agentes inteligentes autônomos e automação de canais até o fluxo completo de prospecção de leads, geração de propostas e gestão de contratos.",
      details: [
        "Orquestração de agentes inteligentes e fluxos multiagentes para qualificação comercial, acompanhamento de oportunidades e apoio à tomada de decisão.",
        "Automação de canais de comunicação e prospecção ativa de leads, conectando interações diretamente ao funil comercial em tempo real.",
        "Módulos integrados de geração de propostas comerciais e gestão de contratos dentro do próprio fluxo do CRM.",
        "Engenharia colaborativa enxuta (2 desenvolvedores) potencializada por agentes de IA para acelerar ciclos de arquitetura, revisão e entrega.",
      ],
      technologies: [
        "Inteligência Artificial",
        "Agentes Autônomos",
        "Automação de Canais",
        "CRM & Gestão Comercial",
        "Integração com LLMs",
      ],
      links: [],
      placeholder: false,
    },
    {
      id: "proj-financer-ai",
      year: "Em desenvolvimento",
      title: "FinancerAI",
      subtitle: "Controle financeiro inteligente por mensagem",
      role: "Desenvolvimento Back-end completo (arquitetura em Java com Spring Boot, regras de negócio, autenticação JWT, segurança e persistência).",
      stackSummary:
        "React, Node.js (Fastify), Java (Spring Boot), PostgreSQL, Google Gemini",
      team: "3 desenvolvedores",
      privateRepo: false,
      previewImage: "/models/financerai-preview.svg",
      context:
        "Controle financeiro por mensagem: a IA lê frases como “Gastei R$ 50 no Uber” e as transforma em receitas e despesas organizadas por categoria.",
      contribution:
        "Responsável pelo desenvolvimento Back-end completo da plataforma: modelagem das regras de negócio financeiras em Java e Spring Boot, autenticação e autorização com JWT, segurança da API, integração entre serviços e persistência no PostgreSQL.",
      details: [
        "Processamento de linguagem natural com Google Gemini: frases enviadas pelo usuário (como “Gastei R$ 50 no Uber”) são interpretadas e convertidas em transações estruturadas (tipo, valor, categoria e descrição).",
        "Arquitetura distribuída combinando Node.js (Fastify) para mensageria/integrações e Java (Spring Boot) como núcleo das regras de negócio financeiras.",
        "Segurança e controle de acesso com Spring Security e autenticação stateless via tokens JWT.",
        "Persistência relacional em PostgreSQL com categorização automática de receitas e despesas, alimentando o dashboard em React em tempo real.",
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
