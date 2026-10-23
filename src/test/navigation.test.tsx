import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import i18n from "@/i18n";
import Home from "@/pages/Home";

describe("navigation integrity", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("pt-BR");
  });

  it("every in-page nav anchor points at an existing section id", () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const anchors = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]'),
    );
    expect(anchors.length).toBeGreaterThanOrEqual(5);

    for (const anchor of anchors) {
      const id = anchor.getAttribute("href")!.slice(1);
      expect(
        container.querySelector(`#${CSS.escape(id)}`),
        `nav anchor #${id} has no matching section`,
      ).not.toBeNull();
    }
  });

  it("exposes a skip link to the main content", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    const skip = screen.getByRole("link", { name: "Pular para o conteúdo" });
    expect(skip).toHaveAttribute("href", "#conteudo");
  });
});
