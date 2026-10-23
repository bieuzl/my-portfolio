import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LetterReveal } from "@/components/LetterReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SceneHandle } from "@/scene3d";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";

const POSTER_URL = `${import.meta.env.BASE_URL}models/capybara-poster.png`;

/**
 * Full-viewport hero: iridescent low-poly capybara as centerpiece,
 * massive stacked serif type on the left, pitch on the right.
 * A static poster shows until the first GPU frame — and permanently
 * when WebGL is unavailable or the model fails to load.
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
    void import("@/scene3d").then(({ isWebGLAvailable, mountCapybaraScene }) => {
      if (cancelled || !isWebGLAvailable()) return;
      void mountCapybaraScene(canvas, { reducedMotion }).then((handle) => {
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
      {/* 3D layer: poster first, canvas fades in when the scene is live */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={POSTER_URL}
          alt=""
          className={`absolute right-0 top-1/2 h-[62%] -translate-y-1/2 object-contain transition-opacity duration-700 max-md:left-1/2 max-md:right-auto max-md:h-[38%] max-md:-translate-x-1/2 ${
            sceneReady ? "opacity-0" : "opacity-70 max-md:opacity-40"
          }`}
        />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            sceneReady ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* soft ground shadow under the sculpture */}
        <div className="absolute bottom-[12%] right-[8%] h-24 w-[42%] rounded-[100%] bg-black/60 blur-3xl max-md:left-1/2 max-md:right-auto max-md:w-[70%] max-md:-translate-x-1/2" />
        {/* mobile legibility: dim the scene behind the copy */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/40 to-transparent md:hidden" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-24 pt-28 md:px-8 md:pb-16">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {t("hero.kicker")}
        </p>
        <h1 className="font-display font-light leading-[0.95] tracking-tight">
          <LetterReveal
            text={name.toUpperCase()}
            className="block text-[clamp(3.5rem,14vw,11rem)]"
            stagger={45}
          />
          <span className="mt-2 block text-[clamp(1.4rem,4.5vw,3.2rem)] italic text-muted-foreground">
            <LetterReveal text={t("hero.role")} delay={450} stagger={18} />
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-6 md:mt-14 md:max-w-md md:self-end md:text-right">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("hero.pitch")}
          </p>
        </div>
      </div>

      <a
        href="#sobre"
        className="group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2"
        aria-label={t("a11y.scrollDown")}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-foreground">
          {t("hero.scroll")}
        </span>
        <span aria-hidden="true" className="h-8 w-px bg-border transition-colors group-hover:bg-primary" />
      </a>
    </section>
  );
}
