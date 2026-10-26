import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { useInView } from "@/hooks/useInView";

const CONTACT_CHANNELS = [
  {
    id: "email",
    labelKey: "contact.emailLabel",
    value: "gabrielcastro.dev01@gmail.com",
    href: "mailto:gabrielcastro.dev01@gmail.com",
    external: false,
  },
  {
    id: "linkedin",
    labelKey: "contact.linkedinLabel",
    value: "linkedin.com/in/bieuzl",
    href: "https://www.linkedin.com/in/bieuzl/",
    external: true,
  },
  {
    id: "github",
    labelKey: "contact.githubLabel",
    value: "github.com/bieuzl",
    href: "https://github.com/bieuzl",
    external: true,
  },
] as const;

export function Contact() {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-16">
        <SectionHeading id="contato-titulo" index="05" title={t("sections.contact")} />

        <div ref={ref} className="grid items-start gap-12 md:grid-cols-12">
          <div className={`rv md:col-span-6${inView ? " in-view" : ""}`}>
            <h3 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("contact.lead")}
            </h3>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("contact.body")}
            </p>
          </div>

          <div
            className={`rv grid gap-4 md:col-span-6${inView ? " in-view" : ""}`}
            style={{ "--rv-delay": "120ms" } as React.CSSProperties}
          >
            {CONTACT_CHANNELS.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 backdrop-blur-md transition-all duration-200 ease-out hover:border-white/[0.18] hover:bg-white/[0.06]"
              >
                <div>
                  <span className="block font-sans text-xs font-medium text-muted-foreground">
                    {t(channel.labelKey)}
                  </span>
                  <span className="mt-1 block font-sans text-base font-medium tracking-[-0.01em] text-foreground md:text-lg">
                    {channel.value}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-foreground/80 ring-1 ring-inset ring-white/[0.12] transition-all duration-200 group-hover:bg-foreground group-hover:text-background"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <path
                      d="M4.5 11.5L11.5 4.5M11.5 4.5H5.75M11.5 4.5V10.25"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* footer marquee band */}
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
