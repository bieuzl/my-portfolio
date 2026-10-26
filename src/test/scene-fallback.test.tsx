import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { isWebGLAvailable } from "@/scene3d";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";

describe("3D sculpture fallback", () => {
  it("detects missing WebGL support (jsdom has none)", () => {
    expect(isWebGLAvailable()).toBe(false);
  });

  it("keeps the static ornament when WebGL is unavailable", () => {
    render(<Projects />);
    // Without WebGL the scene never mounts, so the canvas stays hidden
    // and the rotating SVG ornament carries the detail on its own.
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("opacity-0");
    const ornament = document.querySelector(".orbit-spin");
    expect(ornament).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /projetos/i })).toBeInTheDocument();
  });

  it("hero renders the name and static poster fallback with no 3D dependency", () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(container.textContent).toContain("Gabriel");
    const poster = container.querySelector('img[src="/models/wireframe-poster.svg"]');
    expect(poster).not.toBeNull();
  });
});

describe("reduced motion preference", () => {
  it("reports false when the user has no preference", () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("reports true when prefers-reduced-motion matches", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);

    window.matchMedia = original;
    vi.restoreAllMocks();
  });
});
