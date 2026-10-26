import { useTranslation } from "react-i18next";
import { Atmosphere } from "@/components/Atmosphere";
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
      <Atmosphere />
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
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 px-6 py-8 font-sans text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
          <p>{t("footer.built")}</p>
          <p>© 2026 Gabriel de França Castro</p>
        </div>
      </footer>
    </>
  );
}
