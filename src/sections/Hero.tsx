import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { WireframeSceneHandle } from "@/scene3d";

const LETTER_STAGGER_MS = 40;

interface MonumentWordProps {
  word: string;
  /** "filled" paints solid letters; "outline" paints the electric rim. */
  variant: "filled" | "outline";
  /** filled only: drift a light sheen across the gradient (motion-safe). */
  sheen?: boolean;
  className?: string;
}

/**
 * One layer of the monumental name — a calligraphic script signature in Great Vibes.
 * Both variants render every glyph so the two layers stack pixel-perfect.
 * SVG text + paint-order keeps the stroke OUTSIDE the glyph (unlike
 * -webkit-text-stroke, which eats the interior and reads "thin").
 *
 * Finishing, layer by layer:
 * - filled: Great Vibes with a diagonal ice gradient that a slow sheen
 *   sweeps across (SMIL, skipped under prefers-reduced-motion) — every
 *   letter solid, one continuous calligraphic signature
 * - outline: blue→cyan gradient stroke tracing every glyph, with a blurred
 *   neon halo behind it (a <use> clone, so the glow matches the glyphs
 *   exactly)
 */
function MonumentWord({ word, variant, sheen = false, className = "w-[min(94vw,1150px)]" }: MonumentWordProps) {
  const letters = [...word];
  return (
    <svg
      viewBox="0 0 1000 300"
      className={`${className} select-none overflow-visible`}
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
        y="205"
        textAnchor="middle"
        className={variant === "outline" ? "text-primary" : "text-foreground"}
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontWeight: 400,
          fontSize: "240px",
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
 * Wireframe sculpture at the center of the composition — an irregular
 * polyhedron of fine blue/cyan edges with glowing vertices (inspired by
 * referencia1.jpg's crystal, reinterpreted as pure geometry). three.js
 * arrives via dynamic import, the pointer steers parallax, and poking the
 * sculpture kicks its spin. Without WebGL the static poster
 * (public/models/wireframe-poster.svg) stays in its place.
 */
function HeroWireframe() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<WireframeSceneHandle | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void import("@/scene3d").then(({ isWebGLAvailable, mountWireframeScene }) => {
      if (cancelled || !isWebGLAvailable()) return;
      void mountWireframeScene(canvas, { reducedMotion }).then((handle) => {
        if (cancelled) {
          handle?.dispose();
          return;
        }
        if (handle) {
          handleRef.current = handle;
          setLive(true);
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

  useEffect(() => {
    if (reducedMotion) return;
    const onPointer = (e: PointerEvent) => {
      handleRef.current?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, [reducedMotion]);

  return (
    <div
      className="hero-corner order-2 w-[min(76vw,360px)] shrink-0 md:w-[clamp(390px,36vw,610px)]"
      style={{ "--hc-delay": "1450ms" } as React.CSSProperties}
    >
      <div className="relative aspect-square">
        {/* Subtle radial depth backlight behind the 3D sculpture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.13)_0%,rgba(30,64,175,0.05)_50%,transparent_75%)] blur-2xl"
        />
        <img
          src="/models/wireframe-poster.svg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-700${live ? " opacity-0" : ""}`}
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-wireframe
          className={`relative h-full w-full cursor-grab touch-none transition-opacity duration-700 active:cursor-grabbing${live ? "" : " opacity-0"}`}
        />
      </div>
      <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {t("hero.wireframeHint")}
      </p>
    </div>
  );
}

/**
 * Full-viewport hero composed like the reference: greeting and short bio on
 * the left, the wireframe sculpture as the protagonist in the center, the
 * name stacked on the right — all floating above the global Atmosphere
 * backdrop.
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

      {/* reference composition: text — wireframe sculpture — name.
          Grid 1fr/auto/1fr on md+ keeps both side columns exactly equal, so
          the sculpture sits at the true center of the viewport. */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center gap-10 px-6 pb-24 pt-24 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:px-12 lg:px-16">
        {/* left: greeting + profession, like the reference's intro block */}
        <div
          className="hero-corner order-1 max-w-sm text-center md:justify-self-start md:text-left"
          style={{ "--hc-delay": "1350ms" } as React.CSSProperties}
        >
          <p className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("hero.greeting1")}
            <br />
            {t("hero.greeting2")}
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:text-xs">
            {t("hero.role")}
          </p>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground md:mx-0">
            {t("hero.tagline")}
          </p>
        </div>

        {/* center: the protagonist */}
        <HeroWireframe />

        {/* right: name + surname signature stacked */}
        <div
          className="hero-corner order-3 flex flex-col items-center md:items-end md:justify-self-end"
          style={{ "--hc-delay": "1550ms" } as React.CSSProperties}
        >
          <div aria-hidden="true" className="relative">
            <MonumentWord
              word={name}
              variant="filled"
              sheen={!reducedMotion}
              className="w-[min(72vw,340px)] lg:w-[min(30vw,420px)]"
            />
            <div className="absolute inset-0">
              <MonumentWord
                word={name}
                variant="outline"
                className="w-[min(72vw,340px)] lg:w-[min(30vw,420px)]"
              />
            </div>
          </div>
          {/* surname as a signature — calligraphic script, slightly tilted */}
          <p
            className="mt-1 text-3xl font-normal text-foreground md:text-4xl"
            style={{ fontFamily: "'Great Vibes', cursive", transform: "rotate(-2deg)" }}
          >
            {t("hero.surname")}
          </p>
        </div>
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
