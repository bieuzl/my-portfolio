import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { useInView } from "@/hooks/useInView";
import { getPortfolioContent } from "@/content";
import { normalizeLocale } from "@/i18n";

export function Skills() {
  const { t, i18n } = useTranslation();
  const { skillGroups } = getPortfolioContent(normalizeLocale(i18n.language));
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-16">
        <SectionHeading id="habilidades-titulo" index="02" title={t("sections.skills")} />

        <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {t("skills.note")}
        </p>

        <div
          ref={ref}
          className="grid overflow-hidden rounded-xl border border-border/80 bg-card/35 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          {skillGroups.map((group, gi) => (
            <div
              key={group.id}
              className={`rv flex flex-col border-b border-border/70 last:border-b-0 sm:nth-[odd]:border-r sm:nth-[odd]:border-border/70 sm:nth-last-[-n+2]:border-b-0 lg:border-b-0 lg:border-r lg:border-border/70 lg:last:border-r-0${
                inView ? " in-view" : ""
              }`}
              style={{ "--rv-delay": `${gi * 90}ms` } as React.CSSProperties}
            >
              {/* Cabeçalho da coluna na tabela */}
              <div className="border-b border-border/80 bg-primary/[0.07] px-6 py-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                    0{gi + 1}
                  </span>
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary/80" />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  {group.label}
                </h3>
              </div>

              {/* Linhas da tabela */}
              <ul className="flex-1 divide-y divide-border/50">
                {group.items.map((item, ii) => (
                  <li
                    key={item}
                    className="flex items-center justify-between gap-3 px-6 py-4 text-sm text-foreground/85 transition-colors duration-200 hover:bg-primary/[0.05] hover:text-foreground md:text-base"
                  >
                    <span>{item}</span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-[10px] text-muted-foreground/50"
                    >
                      {String(ii + 1).padStart(2, "0")}
                    </span>
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
