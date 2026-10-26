import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { CrystalHandle } from "@/scene3d";

/**
 * Hero — painel preto central sobre o Atmosphere (que permanece intacto).
 * Composição inspirada na referência: saudação + especialidade à esquerda,
 * escultura cristalina 3D ao centro, nome à direita; indicadores discretos
 * no topo e barra de navegação minimalista na base do painel. No mobile a
 * composição empilha verticalmente, sem sobreposições.
 */
export function Hero() {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<CrystalHandle | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  const name = getPortfolioContent(normalizeLocale(i18n.language)).name;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void import("@/scene3d").then(({ isWebGLAvailable, mountCrystalScene }) => {
      if (cancelled || !isWebGLAvailable()) return;
      void mountCrystalScene(canvas, { reducedMotion }).then((handle) => {
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
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-24 md:px-8"
    >
      <h1 className="sr-only">
        {name} — {t("hero.role")}
      </h1>

      {/* painel central */}
      <div className="hero-corner flex w-full max-w-6xl flex-col border border-white/10 bg-black shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* indicadores superiores */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 text-xs md:px-7">
          <span className="font-medium text-foreground">
            {name} <span className="align-super text-[9px]">®</span>
          </span>
          <span className="hidden rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:block">
            {t("hero.role")}
          </span>
          <a
            href="#contato"
            className="link-line text-muted-foreground transition-colors duration-[var(--dur-hover)] hover:text-foreground"
          >
            {t("nav.contact")} ↗
          </a>
        </div>

        {/* composição principal: textos laterais + escultura */}
        <div className="grid flex-1 items-center gap-8 px-6 py-8 text-center md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-10 md:py-6 md:text-left">
          <div className="hero-corner md:justify-self-start">
            <p className="font-display text-3xl font-medium uppercase leading-[1.08] text-foreground md:text-4xl lg:text-5xl">
              {t("hero.greeting")}
            </p>
            <p className="mt-2 font-display text-xl font-light uppercase leading-snug text-foreground/90 md:text-2xl">
              {t("hero.role")}
            </p>
            <p className="mx-auto mt-5 max-w-xs text-xs leading-relaxed text-muted-foreground md:mx-0 md:text-sm">
              {t("hero.pitch")}
            </p>
          </div>

          <div
            className="relative mx-auto h-[240px] w-[220px] md:h-[380px] md:w-[300px] lg:h-[430px] lg:w-[340px]"
            role="img"
            aria-label={t("a11y.heroScene")}
          >
            {/* fallback estático: silhueta da escultura em traço azul-gelo */}
            <svg
              viewBox="-2 -2.1 4 4.2"
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full text-primary/70 transition-opacity duration-700 ${
                sceneReady ? "opacity-0" : "opacity-60"
              }`}
            >
              {[1, -1].map((sign) => (
                <path
                  key={sign}
                  d="M 0.3 1.55 L 1.25 1.85 Q 1.5 0 1.25 -1.85 L 0.3 -1.55 Q 0.85 0 0.3 1.55 Z"
                  transform={`scale(${sign} 1)`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.02"
                />
              ))}
            </svg>
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
                sceneReady ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          <div className="hero-corner md:justify-self-end md:text-right">
            <p className="font-display text-3xl font-medium uppercase leading-[1.08] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {name}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              gabriel.dev
            </p>
          </div>
        </div>

        {/* barra de navegação inferior */}
        <nav
          aria-label={t("a11y.mainNav")}
          className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-white/10 px-5 py-4 md:px-7"
        >
          <span className="text-[11px] text-muted-foreground md:text-xs">
            {t("hero.personalPortfolio")} © 2026
          </span>
          <div className="flex items-center gap-6 text-xs md:text-sm">
            <a
              href="#sobre"
              className="link-line text-foreground/85 transition-colors duration-[var(--dur-hover)] hover:text-foreground"
            >
              {t("nav.about")}
            </a>
            <a
              href="#projetos"
              className="link-line text-foreground/85 transition-colors duration-[var(--dur-hover)] hover:text-foreground"
            >
              {t("nav.projects")}
            </a>
          </div>
          <a
            href="#contato"
            className="rounded-full border border-white/25 px-4 py-1.5 text-xs text-foreground transition-colors duration-[var(--dur-hover)] hover:border-white/60 hover:bg-white/5"
          >
            {t("nav.contact")}
          </a>
        </nav>
      </div>

      <a
        href="#sobre"
        className="hero-corner group mt-8 flex cursor-pointer flex-col items-center gap-2"
        aria-label={t("a11y.scrollDown")}
        style={{ "--hc-delay": "900ms" } as React.CSSProperties}
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
