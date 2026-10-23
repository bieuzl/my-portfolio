import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/sections/Hero";

/**
 * Monumental hero contract:
 * - the name renders as two stacked SVG layers (filled + outlined)
 * - exactly one microtext anchors each of the four corners
 * - the 3D layer exposes an accessible description
 */
describe("monumental hero", () => {
  it("renders the name in two SVG layers with per-letter tspans", () => {
    const { container } = render(<Hero />);
    const svgs = container.querySelectorAll("svg text");
    expect(svgs.length).toBe(2);

    const [filled, outline] = svgs;
    const filledLetters = filled.querySelectorAll("tspan");
    const outlineLetters = outline.querySelectorAll("tspan");
    // GABRIEL = 7 letters in each layer
    expect(filledLetters.length).toBe(7);
    expect(outlineLetters.length).toBe(7);

    // filled layer: 4 solid letters (G, B, I, L), none stroked
    const solid = [...filledLetters].filter(
      (t) => (t as SVGTSpanElement).style.fill === "currentcolor" || (t as SVGTSpanElement).style.fill === "currentColor",
    );
    expect(solid.length).toBe(4);
    // outline layer: 3 stroked letters (A, R, E), none filled
    const stroked = [...outlineLetters].filter(
      (t) => (t as SVGTSpanElement).style.stroke === "currentcolor" || (t as SVGTSpanElement).style.stroke === "currentColor",
    );
    expect(stroked.length).toBe(3);
  });

  it("anchors exactly one microtext to each of the four corners", () => {
    const { container } = render(<Hero />);
    const corners = ["specialty", "projects", "name", "contact"];
    for (const corner of corners) {
      const matches = container.querySelectorAll(`[data-corner="${corner}"]`);
      expect(matches.length).toBe(1);
    }
    expect(container.querySelectorAll("[data-corner]").length).toBe(4);
  });

  it("describes the 3D layer for assistive tech and keeps a real h1", () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const scene = container.querySelector('[role="img"]');
    expect(scene).toBeInTheDocument();
    expect(scene?.getAttribute("aria-label")).toMatch(/tecla|keycap/i);
  });

  it("links project and contact corners to their sections", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('[data-corner="projects"]')?.getAttribute("href")).toBe("#projetos");
    expect(container.querySelector('[data-corner="contact"]')?.getAttribute("href")).toBe("#contato");
  });
});
