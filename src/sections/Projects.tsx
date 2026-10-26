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
      className={`rv grid items-start gap-10 border-t border-border/60 py-14 md:grid-cols-12${inView ? " in-view" : ""}`}
    >
      <div className="md:col-span-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-sans text-xs font-medium text-primary ring-1 ring-inset ring-primary/25">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            {project.year}
          </span>
        </div>

        <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {project.title}
        </h3>

        {project.subtitle && (
          <p className="mt-1.5 font-sans text-sm text-muted-foreground">
            {project.subtitle}
          </p>
        )}

        {project.placeholder && (
          <div className="mt-3">
            <PlaceholderBadge />
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenDetails(project, index)}
            className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 font-sans text-[14px] font-medium tracking-[-0.01em] text-background transition-all duration-200 ease-out hover:bg-foreground/90 active:scale-[0.98]"
          >
            <span>{t("projects.viewDetails")}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            >
              <path
                d="M6 3.5L10.5 8 6 12.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {project.privateRepo ? (
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.04] px-4 font-sans text-[13px] font-medium tracking-[-0.01em] text-muted-foreground ring-1 ring-inset ring-white/[0.1]">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80"
              >
                <rect
                  x="3.25"
                  y="7.25"
                  width="9.5"
                  height="6.5"
                  rx="1.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5.25 7.25V5a2.75 2.75 0 0 1 5.5 0v2.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>{t("projects.privateRepo")}</span>
            </span>
          ) : (
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.06] px-5 font-sans text-[14px] font-medium tracking-[-0.01em] text-foreground/90 ring-1 ring-inset ring-white/[0.14] backdrop-blur-md transition-all duration-200 ease-out hover:bg-white/[0.12] hover:text-foreground hover:ring-white/[0.24] active:scale-[0.98]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 shrink-0 text-foreground/85 transition-colors group-hover:text-foreground"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              <span>{t("projects.viewGithub")}</span>
            </a>
          )}
        </div>
      </div>

      <div className="space-y-6 md:col-span-8">
        <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">
          {project.context}
        </p>

        {/* Informações estruturadas e simples na tela principal */}
        <div className="grid gap-4 rounded-2xl border border-border/70 bg-card/30 p-5 sm:grid-cols-3">
          <div>
            <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              {t("projects.roleLabel")}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.role}
            </p>
          </div>

          <div>
            <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              {t("projects.stackLabel")}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.stackSummary}
            </p>
          </div>

          <div>
            <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              {t("projects.teamLabel")}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.team}
            </p>
          </div>
        </div>

        {project.previewImage && (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)]">
            <img
              src={project.previewImage}
              alt={`${project.title} — Gastei R$ 50 no Uber`}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        )}
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
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/[0.08] text-foreground/80 ring-1 ring-inset ring-white/[0.12] transition-all duration-200 ease-out hover:bg-white/[0.16] hover:text-foreground active:scale-95"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path
                d="M4 4l8 8m0-8l-8 8"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
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
                  className="rounded-full bg-white/[0.06] px-3.5 py-1 font-sans text-xs font-medium text-foreground/90 ring-1 ring-inset ring-white/[0.12]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {project.startupIntro && (
            <div className="rounded-xl border border-primary/30 bg-primary/[0.06] p-6 md:p-7">
              <h4 className="mb-2.5 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {t("projects.startupLabel")}
              </h4>
              <p className="text-base leading-relaxed text-foreground/90">
                {project.startupIntro}
              </p>
            </div>
          )}

          {project.previewImage && (
            <div className="overflow-hidden rounded-xl border border-border/80 bg-background/60">
              <img
                src={project.previewImage}
                alt={`${project.title} — Gastei R$ 50 no Uber`}
                className="w-full object-cover"
              />
            </div>
          )}

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
            {project.privateRepo ? (
              <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.04] px-5 font-sans text-[14px] font-medium tracking-[-0.01em] text-muted-foreground ring-1 ring-inset ring-white/[0.1]">
                <span>{t("projects.privateRepo")}</span>
              </span>
            ) : (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-foreground px-6 font-sans text-[14px] font-medium tracking-[-0.01em] text-background transition-all duration-200 ease-out hover:bg-foreground/90 active:scale-[0.98]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
                <span>{t("projects.viewGithub")}</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-white/[0.06] px-6 font-sans text-[14px] font-medium tracking-[-0.01em] text-foreground/90 ring-1 ring-inset ring-white/[0.14] transition-all duration-200 ease-out hover:bg-white/[0.12] hover:text-foreground active:scale-[0.98]"
            >
              <span>Fechar</span>
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
