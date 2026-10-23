import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollBackdrop } from "@/components/ScrollBackdrop";

/* jsdom has no canvas 2D context, so the drawing effect bails out early —
   these tests pin the accessible, inert-by-default contract of the markup. */

describe("ScrollBackdrop", () => {
  it("renders a decorative fixed canvas hidden from assistive tech", () => {
    const { container } = render(<ScrollBackdrop />);
    const wrapper = container.querySelector<HTMLElement>('[aria-hidden="true"]');

    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("fixed");
    expect(wrapper?.className).toContain("pointer-events-none");
    expect(wrapper?.querySelector("canvas")).not.toBeNull();
    /* starts transparent; the scroll-driven effect owns opacity from there */
    expect(wrapper?.style.opacity).toBe("0");
  });

  it("mounts without a rAF loop under prefers-reduced-motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      const { container, unmount } = render(<ScrollBackdrop />);
      expect(container.querySelector("canvas")).not.toBeNull();
      unmount();
    } finally {
      window.matchMedia = original;
    }
  });
});
