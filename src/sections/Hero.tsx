import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { WireframeSceneHandle } from "@/scene3d";

/**
 * Interactive 3D wireframe sculpture positioned on the right column of the Hero.
 * Three.js arrives via dynamic import; the pointer steers parallax and dragging
 * rotates the structure freely in 360°. Without WebGL the static poster
 * (public/models/wireframe-poster.svg) remains visible.
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
      className="hero-corner order-2 flex flex-col items-center md:justify-self-end"
      style={{ "--hc-delay": "320ms" } as React.CSSProperties}
    >
      <div className="relative aspect-square w-[min(80vw,380px)] shrink-0 md:w-[clamp(420px,42vw,640px)]">
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
 * Full-viewport hero with a two-column split layout:
 * - Left: greeting ("Olá, eu sou"), name ("Gabriel de França Castro") in clean
 *   white typography, developer role, and tagline.
 * - Right: interactive 3D wireframe sculpture.
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
        {name} {t("hero.surname")} — {t("hero.role")}
      </h1>

      <div className="relative z-20 mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center gap-12 px-6 pb-24 pt-28 md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:px-12 lg:px-16">
        {/* Left column: Greeting + Name + Role + Tagline */}
        <div
          className="hero-corner order-1 flex flex-col items-center text-center md:items-start md:text-left"
          style={{ "--hc-delay": "180ms" } as React.CSSProperties}
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground md:text-[13px]">
            {t("hero.greeting1")} {t("hero.greeting2")}
          </p>

          <div
            aria-hidden="true"
            className="mt-3"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
          >
            <span className="block text-6xl font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-7xl lg:text-[88px]">
              {name}
            </span>
            <span className="mt-1.5 block text-2xl font-medium tracking-[-0.02em] text-white/85 sm:text-3xl lg:text-[34px]">
              {t("hero.surname")}
            </span>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-foreground/90 md:text-xs">
              {t("hero.role")}
            </p>
          </div>

          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-[17px]">
            {t("hero.tagline")}
          </p>
        </div>

        {/* Right column: Interactive 3D sculpture */}
        <HeroWireframe />
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
