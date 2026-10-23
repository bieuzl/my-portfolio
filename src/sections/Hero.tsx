import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SceneHandle } from "@/scene3d";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";

const POSTER_URL = `${import.meta.env.BASE_URL}models/keycap-poster.svg`;

/** Letters rendered solid (even indices); the rest render as outline only. */
const FILLED_INDICES = new Set([0, 2, 4, 6]);

const LETTER_STAGGER_MS = 40;

interface MonumentWordProps {
  word: string;
  /** "filled" paints solid letters; "outline" paints thick-stroke letters. */
  variant: "filled" | "outline";
  className?: string;
}

/**
 * One layer of the monumental name. Both variants render every glyph so
 * textLength distributes spacing identically — the two layers stack
 * pixel-perfect and the canvas sits between them.
 * SVG text + paint-order keeps the stroke OUTSIDE the glyph (unlike
 * -webkit-text-stroke, which eats the interior and reads "thin").
 */
function MonumentWord({ word, variant, className = "" }: MonumentWordProps) {
  const letters = [...word.toUpperCase()];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
    >
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
    </div>
  );
}

/**
 * Full-viewport hero: monumental name split across two SVG layers with the
 * 3D keycap sandwiched between them, microtexts anchored to the four
 * corners. A static poster shows until the first GPU frame — and
 * permanently when WebGL is unavailable.
 */
export function Hero() {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SceneHandle | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  const name = getPortfolioContent(normalizeLocale(i18n.language)).name;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    /* three.js enters via dynamic import so the ~800KB engine stays off the
       critical path; the poster covers the load window. */
    void import("@/scene3d").then(({ isWebGLAvailable, mountKeycapScene }) => {
      if (cancelled || !isWebGLAvailable()) return;
      void mountKeycapScene(canvas, { reducedMotion }).then((handle) => {
        if (cancelled) {
          handle?.dispose();
          return;
        }
        if (handle) {
          handleRef.current = handle;
          setSceneReady(true);
        }
      });
    });
    return () => {
      cancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleRef.current?.setPointer(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      ((e.clientY - rect.top) / rect.height) * 2 - 1,
    );
  };

  return (
    <section
      id="topo"
      aria-label={t("hero.kicker")}
      onPointerMove={onPointerMove}
      className="relative flex min-h-dvh flex-col overflow-hidden"
    >
      <h1 className="sr-only">
        {name} — {t("hero.role")}
      </h1>

      {/* back layer: solid letters, behind the 3D scene */}
      <MonumentWord word={name} variant="filled" className="z-0" />

      {/* middle layer: poster first, canvas fades in when the scene is live */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        role="img"
        aria-label={t("a11y.heroScene")}
      >
        <div className="absolute left-1/2 top-1/2 h-[46%] w-[min(80vw,560px)] -translate-x-1/2 -translate-y-1/2 max-md:top-[42%] max-md:h-[34%]">
          {/* entrance animation lives on an inner wrapper so its transform
              keyframes never fight the centering translate above */}
          <div className="hero-scene-in relative h-full w-full">
            <img
              src={POSTER_URL}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
                sceneReady ? "opacity-0" : "opacity-90"
              }`}
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
                sceneReady ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* soft ground shadow under the keycap */}
            <div className="absolute -bottom-[8%] left-1/2 h-10 w-[55%] -translate-x-1/2 rounded-[100%] bg-primary/25 blur-2xl" />
          </div>
        </div>
      </div>

      {/* front layer: outlined letters, in front of the 3D scene */}
      <MonumentWord word={name} variant="outline" className="z-20" />

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
        <p className="hero-corner max-w-md text-center text-sm leading-relaxed text-muted-foreground md:text-base" style={{ "--hc-delay": "1350ms" } as React.CSSProperties}>
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
        <span aria-hidden="true" className="h-8 w-px bg-border transition-colors duration-[var(--dur-hover)] group-hover:bg-primary" />
      </a>
    </section>
  );
}
