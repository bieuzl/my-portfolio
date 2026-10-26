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
      subtitle: "Startup Ayni · Primeiro produto · Em desenvolvimento",
      role: "Módulos de IA, canais de atendimento, prospecção de leads e propostas/contratos.",
      stackSummary:
        "TypeScript · React · Supabase · PostgreSQL · Row Level Security (RLS) · Deno Edge Functions · Zod",
      team: "2 desenvolvedores",
      privateRepo: true,
      context:
        "CRM em desenvolvimento para profissionais e empresas que vendem serviços de tecnologia. Reúne funil comercial, prospecção de leads, geração de propostas e assistentes de IA com aprovação humana para ações sensíveis.",
      contribution:
        "Sou responsável pelo desenvolvimento dos módulos de Inteligência Artificial e operações comerciais da plataforma.",
      details: [],
      subpageSections: [
        {
          heading: "Sobre o produto",
          paragraphs: [
            "A Ayni é uma startup que está desenvolvendo um CRM com Inteligência Artificial voltado para profissionais e empresas que vendem serviços de tecnologia.",
            "Seu primeiro produto, o Ayni CRM, foi pensado para organizar o processo comercial em um único ambiente. A proposta é reduzir tarefas manuais de prospecção e acompanhamento, centralizar o histórico dos contatos e facilitar a passagem de um potencial cliente até a contratação.",
            "O MVP tem foco inicial em freelancers, web designers e pequenos estúdios que comercializam sites, landing pages e identidades digitais.",
          ],
        },
        {
          heading: "Como funciona",
          paragraphs: [
            "O fluxo começa pela identificação de potenciais clientes. A plataforma foi planejada para permitir buscas por nicho, analisar informações de sites e organizar dados relevantes para a abordagem comercial.",
            "A partir daí, os contatos podem ser acompanhados pelo CRM, com etapas de negociação, atividades e histórico. Os assistentes de IA Atlas e Astas participam desse processo, ajudando na interação com leads e na execução de tarefas comerciais.",
            "A plataforma também prevê recursos para criar briefings, consultar modelos de sites, gerar prompts e preparar propostas comerciais. Quando chega o momento da contratação, o cliente pode aceitar uma proposta por um link público e o processo de contrato pode ser integrado ao ZapSign.",
          ],
          callout: {
            boldPrefix: "A IA não atua sem limites:",
            text: "ações sensíveis, como decisões relacionadas a preços, propostas, contratos e prospecção, passam por um fluxo de aprovação humana definido na arquitetura do produto.",
          },
        },
        {
          heading: "Minha atuação",
          paragraphs: [
            "Sou responsável pelo desenvolvimento dos módulos de Inteligência Artificial e operações comerciais da plataforma.",
          ],
          items: [
            {
              title: "AI Orchestration — Atlas e Astas",
              body: "Estruturação da comunicação entre os assistentes, roteamento de solicitações, histórico de conversas e transferência do atendimento para uma pessoa quando necessário. A arquitetura também prevê uma fila de aprovação humana para ações sensíveis e o uso de fontes de conhecimento.",
            },
            {
              title: "Channels — Canais de atendimento",
              body: "Desenvolvimento do módulo planejado para conectar o CRM a canais externos, incluindo um widget de chat incorporável em sites, gestão de sessões, registro de eventos de e-mail e controle de opt-out para respeitar solicitações de não recebimento de mensagens.",
            },
            {
              title: "Prospecting — Prospecção inteligente",
              body: "Desenvolvimento de recursos para busca de potenciais clientes por nicho, diagnóstico técnico de sites, criação de briefings e acesso a um catálogo de modelos e protótipos. O módulo também contempla a geração de prompts personalizados pelo Atlas a partir das informações do lead.",
            },
            {
              title: "Proposals & Contracts — Propostas e contratos",
              body: "Desenvolvimento da estrutura de documentos comerciais, templates, versionamento de propostas, aceite por link público e integração prevista com o ZapSign para assinatura de contratos.",
            },
          ],
        },
        {
          heading: "Arquitetura e decisões técnicas",
          paragraphs: [
            "A plataforma segue uma arquitetura modular, na qual cada área possui responsabilidades definidas e se comunica por contratos compartilhados.",
            "Um princípio importante é o isolamento entre os módulos de IA e o núcleo do CRM: os módulos de IA não devem escrever diretamente nas tabelas comerciais. Alterações devem passar por funções de serviço disponibilizadas pelo núcleo, mantendo as regras de negócio centralizadas.",
            "A documentação também prevê isolamento dos dados por workspace com Row Level Security (RLS), validação de estruturas com Zod e uso de Edge Functions em Deno para operações executadas no ambiente do Supabase.",
          ],
        },
        {
          heading: "Tecnologias",
          items: [
            {
              title: "Stack documentada no projeto",
              body: "TypeScript · React · Supabase · PostgreSQL · Row Level Security (RLS) · Deno Edge Functions · Zod",
            },
          ],
        },
        {
          heading: "Equipe e desenvolvimento",
          paragraphs: [
            "Projeto desenvolvido por uma equipe de dois desenvolvedores, com divisão de responsabilidades entre o núcleo da plataforma e os módulos de IA e operações comerciais.",
          ],
          items: [
            {
              title: "Status",
              body: "Em desenvolvimento. As funcionalidades descritas representam o escopo definido para o MVP; a disponibilidade de cada recurso depende do estágio de implementação.",
            },
            {
              title: "Código-fonte",
              body: "Repositório privado.",
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
