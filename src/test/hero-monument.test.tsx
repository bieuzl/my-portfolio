import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/sections/Hero";

/**
 * Hero contract:
 * - Left column presents greeting, white typographic name + surname, role, and tagline
 * - Right column renders the interactive, aria-hidden 3D wireframe sculpture canvas
 * - No corner microtexts clutter the viewport
 */
describe("hero section", () => {
  it("renders the name and surname in clean white typography", () => {
    const { container } = render(<Hero />);
    expect(container.textContent).toContain("Gabriel");
    expect(container.textContent).toContain("de França Castro");
  });

  it("keeps the hero corners clean with no corner microtexts", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll("[data-corner]").length).toBe(0);
  });

  it("keeps a real h1 and only the decorative wireframe as canvas", () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const canvases = container.querySelectorAll("canvas");
    expect(canvases.length).toBe(1);
    expect(canvases[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(canvases[0]?.hasAttribute("data-wireframe")).toBe(true);
    expect(container.querySelector('[role="img"]')).not.toBeInTheDocument();
  });

  it("renders the tagline below the developer role", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Do conceito ao código, criando o que vem a seguir\./i),
    ).toBeInTheDocument();
  });
});
