import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { useInView } from "@/hooks/useInView";
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

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
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
