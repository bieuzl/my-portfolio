import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { useInView } from "@/hooks/useInView";

const PENDING_CHANNELS = ["E-mail", "GitHub", "LinkedIn"];

export function Contact() {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
        <SectionHeading id="contato-titulo" index="05" title={t("sections.contact")} />

        <div ref={ref} className="grid gap-10 md:grid-cols-12">
          <h3
            className={`rv font-display text-4xl font-semibold leading-tight tracking-tight text-foreground md:col-span-7 md:text-6xl${inView ? " in-view" : ""}`}
          >
            {t("contact.lead")}
          </h3>
          <div
            className={`rv space-y-6 md:col-span-5${inView ? " in-view" : ""}`}
            style={{ "--rv-delay": "120ms" } as React.CSSProperties}
          >
            <p className="text-base leading-relaxed text-muted-foreground">{t("contact.body")}</p>
            <div className="border border-dashed border-border p-5">
              <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground">
                {t("contact.pendingTitle")}
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {t("contact.pendingBody")}
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {PENDING_CHANNELS.map((channel) => (
                  <li key={channel} className="font-mono text-xs text-muted-foreground">
                    {channel} <span aria-hidden="true" className="text-primary">·</span>{" "}
                    <span className="text-muted-foreground/70">—</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* email-marquee style footer band */}
      <div className="marquee border-t border-border/60 py-6" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="mx-6 font-display text-2xl font-light text-muted-foreground/60 md:text-4xl"
                >
                  {t("contact.marquee")}
                  <span className="ml-12 text-primary">↗</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
