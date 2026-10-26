import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@/i18n";
import { About } from "@/sections/About";

/**
 * About portrait contract:
 * - the real photo ships as an inline JPEG data URI with localized alt text
 * - a gradient ring (hero stroke colors) is painted over the frame
 * - a ghost "A" echoes the hero typography behind the portrait
 * - the caption row carries the localized mono caption
 */
describe("about portrait", () => {
  it("renders the portrait as an inline JPEG with localized alt", () => {
    const { container } = render(<About />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toContain("data:image/jpeg;base64,");
    expect(img?.getAttribute("alt")).toContain("Gabriel");
  });

  it("paints the gradient ring over the frame with the hero stroke colors", () => {
    const { container } = render(<About />);
    const ring = container.querySelector("rect.about-portrait-ring");
    expect(ring).not.toBeNull();
    expect(ring?.getAttribute("stroke")).toBe("url(#aboutRingGrad)");

    const grad = container.querySelector("#aboutRingGrad");
    const stops = [...(grad?.querySelectorAll("stop") ?? [])].map((s) =>
      s.getAttribute("stop-color"),
    );
    expect(stops).toEqual(["#5aa2ff", "#38e1ff"]);
  });

  it("echoes the hero with a stroked ghost A behind the portrait", () => {
    const { container } = render(<About />);
    const ghost = [...container.querySelectorAll("svg text")].find(
      (node) => node.textContent === "A",
    );
    expect(ghost).toBeTruthy();
    expect(ghost?.getAttribute("fill")).toBe("none");
    expect(ghost?.getAttribute("stroke")).toBe("currentColor");
  });

  it("renders the localized caption row", () => {
    const { container } = render(<About />);
    const caption = container.querySelector("figcaption");
    expect(caption?.textContent?.toLowerCase()).toContain("gabriel");
    expect(caption?.textContent).toContain("gabriel.dev");
  });
});
