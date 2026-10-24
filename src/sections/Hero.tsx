import { useTranslation } from "react-i18next";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PORTRAIT_DATA_URI } from "@/assets/portrait";

/** Letters rendered solid (even indices); the rest render as outline only. */
const FILLED_INDICES = new Set([0, 2, 4, 6]);

const LETTER_STAGGER_MS = 40;

interface MonumentWordProps {
  word: string;
  /** "filled" paints solid letters; "outline" paints thick-stroke letters. */
  variant: "filled" | "outline";
  /** filled only: drift a light sheen across the gradient (motion-safe). */
  sheen?: boolean;
}

/**
 * One layer of the monumental name. Both variants render every glyph so
 * textLength distributes spacing identically — the two layers stack
 * pixel-perfect. SVG text + paint-order keeps the stroke OUTSIDE the glyph
 * (unlike -webkit-text-stroke, which eats the interior and reads "thin").
 *
 * Finishing, layer by layer:
 * - filled: Bricolage Grotesque 800 with a diagonal ice gradient that a slow
 *   sheen sweeps across (SMIL, skipped under prefers-reduced-motion)
 * - outline: blue→cyan gradient stroke with a blurred neon halo behind it
 *   (a <use> clone, so the glow matches the glyphs exactly), and the "A"
 *   carries Gabriel's portrait — a blue-duotone photo clipped by a clipPath
 *   carved from the glyph shape, with the gradient ring repainted on top
 */
function MonumentWord({ word, variant, sheen = false }: MonumentWordProps) {
  const letters = [...word.toUpperCase()];
  return (
    <svg
      viewBox="0 0 1000 260"
      className="w-[min(94vw,1150px)] select-none"
      role="presentation"
    >
      <defs>
        {variant === "filled" ? (
          <linearGradient id="heroFillGrad" x1="0" y1="0" x2="0.55" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#dcebff" />
            <stop offset="100%" stopColor="#9cc3ff" />
            {sheen && (
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-0.9 0; 0.9 0; -0.9 0"
                keyTimes="0; 0.5; 1"
                dur="12s"
                repeatCount="indefinite"
              />
            )}
          </linearGradient>
        ) : (
          <>
            <linearGradient id="heroStrokeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5aa2ff" />
              <stop offset="100%" stopColor="#38e1ff" />
            </linearGradient>
            {/* portrait clipped by the "A" glyph. Measured in the browser
                (Bricolage 800 @232px, word textLength=960 from x=20): the A
                ink box is x=184.67 y=-17.65 w=167.5 h=278.26 — aspect 0.602,
                ~the photo's 240x400 (0.6), so slice barely crops. A clipPath
                + userSpace image is used instead of an objectBoundingBox
                pattern because Chromium mishandles fractional units on
                <image> inside patterns. Re-measure if word/font changes. */}
            <clipPath id="aGlyphClip">
              <text
                x="268.42"
                y="198"
                textAnchor="middle"
                textLength="167.5"
                lengthAdjust="spacingAndGlyphs"
                style={{
                  fontFamily: "'Bricolage Grotesque', 'Archivo', sans-serif",
                  fontWeight: 800,
                  fontSize: "232px",
                  letterSpacing: "0.005em",
                }}
              >
                A
              </text>
            </clipPath>
            <filter id="heroGlow" x="-15%" y="-30%" width="130%" height="160%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </>
        )}
      </defs>

      {/* neon halo: exact clone of the outline text, blurred underneath */}
      {variant === "outline" && (
        <use href="#heroWordOutline" filter="url(#heroGlow)" opacity="0.38" />
      )}

      <text
        id={variant === "outline" ? "heroWordOutline" : undefined}
        x="500"
        y="198"
        textAnchor="middle"
        textLength="960"
        lengthAdjust="spacingAndGlyphs"
        className={variant === "outline" ? "text-primary" : "text-foreground"}
        style={{
          fontFamily: "'Bricolage Grotesque', 'Archivo', sans-serif",
          fontWeight: 800,
          fontSize: "232px",
          letterSpacing: "0.005em",
        }}
      >
        {letters.map((letter, i) => {
          const active =
            variant === "filled" ? FILLED_INDICES.has(i) : !FILLED_INDICES.has(i);
          const filledActive = variant === "filled" && active;
          const strokedActive = variant === "outline" && active;
          const portraitGlyph = variant === "outline" && letter === "A";
          return (
            <tspan
              key={`${letter}-${i}`}
              className="hero-letter"
              fill={filledActive ? "url(#heroFillGrad)" : "none"}
              stroke={
                strokedActive || portraitGlyph ? "url(#heroStrokeGrad)" : "none"
              }
              strokeWidth={strokedActive || portraitGlyph ? 3.5 : 0}
              style={
                {
                  "--hl-delay": `${200 + i * LETTER_STAGGER_MS}ms`,
                  paintOrder: "stroke",
                } as React.CSSProperties
              }
            >
              {letter}
            </tspan>
          );
        })}
      </text>

      {/* portrait inside the A: photo clipped to the glyph, then the gradient
          stroke repainted on top so the ring stays crisp over the photo */}
      {variant === "outline" && (
        <>
          <image
            href={PORTRAIT_DATA_URI}
            x="184.67"
            y="-17.65"
            width="167.5"
            height="278.26"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#aGlyphClip)"
            aria-hidden="true"
          />
          <text
            x="268.42"
            y="198"
            textAnchor="middle"
            textLength="167.5"
            lengthAdjust="spacingAndGlyphs"
            fill="none"
            stroke="url(#heroStrokeGrad)"
            strokeWidth="3.5"
            aria-hidden="true"
            style={{
              fontFamily: "'Bricolage Grotesque', 'Archivo', sans-serif",
              fontWeight: 800,
              fontSize: "232px",
              letterSpacing: "0.005em",
            }}
          >
            A
          </text>
        </>
      )}
    </svg>
  );
}

