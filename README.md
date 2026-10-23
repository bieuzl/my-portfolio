# Portfólio Gabriel

Portfólio pessoal de desenvolvimento de software, com identidade visual própria:
tipografia monumental (Archivo expandida + Inter + JetBrains Mono) com letras
preenchidas e vazadas sobre uma atmosfera viva em WebGL — aurora líquida em
shader (fbm com domain warping), estrelas com paralaxe e paleta que morfa de
azul para índigo/violeta conforme o scroll —, escultura 3D procedural
(nó toroidal, WebGL/Three.js) como detalhe em movimento na seção de projetos,
e paleta escura cinematográfica com acento azul.

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
  components/  Atmosphere (aurora WebGL global + fallback 2D), SectionHeading,
               PlaceholderBadge.
  content/     Dados do portfólio por idioma (pt-BR.ts, en.ts) atrás da
               interface getPortfolioContent(locale). Paridade entre idiomas
               é garantida por tipos + testes.
  i18n/        Configuração i18next e strings de UI (locales/*.json).
  scene3d/     atmosphere.ts (renderer WebGL2 cru da aurora, sem Three.js)
               e mountSculptureScene(canvas, opts), que esconde todo o
               Three.js (shader fresnel, loop, resize, scroll).
  sections/    Hero, About, Skills, Projects, Experience, Contact, Header.
  hooks/       useReducedMotion, useInView.
  test/        Testes de comportamento (idioma, navegação, fallback 3D,
               hero monumental).
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

- **Hero**: nome desenhado duas vezes em SVG (camada preenchida + camada
  vazada, `paint-order: stroke` mantém o traço fora do glifo) sempre 100%
  visível sobre a atmosfera; microtextos ancorados nos quatro cantos.
- **Atmosfera global (WebGL2, sem Three.js)**: fragment shader com fbm e
  domain warping desenha fitas de aurora "líquidas"; duas camadas de estrelas
  cintilantes com paralaxe de scroll; paleta que morfa de azul para
  índigo/violeta ao longo da página; campo que curva suavemente ao redor do
  cursor; boost de fluxo proporcional à velocidade do scroll; renderização em
  0.6× da resolução (upscale via CSS) para custo mínimo de fill-rate. Sem
  WebGL2, uma aurora equivalente em canvas 2D assume. Grão de filme por cima
  evita banding nos gradientes.
- **3D como detalhe**: nó toroidal gerado por código na seção de projetos,
  com ShaderMaterial fresnel grafite→ciano→azul, rotação ambiente somada a
  uma volta extra guiada pelo scroll da seção e parallax de cursor. Three.js
  carrega via import dinâmico (fora do caminho crítico).
- **Fallbacks**: sem WebGL, um ornamento SVG girando substitui a escultura;
  `prefers-reduced-motion` renderiza frame estático e desativa animações CSS.
- **Motion**: coreografia de entrada escalonada (letras, cantos) sobre
  `cubic-bezier(0.16, 1, 0.3, 1)`; header ganha vidro fosco só após o scroll.
- **Acessibilidade**: skip link, navegação por teclado (menu mobile com Esc),
  `aria-label`/`aria-pressed`, h1 real para leitores de tela, contraste ≥ 4.5:1.
- **i18n**: pt-BR padrão; troca PT/EN persistida em localStorage.
