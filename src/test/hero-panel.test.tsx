import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/sections/Hero";

/**
 * Hero em painel central (referência visual enviada pelo usuário):
 * - painel preto com saudação + especialidade à esquerda, nome à direita
 * - escultura cristalina 3D ao centro (canvas com rótulo acessível)
 * - barra de navegação inferior com links reais para as seções
 * - h1 semântico preservado; o Atmosphere global continua sendo o fundo
 */
describe("hero em painel central", () => {
  it("mantém um h1 real e renderiza saudação, especialidade e nome", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Olá, eu sou")).toBeInTheDocument();
    expect(screen.getAllByText("Desenvolvedor de Software").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gabriel").length).toBeGreaterThan(0);
  });

  it("monta o canvas da escultura com rótulo acessível", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("aria-label");
  });

  it("tem barra de navegação inferior com links funcionais", () => {
    const { container } = render(<Hero />);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
    const hrefs = [...nav!.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("#sobre");
    expect(hrefs).toContain("#projetos");
    expect(hrefs).toContain("#contato");
  });

  it("usa o painel preto sem tocar no fundo global", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector(".bg-black")).toBeInTheDocument();
    // nenhuma imagem raster ou background próprio substituindo o Atmosphere
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg image")).toBeNull();
  });
});
