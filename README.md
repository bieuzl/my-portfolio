# Gabriel de França Castro — Portfólio

Portfólio pessoal de desenvolvimento de software com foco em **Back-end (Java & Spring Boot)**, **APIs REST**, **bancos de dados relacionais (PostgreSQL)** e **aplicações com Inteligência Artificial**.

---

## Visão Geral

O projeto foi construído em **React 19 + TypeScript + Vite**, combinando tipografia editorial, atmosfera procedural em **WebGL2** e elementos **3D interativos em Three.js**, com suporte bilíngue (**Português / Inglês**) e documentação técnica detalhada de cada projeto em subpáginas dedicadas.

### Projetos em Destaque

- **Ayni CRM** *(Startup Ayni · Em desenvolvimento)* — Plataforma de CRM com Inteligência Artificial voltada para profissionais e empresas que comercializam serviços de tecnologia. Atuação nos módulos de orquestração de agentes (`Atlas` e `Astas`), canais de atendimento, prospecção e propostas comerciais com **TypeScript, React, Supabase, PostgreSQL (RLS), Deno Edge Functions e Zod**.
- **[FinancerAI](https://github.com/EzequielMags/FinancerAI)** *(Em desenvolvimento)* — Plataforma full-stack de controle financeiro pessoal por mensagens em linguagem natural. Atuação no desenvolvimento completo do back-end principal em **Java 17 e Spring Boot** (`Spring Security`, autenticação stateless com **JWT** e `BCrypt`, `Spring Data JPA`, regras de negócio e persistência em **PostgreSQL**), integrado ao microsserviço de IA em **Node.js (Fastify) + Google Gemini API**.

---

## Stack do Portfólio

- **Front-end:** React 19, TypeScript, React Router, Tailwind CSS
- **Gráficos & 3D:** Three.js (geometria facetada interativa em 360° no Hero e estrutura modular 3D na seção de projetos) + WebGL2 custom shader (`atmosphere.ts`) com fallback automático em Canvas 2D e SVG
- **Internacionalização:** `i18next` e `react-i18next` (`pt-BR` e `en`) com paridade estrutural verificada por tipos e testes automatizados
- **Qualidade & Testes:** Vitest, Testing Library (`@testing-library/react`), ESLint e TypeScript (`tsc -b`)

---

## Estrutura do Projeto

```text
src/
  assets/       Retrato otimizado da seção Sobre mim
  components/   Atmosphere (shader WebGL2 + fallback 2D), Magnetic, SectionHeading
  content/      Dados estruturados do portfólio (pt-BR.ts, en.ts, types.ts)
  hooks/        useInView, useMagnetic, useReducedMotion
  i18n/         Configuração i18next e dicionários de interface (pt-BR.json, en.json)
  pages/        Home
  scene3d/      WireframeScene (Hero 3D), SculptureScene (Projetos 3D), atmosphere.ts
  sections/     Header, Hero, About, Skills, Projects, Experience, Contact
  test/         Suíte de testes automatizados (Vitest + Testing Library)
```

---

## Como Executar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:3000)
npm run dev

# Executar suíte de testes
npm test

# Gerar build de produção
npm run build
```

---

## Contato

- **E-mail:** [gabrielcastro.dev01@gmail.com](mailto:gabrielcastro.dev01@gmail.com)
- **LinkedIn:** [linkedin.com/in/bieuzl](https://www.linkedin.com/in/bieuzl/)
- **GitHub:** [github.com/bieuzl](https://github.com/bieuzl)
