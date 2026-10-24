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

  it("hero renders the monumental word with no 3D dependency", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    // two word layers (filled + outline); helper texts (glyph clip, stroke
    // ring) carry no tspans and don't count as layers
    const wordLayers = [
      ...document.querySelectorAll<SVGTextElement>("svg > text"),
    ].filter((t) => t.querySelectorAll("tspan").length === 7);
    expect(wordLayers.length).toBe(2);
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
