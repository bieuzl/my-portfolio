import { useTranslation } from "react-i18next";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Contact } from "@/sections/Contact";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>{t("footer.built")}</p>
          <p>{t("footer.placeholderNotice")}</p>
        </div>
      </footer>
    </>
  );
}
