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
      subtitle: "Startup Ayni · Primeiro produto em construção",
      startupIntro:
        "A Ayni é uma startup em fase de construção criada por dois desenvolvedores. O Ayni CRM é o primeiro produto da empresa, voltado para organizar a operação comercial de quem vende serviços de tecnologia, do primeiro contato ao contrato assinado.",
      role: "Módulos de IA, canais de atendimento, prospecção de leads e propostas/contratos.",
      stackSummary:
        "TypeScript, React, Supabase (PostgreSQL, RLS, Edge Functions / Deno), Zod",
      team: "2 desenvolvedores",
      privateRepo: true,
      context:
        "CRM em desenvolvimento para profissionais e empresas que vendem serviços de tecnologia. Reúne funil comercial, prospecção de leads, geração de propostas e assistentes de IA com aprovação humana para ações sensíveis.",
      contribution:
        "Sou responsável por quatro módulos da plataforma (ai, channels, prospecting e proposals): orquestração dos assistentes Atlas e Astas com fila de aprovação humana, base de conhecimento, widget de chat para sites, disparo de e-mails, diagnóstico automático de sites para prospecção e geração versionada de propostas e contratos.",
      details: [
        "Módulo de IA (ai): execução de conversas, histórico de mensagens, handoffs, fila de aprovação humana (ai_approvals) para ações sensíveis (preço, proposta, contrato e prospecção) e fontes de conhecimento.",
        "Módulo de Canais (channels): widget de chat embarcável em sites externos, controle de sessões, registro de eventos de e-mail e gestão global de opt-out.",
        "Módulo de Prospecção (prospecting): buscas com filtros salvos, diagnóstico técnico de sites de potenciais clientes, briefings por nicho e geração de protótipos.",
        "Módulo de Propostas e Contratos (proposals): templates de documentos, versionamento de propostas comerciais, geração de contratos e rastreamento de eventos.",
        "Isolamento multi-tenant no PostgreSQL via Row Level Security (RLS) por workspace, schemas validados com Zod no pacote compartilhado (@ayni/shared) e Edge Functions em Deno.",
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
      year: "Em desenvolvimento",
      title: "FinancerAI",
      subtitle: "Registro de receitas e despesas por mensagem",
      role: "Back-end em Java e Spring Boot: regras de negócio, autenticação JWT, segurança e persistência no PostgreSQL.",
      stackSummary:
        "Java 17, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, Node.js (Fastify), React, Google Gemini API",
      team: "3 desenvolvedores",
      privateRepo: false,
      previewImage: "/models/financerai-preview.svg",
      context:
        "Sistema de controle financeiro em desenvolvimento: o usuário envia mensagens como “Gastei R$ 50 no Uber” pelo WhatsApp e a aplicação registra receitas e despesas classificadas por categoria.",
      contribution:
        "Atuo no desenvolvimento do back-end em Java 17 e Spring Boot (módulo backend-java). Estruturei a arquitetura em camadas (controller, service, repository, entity, dto e config), a persistência no PostgreSQL com Spring Data JPA, a validação de payloads e a configuração de segurança e autenticação JWT com Spring Security.",
      details: [
        "Serviço em Node.js (Fastify) recebe as mensagens do WhatsApp e consulta a API do Google Gemini para extrair valor, tipo da transação, descrição e categoria.",
        "API em Java 17 e Spring Boot 4 centraliza as regras de negócio financeiras, o cadastro de usuários e as validações de entrada (Bean Validation).",
        "Autenticação stateless com tokens JWT e controle de acesso configurados no Spring Security.",
        "Persistência relacional no PostgreSQL via Spring Data JPA, fornecendo os dados consolidados para o dashboard em React.",
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
      id: "exp-ayni",
      period: "2026",
      role: "Desenvolvedor Back-end & IA",
      org: "Ayni · Startup de Tecnologia",
      summary:
        "Desenvolvimento dos módulos de IA, canais, prospecção e propostas do Ayni CRM utilizando TypeScript, React, Supabase (PostgreSQL com RLS) e Edge Functions.",
      placeholder: false,
    },
    {
      id: "exp-rocketseat",
      period: "Outubro de 2026",
      role: "Formação em Desenvolvimento de Software",
      org: "Rocketseat",
      summary:
        "Formação prática focada em Java, Spring Boot, criação de APIs REST, modelagem de banco de dados e testes.",
      placeholder: false,
    },
    {
      id: "exp-impacta",
      period: "Agosto de 2026",
      role: "Análise e Desenvolvimento de Sistemas (1º semestre)",
      org: "Faculdade Impacta",
      summary:
        "Graduação em andamento com foco em algoritmos, engenharia de software, bancos de dados relacionais e arquitetura de sistemas.",
      note: "Obs.: Cursei 3 semestres na Cruzeiro do Sul (início em março de 2024) e reiniciei a graduação na Faculdade Impacta.",
      placeholder: false,
    },
  ],
};
