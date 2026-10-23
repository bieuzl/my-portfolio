# Portfólio Gabriel

Portfólio pessoal de desenvolvimento de software, com identidade visual própria:
capivara low-poly em 3D (WebGL/Three.js) como peça central, tipografia editorial
(Fraunces + Space Grotesk + JetBrains Mono) e paleta escura com acento vermelho.

## Executar

```bash
npm install
npm run dev      # desenvolvimento (porta 3000)
npm run build    # build de produção em dist/
npm run preview  # serve o build
npm test         # suíte de testes (Vitest + Testing Library)
npm run lint     # ESLint
```

## Estrutura

```
src/
  content/     Dados do portfólio por idioma (pt-BR.ts, en.ts) atrás da
               interface getPortfolioContent(locale). Paridade entre idiomas
               é garantida por tipos + testes.
  i18n/        Configuração i18next e strings de UI (locales/*.json).
  scene3d/     Módulo 3D: mountCapybaraScene(canvas, opts) esconde todo o
               Three.js (renderer, shader iridescente, loop, resize).
  sections/    Hero, About, Skills, Projects, Experience, Contact, Header.
  hooks/       useReducedMotion, useInView.
  test/        Testes de comportamento (idioma, navegação, fallback 3D).
```

## Conteúdo pendente (placeholders)

Todo texto entre `[colchetes]` e marcado como "Conteúdo de exemplo" deve ser
substituído. Edite `src/content/pt-BR.ts` e `src/content/en.ts` (dados
estruturados) e `src/i18n/locales/*.json` (textos de interface):

1. **Hero/Apresentação**: pitch de 2–3 frases, parágrafos da bio e o que procura.
2. **Habilidades**: substituir os grupos e itens de exemplo.
3. **Projetos**: título, ano, contexto, contribuição, tecnologias e links
   (preencher `href` ativa o link; vazio renderiza "Link a definir").
4. **Experiência**: períodos, cargos, organizações e resumos.
5. **Contato**: e-mail, GitHub, LinkedIn — hoje exibidos como texto inerte
   até que os dados reais sejam fornecidos.

## Técnicas

- **3D**: modelo GLB gerado por IA (7.9k triângulos, 246 KB) em
  `public/models/capybara.glb`, renderizado com ShaderMaterial iridescente
  (fresnel índigo→violeta→rosa), rotação ambiente em dois eixos e parallax de
  cursor. Three.js carrega via import dinâmico (fora do caminho crítico).
- **Fallbacks**: pôster estático (`capybara-poster.png`) antes do primeiro
  frame, na ausência de WebGL ou falha de carregamento; `prefers-reduced-motion`
  renderiza um único frame estático e desativa animações CSS.
- **Acessibilidade**: skip link, navegação por teclado (menu mobile com Esc),
  `aria-label`/`aria-pressed`, foco visível, contraste ≥ 4.5:1.
- **i18n**: pt-BR padrão; troca PT/EN persistida em localStorage.
