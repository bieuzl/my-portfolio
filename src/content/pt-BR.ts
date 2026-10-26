import type { PortfolioContent } from "./types";

/**
 * Conteúdo em português — informações profissionais do Gabriel.
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
    },
    {
      id: "proj-financer-ai",
      year: "Em desenvolvimento",
      title: "FinancerAI",
      subtitle: "Controle financeiro inteligente por mensagem · Em desenvolvimento",
      role: "Back-end em Java e Spring Boot: regras de negócio, autenticação JWT, segurança e persistência no PostgreSQL.",
      stackSummary:
        "Java 17 · Spring Boot · Spring Security · Spring Data JPA · PostgreSQL · Node.js (Fastify) · React · Google Gemini API",
      team: "3 desenvolvedores",
      privateRepo: false,
      previewImage: "/models/financerai-preview.svg",
      context:
        "Controle financeiro por mensagem: a IA lê frases como “Gastei R$ 50 no Uber” enviadas pelo WhatsApp e as transforma em receitas e despesas organizadas por categoria.",
      contribution:
        "Responsável pelo desenvolvimento do módulo back-end em Java 17 e Spring Boot (backend-java): arquitetura em camadas, regras de negócio financeiras, autenticação JWT com Spring Security e persistência no PostgreSQL.",
      details: [],
      subpageSections: [
        {
          heading: "Sobre o produto",
          paragraphs: [
            "O FinancerAI é uma plataforma de controle financeiro que utiliza Inteligência Artificial para automatizar o registro de receitas, despesas e geração de relatórios diretamente pelo WhatsApp.",
            "A proposta é permitir que o usuário registre suas movimentações financeiras em linguagem natural no dia a dia, sem precisar preencher planilhas ou formulários manuais.",
          ],
        },
        {
          heading: "Como funciona",
          paragraphs: [
            "O usuário envia uma mensagem simples no WhatsApp, como “Gastei R$ 50 no Uber” ou “Recebi R$ 500 pela criação de um site”.",
            "O serviço de integração recebe a mensagem e aciona o modelo de IA (Google Gemini) para interpretar o texto e extrair estruturadamente o tipo da movimentação (receita ou despesa), o valor, a descrição e a categoria.",
            "Em seguida, a API principal em Java e Spring Boot valida as regras de negócio, persiste a transação no PostgreSQL e disponibiliza os dados atualizados para visualização em tempo real no dashboard em React.",
          ],
        },
        {
          heading: "Minha atuação",
          paragraphs: [
            "Sou responsável pelo desenvolvimento do módulo back-end em Java e Spring Boot (backend-java), que concentra as regras de negócio, a segurança e a persistência de dados da plataforma.",
          ],
          items: [
            {
              title: "Arquitetura em camadas — Java 17 e Spring Boot",
              body: "Estruturação do módulo backend-java separando responsabilidades entre controller (requisições HTTP/JSON), service (regras de negócio e validações), repository (acesso a dados), entity (mapeamento JPA), dto e config.",
            },
            {
              title: "Autenticação JWT e Segurança — Spring Security",
              body: "Implementação do fluxo de autenticação e autorização com tokens JWT, proteção de rotas da API e validação das credenciais de acesso ao painel.",
            },
            {
              title: "Regras de Negócio e Persistência — Spring Data JPA & PostgreSQL",
              body: "Modelagem das entidades financeiras e de usuários no PostgreSQL, validação de dados com Bean Validation e criação dos endpoints REST consumidos pelos demais serviços.",
            },
          ],
        },
        {
          heading: "Arquitetura e decisões técnicas",
          paragraphs: [
            "O sistema adota uma arquitetura distribuída em serviços especializados: o serviço em Node.js (Fastify) cuida da comunicação com o WhatsApp (Baileys) e da integração com a API do Google Gemini, enquanto o serviço em Java (Spring Boot) atua como o núcleo central das regras de negócio e integridade dos dados.",
            "Essa separação mantém o domínio financeiro isolado e protegido em uma API fortemente tipada em Java, com persistência relacional no PostgreSQL e consumo direto pelo front-end em React.",
          ],
        },
        {
          heading: "Tecnologias",
          items: [
            {
              title: "Stack documentada no repositório",
              body: "Java 17 · Spring Boot · Spring Security · Spring Data JPA · JWT · PostgreSQL · Node.js (Fastify) · Google Gemini API · React · Docker",
            },
          ],
        },
        {
          heading: "Equipe e desenvolvimento",
          paragraphs: [
            "Projeto desenvolvido por uma equipe de 3 desenvolvedores, com divisão clara entre o back-end Java/Spring Boot, o serviço de integrações Node.js/IA e o dashboard front-end em React.",
          ],
          items: [
            {
              title: "Status",
              body: "Em desenvolvimento.",
            },
            {
              title: "Repositório no GitHub",
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
      label: "Desenvolvimento Back-end",
      items: [
        "Java",
        "Spring Boot",
        "APIs REST",
        "Regras de negócio",
        "Arquitetura de aplicações",
      ],
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
    },
    {
      id: "exp-rocketseat",
      period: "Outubro de 2026",
      role: "Formação em Desenvolvimento de Software",
      org: "Rocketseat",
      summary:
        "Formação prática focada em Java, Spring Boot, criação de APIs REST, modelagem de banco de dados e testes.",
    },
    {
      id: "exp-impacta",
      period: "Agosto de 2026",
      role: "Análise e Desenvolvimento de Sistemas (1º semestre)",
      org: "Faculdade Impacta",
      summary:
        "Graduação em andamento com foco em algoritmos, engenharia de software, bancos de dados relacionais e arquitetura de sistemas.",
      note: "Obs.: Cursei 3 semestres na Cruzeiro do Sul (início em março de 2024) e reiniciei a graduação na Faculdade Impacta.",
    },
  ],
};
