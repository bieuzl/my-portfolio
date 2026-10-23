import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { useInView } from "@/hooks/useInView";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";

export function Skills() {
  const { t, i18n } = useTranslation();
  const { skillGroups } = getPortfolioContent(normalizeLocale(i18n.language));
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
        <SectionHeading id="habilidades-titulo" index="02" title={t("sections.skills")} />

        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("skills.note")} <PlaceholderBadge />
        </p>

        <div ref={ref} className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, gi) => (
            <div
              key={group.id}
              className={`rv${inView ? " in-view" : ""}`}
              style={{ "--rv-delay": `${gi * 90}ms` } as React.CSSProperties}
            >
              <h3 className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground">
                <span aria-hidden="true" className="h-px w-6 bg-primary" />
                {group.label}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
