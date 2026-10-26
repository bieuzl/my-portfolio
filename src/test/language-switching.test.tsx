import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import i18n from "@/i18n";
import Home from "@/pages/Home";

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

/* The language switch renders twice (desktop nav + mobile bar); jsdom does
   not apply the CSS that hides one, so tests use the first instance. */
const enButtons = () => screen.getAllByRole("button", { name: "EN" });
const ptButtons = () => screen.getAllByRole("button", { name: "PT" });

describe("language switching", () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await i18n.changeLanguage("pt-BR");
  });

  it("renders Portuguese UI by default", () => {
    renderHome();
    expect(
      screen.getAllByRole("link", { name: "Apresentação" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Competências").length).toBeGreaterThan(0);
  });

  it("switches visible text to English when EN is chosen", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(enButtons()[0]);

    expect(screen.getAllByRole("link", { name: "About" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Selected projects")).toBeInTheDocument();
  });

  it("persists the chosen locale", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(enButtons()[0]);

    expect(window.localStorage.getItem("portfolio-locale")).toBe("en");
  });

  it("marks the active language as pressed", async () => {
    const user = userEvent.setup();
    renderHome();

    for (const pt of ptButtons()) expect(pt).toHaveAttribute("aria-pressed", "true");

    await user.click(enButtons()[0]);
    for (const en of enButtons()) expect(en).toHaveAttribute("aria-pressed", "true");
  });
});
