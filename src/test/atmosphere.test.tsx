import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Atmosphere } from "@/components/Atmosphere";

/* jsdom exposes neither WebGL nor a 2D canvas context, so both render paths
   bail out early — these tests pin the accessible, inert markup contract. */

describe("Atmosphere", () => {
  it("renders a fixed decorative canvas hidden from assistive tech", () => {
    const { container } = render(<Atmosphere />);
    const wrapper = container.querySelector<HTMLElement>('[aria-hidden="true"]');

    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("fixed");
    expect(wrapper?.className).toContain("-z-10");
    expect(wrapper?.className).toContain("pointer-events-none");
    expect(wrapper?.querySelector("canvas")).not.toBeNull();
  });

  it("mounts and unmounts cleanly under prefers-reduced-motion", () => {
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
      const { container, unmount } = render(<Atmosphere />);
      expect(container.querySelector("canvas")).not.toBeNull();
      unmount();
    } finally {
      window.matchMedia = original;
    }
  });
});
