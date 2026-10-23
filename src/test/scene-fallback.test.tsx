import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { isWebGLAvailable } from "@/scene3d";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Hero } from "@/sections/Hero";

describe("3D hero fallback", () => {
  it("detects missing WebGL support (jsdom has none)", () => {
    expect(isWebGLAvailable()).toBe(false);
  });

  it("keeps the static poster visible when WebGL is unavailable", () => {
    render(<Hero />);
    // Without WebGL the scene never mounts, so the poster must stay up —
    // the page never shows a black canvas.
    const posters = document.querySelectorAll("img");
    expect(posters.length).toBeGreaterThan(0);
    expect(posters[0].getAttribute("src")).toContain("keycap-poster.svg");
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("opacity-0");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
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
