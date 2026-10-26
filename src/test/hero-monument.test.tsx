import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/sections/Hero";

/**
 * Monumental hero contract:
 * - the name renders as two stacked SVG layers (filled + outlined)
 * - exactly one microtext anchors each of the four corners
 * - the only canvas is the decorative, aria-hidden wireframe sculpture —
 *   the global Atmosphere (rendered at page root) remains the only backdrop
 */
describe("monumental hero", () => {
  it("renders the name in two SVG layers with per-letter tspans", () => {
    const { container } = render(<Hero />);
    const wordLayers = [
      ...container.querySelectorAll<SVGTextElement>("svg > text"),
    ].filter((t) => t.querySelectorAll("tspan").length === 7);
    expect(wordLayers.length).toBe(2);

    const [filled, outline] = wordLayers;
    const filledLetters = filled.querySelectorAll("tspan");
    const outlineLetters = outline.querySelectorAll("tspan");
    // GABRIEL = 7 letters in each layer
    expect(filledLetters.length).toBe(7);
    expect(outlineLetters.length).toBe(7);

    // filled layer: all 7 letters solid with the ice gradient fill
    const solid = [...filledLetters].filter((t) =>
      (t.getAttribute("fill") ?? "").includes("url("),
    );
    expect(solid.length).toBe(7);
    // outline layer: all 7 letters traced with the gradient stroke
    const stroked = [...outlineLetters].filter((t) =>
      (t.getAttribute("stroke") ?? "").includes("url("),
    );
    expect(stroked.length).toBe(7);
  });

  it("is pure typography — no raster media embedded in the monument", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("svg image")).toBeNull();
    expect(container.querySelector("clipPath")).toBeNull();

    // every outline-layer letter: transparent fill + gradient stroke
    const outline = [
      ...container.querySelectorAll<SVGTextElement>("svg > text"),
    ].filter((t) => t.querySelectorAll("tspan").length === 7)[1];
    for (const tspan of outline.querySelectorAll("tspan")) {
      expect(tspan.getAttribute("fill")).toBe("none");
      expect(tspan.getAttribute("stroke")).toContain("url(");
    }
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

  it("keeps a real h1 and only the decorative wireframe as canvas", () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    // the wireframe canvas is decorative: aria-hidden, keyboard-out, no role=img
    const canvases = container.querySelectorAll("canvas");
    expect(canvases.length).toBe(1);
    expect(canvases[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(canvases[0]?.hasAttribute("data-wireframe")).toBe(true);
    expect(container.querySelector('[role="img"]')).not.toBeInTheDocument();
  });

  it("links project and contact corners to their sections", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('[data-corner="projects"]')?.getAttribute("href")).toBe("#projetos");
    expect(container.querySelector('[data-corner="contact"]')?.getAttribute("href")).toBe("#contato");
  });
});
