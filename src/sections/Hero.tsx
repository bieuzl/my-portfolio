import { useTranslation } from "react-i18next";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";

/** Letters rendered solid (even indices); the rest render as outline only. */
const FILLED_INDICES = new Set([0, 2, 4, 6]);

const LETTER_STAGGER_MS = 40;

interface MonumentWordProps {
  word: string;
  /** "filled" paints solid letters; "outline" paints thick-stroke letters. */
  variant: "filled" | "outline";
}

/**
 * One layer of the monumental name. Both variants render every glyph so
 * textLength distributes spacing identically — the two layers stack
 * pixel-perfect. SVG text + paint-order keeps the stroke OUTSIDE the glyph
 * (unlike -webkit-text-stroke, which eats the interior and reads "thin").
 */
function MonumentWord({ word, variant }: MonumentWordProps) {
  const letters = [...word.toUpperCase()];
  return (
    <svg
      viewBox="0 0 1000 260"
      className="w-[min(94vw,1150px)] select-none"
      role="presentation"
    >
      <text
        x="500"
        y="198"
        textAnchor="middle"
        textLength="960"
        lengthAdjust="spacingAndGlyphs"
        className={variant === "outline" ? "text-primary" : "text-foreground"}
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontStretch: "125%",
          fontWeight: 900,
          fontSize: "228px",
          letterSpacing: "0.01em",
        }}
      >
        {letters.map((letter, i) => {
          const active =
            variant === "filled" ? FILLED_INDICES.has(i) : !FILLED_INDICES.has(i);
          return (
            <tspan
              key={`${letter}-${i}`}
              className="hero-letter"
              style={
                {
                  "--hl-delay": `${200 + i * LETTER_STAGGER_MS}ms`,
                  fill: active ? (variant === "filled" ? "currentColor" : "none") : "none",
                  stroke: active && variant === "outline" ? "currentColor" : "none",
                  strokeWidth: 4,
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
          <MonumentWord word={name} variant="filled" />
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
