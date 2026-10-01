import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxBetaRibbon } from "./TuxBetaRibbon";

describe("TuxBetaRibbon (React)", () => {
  it("renders corner variant with preview tone and accessibility note role", () => {
    const { container } = render(
      <TuxBetaRibbon variant="corner" kind="preview" corner="top-right" />,
    );

    const corner = container.querySelector(".tux-beta-corner");
    expect(corner).not.toBeNull();
    expect(corner?.getAttribute("role")).toBe("note");
    expect(corner?.getAttribute("aria-label")).toBe("Environment: preview");
    expect(corner?.classList.contains("tux-beta-corner--top-right")).toBe(true);
    expect(corner?.classList.contains("tux-beta--preview")).toBe(true);
    expect(corner?.textContent).toBe("preview");
  });

  it("renders stripe variant with custom message and beta tone", () => {
    const { container } = render(
      <TuxBetaRibbon
        variant="stripe"
        kind="beta"
        message="Active beta telemetry test environment."
      />,
    );

    const aside = container.querySelector("aside");
    expect(aside).not.toBeNull();
    expect(aside?.classList.contains("tux-beta-stripe")).toBe(true);
    expect(aside?.classList.contains("tux-beta--beta")).toBe(true);

    const pill = container.querySelector(".tux-beta-stripe__pill");
    expect(pill?.textContent).toBe("beta");

    const msg = container.querySelector(".tux-beta-stripe__message");
    expect(msg?.textContent).toBe("Active beta telemetry test environment.");
  });

  it("renders pill variant with dev tone and siren icon", () => {
    const { container } = render(
      <TuxBetaRibbon variant="pill" kind="dev" label="Sandbox" />,
    );

    const pill = container.querySelector(".tux-beta-pill");
    expect(pill).not.toBeNull();
    expect(pill?.classList.contains("tux-beta--dev")).toBe(true);
    expect(pill?.getAttribute("aria-label")).toBe("Status: Sandbox");
    expect(pill?.textContent).toContain("Sandbox");

    const icon = container.querySelector(".tux-beta-pill__icon");
    expect(icon).not.toBeNull();
  });
});
