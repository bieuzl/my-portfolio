import { describe, expect, it } from "vitest";
import { getPortfolioContent } from "@/content";

/**
 * Content parity: both locales must expose the same structure across
 * projects, subpage sections, skill groups, and experience entries.
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

  it("keeps subpage section counts identical across locales", () => {
    const pt = getPortfolioContent("pt-BR");
    const en = getPortfolioContent("en");

    expect(en.projects.map((p) => p.subpageSections?.length ?? 0)).toEqual(
      pt.projects.map((p) => p.subpageSections?.length ?? 0),
    );
  });

  it("uses valid HTTP(S) URLs for all configured project links", () => {
    for (const locale of ["pt-BR", "en"] as const) {
      for (const project of getPortfolioContent(locale).projects) {
        for (const link of project.links) {
          expect(link.href === "" || /^https?:\/\//.test(link.href)).toBe(true);
        }
      }
    }
  });

  it("falls back to pt-BR for unknown locales", () => {
    expect(getPortfolioContent("fr" as never).name).toBe("Gabriel");
  });
});
