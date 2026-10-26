import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SceneHandle } from "@/scene3d";
import { getPortfolioContent, type ProjectEntry } from "@/content";
import { normalizeLocale } from "@/i18n";

function getGithubHref(project: ProjectEntry): string {
  const link = project.links.find((l) => l.href.trim().length > 0);
  return link?.href || "https://github.com/bieuzl";
}

function ProjectCard({
  project,
  index,
  onOpenDetails,
}: {
  project: ProjectEntry;
  index: number;
  onOpenDetails: (project: ProjectEntry, index: number) => void;
}) {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLElement>();
  const githubHref = getGithubHref(project);

  return (
    <article
      ref={ref}
      className={`rv grid items-center gap-8 border-t border-border/60 py-12 md:grid-cols-12${inView ? " in-view" : ""}`}
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

      <div className="space-y-4 md:col-span-5">
        <p className="text-base leading-relaxed text-foreground/85">{project.context}</p>
        <ul className="flex flex-wrap gap-2 pt-1">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border/80 bg-card/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:col-span-3 md:justify-end">
        <button
          type="button"
          onClick={() => onOpenDetails(project, index)}
          className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-primary/45 bg-primary/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors duration-[var(--dur-hover)] hover:border-primary hover:bg-primary/20"
        >
          <span>{t("projects.viewDetails")}</span>
          <span aria-hidden="true" className="text-primary">
            →
          </span>
        </button>

        <a
          href={githubHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-[var(--dur-hover)] hover:border-primary/60 hover:text-foreground"
        >
          <span>{t("projects.viewGithub")}</span>
          <span aria-hidden="true" className="text-primary">
            ↗
          </span>
        </a>
      </div>
    </article>
  );
}

function ProjectDetailsSubpage({
  project,
  index,
  onClose,
}: {
  project: ProjectEntry;
  index: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const githubHref = getGithubHref(project);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-subpage-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border/90 bg-card/95 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior fixa da subpágina com botão X para sair */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/80 bg-card/95 px-6 py-4 backdrop-blur-md md:px-10">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="text-muted-foreground/50">·</span>
            <span>{project.year}</span>
            <span aria-hidden="true" className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">{t("projects.caseStudyBadge")}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("projects.closeDetails")}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/60 font-mono text-base text-muted-foreground transition-colors hover:border-primary hover:bg-primary/15 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo detalhado da subpágina */}
        <div className="space-y-10 px-6 py-8 md:px-10 md:py-10">
          <div>
            <h3
              id="project-subpage-title"
              className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
            >
              {project.title}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-primary/35 bg-primary/10 px-3.5 py-1 font-mono text-xs text-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-8 border-t border-border/60 pt-8 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/40 p-6">
              <h4 className="mb-2.5 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                01 · {t("projects.contextLabel")}
              </h4>
              <p className="text-base leading-relaxed text-foreground/85">
                {project.context}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/40 p-6">
              <h4 className="mb-2.5 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                02 · {t("projects.contributionLabel")}
              </h4>
              <p className="text-base leading-relaxed text-foreground/85">
                {project.contribution}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/40 p-6 md:p-8">
            <h4 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              03 · {t("projects.architectureLabel")}
            </h4>
            <ul className="space-y-4">
              {project.details.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 border-b border-border/40 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="mt-0.5 font-mono text-xs text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85 md:text-base">
                    {step}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-primary/45 bg-primary/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:bg-primary/20"
            >
              <span>{t("projects.viewGithub")}</span>
              <span aria-hidden="true" className="text-primary">
                ↗
              </span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <span>✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
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
  const [activeProject, setActiveProject] = useState<{
    project: ProjectEntry;
    index: number;
  } | null>(null);

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

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-16">
        <SectionHeading id="projetos-titulo" index="03" title={t("sections.projects")} />
        <div>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpenDetails={(proj, idx) => setActiveProject({ project: proj, index: idx })}
            />
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectDetailsSubpage
          project={activeProject.project}
          index={activeProject.index}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  );
}