/**
 * Full-viewport hero: monumental name floating above the global Atmosphere
 * backdrop, microtexts anchored to the four corners. Nothing overlaps the
 * word — motion lives in the atmosphere, not on top of the typography.
 */
export function Hero() {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();

  const name = getPortfolioContent(normalizeLocale(i18n.language)).name;

  return (
    <section
      id="topo"
      aria-label={t("hero.kicker")}
      className="relative flex min-h-dvh flex-col overflow-hidden"
    >
      <h1 className="sr-only">
        {name} — {t("hero.role")}
      </h1>

      {/* monumental word, fully visible — the two layers stack exactly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="relative">
          <MonumentWord word={name} variant="filled" sheen={!reducedMotion} />
          <div className="absolute inset-0">
            <MonumentWord word={name} variant="outline" />
          </div>
        </div>
      </div>

      {/* corner microtexts — one element per corner, never overlapping */}
      <p
        data-corner="specialty"
        className="hero-corner absolute left-5 top-20 z-30 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:left-8 md:top-24"
        style={{ "--hc-delay": "950ms" } as React.CSSProperties}
      >
        {t("hero.role")}
      </p>
      <a
        data-corner="projects"
        href="#projetos"
        className="hero-corner absolute right-5 top-20 z-30 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-[var(--dur-hover)] hover:text-primary md:right-8 md:top-24"
        style={{ "--hc-delay": "1050ms" } as React.CSSProperties}
      >
        {t("nav.projects")} ↓
      </a>
      <p
        data-corner="name"
        className="hero-corner absolute bottom-6 left-5 z-30 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:bottom-8 md:left-8"
        style={{ "--hc-delay": "1150ms" } as React.CSSProperties}
      >
        {name} — © 2026
      </p>
      <a
        data-corner="contact"
        href="#contato"
        className="hero-corner absolute bottom-6 right-5 z-30 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-[var(--dur-hover)] hover:text-primary md:bottom-8 md:right-8"
        style={{ "--hc-delay": "1250ms" } as React.CSSProperties}
      >
        {t("nav.contact")} ↗
      </a>

      {/* pitch + scroll cue, centered under the composition */}
      <div className="relative z-30 flex flex-1 flex-col items-center justify-end px-5 pb-24">
        <p
          className="hero-corner max-w-md text-center text-sm leading-relaxed text-muted-foreground md:text-base"
          style={{ "--hc-delay": "1350ms" } as React.CSSProperties}
        >
          {t("hero.pitch")}
        </p>
      </div>

      <a
        href="#sobre"
        className="group absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2"
        aria-label={t("a11y.scrollDown")}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-[var(--dur-hover)] group-hover:text-foreground">
          {t("hero.scroll")}
        </span>
        <span
          aria-hidden="true"
          className="h-8 w-px bg-border transition-colors duration-[var(--dur-hover)] group-hover:bg-primary"
        />
      </a>
    </section>
  );
}
