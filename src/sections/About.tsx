import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { useInView } from "@/hooks/useInView";

export function About() {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
      <SectionHeading id="sobre-titulo" index="01" title={t("sections.about")} />

      <div ref={ref} className="grid gap-10 md:grid-cols-12">
        <p
          className={`rv font-display text-2xl font-medium leading-snug text-foreground md:col-span-7 md:text-3xl${inView ? " in-view" : ""}`}
        >
          {t("about.lead")}
        </p>
        <div
          className={`rv space-y-5 text-base leading-relaxed text-muted-foreground md:col-span-5${inView ? " in-view" : ""}`}
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
    </section>
  );
}
