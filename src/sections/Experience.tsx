import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { useInView } from "@/hooks/useInView";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";

export function Experience() {
  const { t, i18n } = useTranslation();
  const { experience } = getPortfolioContent(normalizeLocale(i18n.language));
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="experiencia" aria-labelledby="experiencia-titulo" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-16">
        <SectionHeading id="experiencia-titulo" index="04" title={t("sections.experience")} />

        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("experience.note")}
        </p>

        <div ref={ref}>
          <ol className="relative space-y-12 border-l border-border pl-8 md:pl-12">
            {experience.map((entry, i) => (
              <li
                key={entry.id}
                className={`rv relative${inView ? " in-view" : ""}`}
                style={{ "--rv-delay": `${i * 110}ms` } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[37px] top-1.5 h-2 w-2 rotate-45 border border-primary bg-background md:-left-[53px]"
                />
                <p className="font-mono text-xs uppercase tracking-widest text-primary">
                  {entry.period}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground md:text-2xl">
                  {entry.role}
                </h3>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{entry.org}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/85">
                  {entry.summary}
                </p>
                {entry.note && (
                  <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground/70 italic">
                    {entry.note}
                  </p>
                )}
                {entry.placeholder && (
                  <div className="mt-3">
                    <PlaceholderBadge />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
