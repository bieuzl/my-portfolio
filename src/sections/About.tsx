import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ABOUT_PORTRAIT_URI } from "@/assets/about-portrait";

/**
 * Apresentação — retrato editorial + texto.
 *
 * A foto real do Gabriel é encaixada no quadro 3:4 sem filtros de cor,
 * emoldurada numa composição técnica: um "A" fantasma atrás (eco do hero),
 * moldura deslocada, anel de gradiente que se desenha por cima (mesmas cores
 * de heroStrokeGrad) e um tilt sutil ao passar o mouse. A coreografia de
 * entrada (clip wipe + ring draw) dispara via useInView e é neutralizada sob
 * prefers-reduced-motion (ver index.css).
 */
export function About() {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();
  const reducedMotion = useReducedMotion();
  const tiltRef = useRef<HTMLElement | null>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion || event.pointerType !== "mouse") return;
      const el = tiltRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const rx = (-py * 4.5).toFixed(2);
      const ry = (px * 5.5).toFixed(2);
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    },
    [reducedMotion],
  );

  const onPointerLeave = useCallback(() => {
    const el = tiltRef.current;
    if (el) el.style.transform = "";
  }, []);

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-titulo"
      className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36"
    >
      <SectionHeading id="sobre-titulo" index="01" title={t("sections.about")} />

      <div
        ref={ref}
        className={`grid items-center gap-12 md:grid-cols-12 md:gap-10${
          inView ? " in-view" : ""
        }`}
      >
        {/* retrato editorial */}
        <div
          className="relative mx-auto w-full max-w-[340px] [perspective:1000px] md:col-span-5 md:max-w-[400px]"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          {/* "A" fantasma — eco tipográfico do hero */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-32 z-0 h-[320px] w-[320px] text-primary opacity-[0.22] md:-left-28 md:-top-40 md:h-[400px] md:w-[400px]"
            viewBox="0 0 420 460"
          >
            <text
              x="210"
              y="392"
              textAnchor="middle"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                fontFamily: "'Geist', 'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "400px",
              }}
            >
              A
            </text>
          </svg>

          {/* moldura deslocada */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3.5 translate-y-3.5 border border-primary/25"
          />

          <figure
            ref={tiltRef}
            className="about-portrait-tilt relative z-10 m-0"
          >
            <div className="about-portrait-frame relative aspect-[3/4] overflow-hidden bg-card shadow-[0_30px_80px_-20px_rgba(56,140,255,0.25)]">
              <img
                src={ABOUT_PORTRAIT_URI}
                alt={t("about.portraitAlt")}
                width={396}
                height={528}
                loading="lazy"
                decoding="async"
                className="about-portrait-img h-full w-full object-cover"
              />
              {/* anel de gradiente por cima da foto — mesmas cores do hero */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 3 4"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="aboutRingGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5aa2ff" />
                    <stop offset="100%" stopColor="#38e1ff" />
                  </linearGradient>
                </defs>
                <rect
                  x="0.02"
                  y="0.02"
                  width="2.96"
                  height="3.96"
                  fill="none"
                  stroke="url(#aboutRingGrad)"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  className="about-portrait-ring"
                />
              </svg>
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>{t("about.portraitCaption")}</span>
              <span className="text-primary/70">gabriel.dev</span>
            </figcaption>
          </figure>
        </div>

        {/* texto */}
        <div className="md:col-span-7">
          <p
            className={`rv font-display text-2xl font-medium leading-snug text-foreground md:text-3xl${
              inView ? " in-view" : ""
            }`}
          >
            {t("about.lead")}
          </p>
          <div
            className={`rv mt-8 space-y-5 text-base leading-relaxed text-muted-foreground${
              inView ? " in-view" : ""
            }`}
            style={{ "--rv-delay": "120ms" } as React.CSSProperties}
          >
            <p>{t("about.body")}</p>
            <div className="border-l-2 border-primary pl-4">
              <h3 className="mb-1 font-mono text-xs uppercase tracking-widest text-foreground">
                {t("about.lookingForTitle")}
              </h3>
              <p>{t("about.lookingFor")}</p>
            </div>
            <PlaceholderBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
