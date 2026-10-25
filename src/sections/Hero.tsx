import { useTranslation } from "react-i18next";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LETTER_STAGGER_MS = 40;

interface MonumentWordProps {
  word: string;
  /** "filled" paints solid letters; "outline" paints the electric rim. */
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
 * - filled: Archivo 800 Expanded — a professional, editorial grotesque —
 *   with a diagonal ice gradient that a slow sheen sweeps across (SMIL,
 *   skipped under prefers-reduced-motion); every letter solid, one continuous
 *   monument
 * - outline: blue→cyan gradient stroke tracing every glyph, with a blurred
 *   neon halo behind it (a <use> clone, so the glow matches the glyphs
 *   exactly)
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
          fontFamily: "'Archivo', 'Inter', sans-serif",
          fontWeight: 800,
          fontStretch: "125%",
          fontSize: "232px",
          letterSpacing: "0.005em",
        }}
      >
        {letters.map((letter, i) => {
          const filledLayer = variant === "filled";
          return (
            <tspan
              key={`${letter}-${i}`}
              className="hero-letter"
              fill={filledLayer ? "url(#heroFillGrad)" : "none"}
              stroke={filledLayer ? "none" : "url(#heroStrokeGrad)"}
              strokeWidth={filledLayer ? 0 : 3.5}
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
