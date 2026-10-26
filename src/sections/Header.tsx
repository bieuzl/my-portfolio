import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLocale, SUPPORTED_LOCALES, type Locale } from "@/i18n";
import { Magnetic } from "@/components/Magnetic";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const NAV_ITEMS = [
  { id: "sobre", key: "nav.about" },
  { id: "habilidades", key: "nav.skills" },
  { id: "projetos", key: "nav.projects" },
  { id: "experiencia", key: "nav.experience" },
  { id: "contato", key: "nav.contact" },
] as const;

function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const active = normalizeLocale(i18n.language);

  return (
    <div
      role="group"
      aria-label={t("a11y.languageSwitcher")}
      className="flex items-center font-mono text-xs"
    >
      {SUPPORTED_LOCALES.map((locale: Locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span className="mx-1 text-muted-foreground" aria-hidden="true">/</span>}
          <button
            type="button"
            aria-pressed={active === locale}
            onClick={() => void i18n.changeLanguage(locale)}
            className={`cursor-pointer px-1.5 py-2 tracking-widest transition-colors duration-200 ${
              active === locale
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {locale === "pt-BR" ? t("language.pt") : t("language.en")}
          </button>
        </span>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const close = useCallback(() => setOpen(false), []);

  /* frosted glass engages only after leaving the hero — Apple-style:
     chrome appears when it's useful, invisible when it's not. The same
     listener feeds the reading-progress hairline under the top edge. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(doc > 0 ? clamp01(window.scrollY / doc) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)] ${
        scrolled || open
          ? "border-border/60 bg-background/75 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-foreground"
      >
        {t("a11y.skipToContent")}
      </a>
      {/* reading progress — gradient hairline tracing the top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5">
        <div
          className="h-full origin-left bg-gradient-to-r from-[#5aa2ff] to-[#38e1ff]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a
          href="#topo"
          className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <Magnetic strength={0.35}>
            gabriel<span className="text-primary">.</span>dev
          </Magnetic>
        </a>

        <nav aria-label={t("a11y.mainNav")} className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="link-line font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </a>
          ))}
          <LanguageSwitch />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch />
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? t("a11y.closeMenu") : t("a11y.openMenu")}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5"
          >
            <span
              aria-hidden="true"
              className={`h-px w-5 bg-foreground transition-transform duration-200 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              aria-hidden="true"
              className={`h-px w-5 bg-foreground transition-transform duration-200 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label={t("a11y.closeMenu")}
            onClick={close}
            className="fixed inset-0 top-16 z-40 cursor-default bg-background/60 md:hidden"
          />
          <nav
            aria-label={t("a11y.mainNav")}
            className="absolute inset-x-0 top-16 z-50 border-b border-border bg-background md:hidden"
          >
            <ul className="mx-auto max-w-6xl px-5 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={close}
                    className="block py-3 font-mono text-sm uppercase tracking-widest text-foreground transition-colors hover:text-primary"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
