import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SceneHandle } from "@/scene3d";
import { getPortfolioContent, type ProjectEntry } from "@/content";
import { normalizeLocale } from "@/i18n";

function ProjectCard({ project, index }: { project: ProjectEntry; index: number }) {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <article
      ref={ref}
      className={`rv grid gap-8 border-t border-border/60 py-12 md:grid-cols-12${inView ? " in-view" : ""}`}
    >
      <div className="md:col-span-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {project.title}
        </h3>
        {project.placeholder && (
          <div className="mt-3">
            <PlaceholderBadge />
          </div>
        )}
      </div>

      <div className="space-y-6 md:col-span-5">
        <div>
          <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("projects.contextLabel")}
          </h4>
          <p className="text-sm leading-relaxed text-foreground/85">{project.context}</p>
        </div>
        <div>
          <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("projects.contributionLabel")}
          </h4>
          <p className="text-sm leading-relaxed text-foreground/85">{project.contribution}</p>
        </div>
      </div>

      <div className="space-y-6 md:col-span-3">
        <div>
          <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("projects.techLabel")}
          </h4>
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("projects.linksLabel")}
          </h4>
          <ul className="space-y-1.5">
            {project.links.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-line font-mono text-xs text-foreground transition-colors hover:text-primary"
                  >
                    {link.label} ↗
                  </a>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    {link.label} · {t("projects.placeholderLink")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const { t, i18n } = useTranslation();
  const { projects } = getPortfolioContent(normalizeLocale(i18n.language));
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SceneHandle | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  /* Small 3D sculpture beside the heading — a detail that moves with the
     page, not a centerpiece. three.js stays off the critical path via
     dynamic import; without WebGL the static ornament simply stays. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void import("@/scene3d").then(({ isWebGLAvailable, mountSculptureScene }) => {
      if (cancelled || !isWebGLAvailable()) return;
      void mountSculptureScene(canvas, { reducedMotion }).then((handle) => {
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

  /* Scroll drives one full extra turn of the knot across the section. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      handleRef.current?.setScroll(progress);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
      id="projetos"
      ref={sectionRef}
      aria-labelledby="projetos-titulo"
      onPointerMove={onPointerMove}
      className="relative border-t border-border/60"
    >
      {/* decorative sculpture — detail beside the heading */}
      <div
        className="pointer-events-none absolute right-5 top-20 z-0 h-36 w-36 opacity-70 md:right-8 md:top-24 md:h-64 md:w-64 md:opacity-100"
        role="img"
        aria-label={t("a11y.projectsScene")}
      >
        {/* static ornament fallback: rotating dashed rings */}
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className={`orbit-spin absolute inset-0 h-full w-full text-primary transition-opacity duration-700 ${
            sceneReady ? "opacity-0" : "opacity-50"
          }`}
        >
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" opacity="0.6" />
        </svg>
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            sceneReady ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
        <SectionHeading id="projetos-titulo" index="03" title={t("sections.projects")} />
        <div>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
