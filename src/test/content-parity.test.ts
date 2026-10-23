import { describe, expect, it } from "vitest";
import { getPortfolioContent } from "@/content";

/**
 * Content parity: both locales must expose the same structure, and every
 * placeholder entry must stay flagged in both — nothing fictional may be
 * presented as real in one language and not the other.
 */
describe("portfolio content", () => {
  it("serves the same structure in pt-BR and en", () => {
    const pt = getPortfolioContent("pt-BR");
    const en = getPortfolioContent("en");

    expect(en.name).toBe(pt.name);
    expect(en.projects.map((p) => p.id)).toEqual(pt.projects.map((p) => p.id));
    expect(en.skillGroups.map((g) => g.id)).toEqual(pt.skillGroups.map((g) => g.id));
    expect(en.experience.map((e) => e.id)).toEqual(pt.experience.map((e) => e.id));
  });

  it("keeps placeholder flags identical across locales", () => {
    const pt = getPortfolioContent("pt-BR");
    const en = getPortfolioContent("en");

    expect(en.projects.map((p) => p.placeholder)).toEqual(
      pt.projects.map((p) => p.placeholder),
    );
    expect(en.experience.map((e) => e.placeholder)).toEqual(
      pt.experience.map((e) => e.placeholder),
    );
  });

  it("renders links without href as inert text, never as dead anchors", () => {
    for (const locale of ["pt-BR", "en"] as const) {
      for (const project of getPortfolioContent(locale).projects) {
        for (const link of project.links) {
          // a link is either a real URL or explicitly empty (UI renders text)
          expect(link.href === "" || /^https?:\/\//.test(link.href)).toBe(true);
        }
      }
    }
  });

  it("falls back to pt-BR for unknown locales", () => {
    expect(getPortfolioContent("fr" as never).name).toBe("Gabriel");
  });
});
