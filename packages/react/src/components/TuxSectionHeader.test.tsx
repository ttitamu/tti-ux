/**
 * Unit tests for TuxSectionHeader React port.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxSectionHeader } from "./TuxSectionHeader";

describe("TuxSectionHeader (React port)", () => {
  it("renders with default institutional variant and gold underline rule", () => {
    const { container } = render(
      <TuxSectionHeader title="Research Programs" subtitle="Active transportation initiatives" />,
    );
    const header = container.querySelector(".tux-section-header");
    expect(header).toBeDefined();
    expect(header?.className).toContain("tux-section-header--institutional");

    const heading = screen.getByRole("heading", { level: 2, name: "Research Programs" });
    expect(heading).toBeDefined();

    const rule = container.querySelector(".tux-section-header__rule");
    expect(rule).toBeDefined();
    expect(rule?.getAttribute("role")).toBe("presentation");

    const subtitle = screen.getByText("Active transportation initiatives");
    expect(subtitle.className).toContain("tux-section-header__subtitle");
  });

  it("supports level prop rendering h1, h2, h3, h4", () => {
    const { rerender } = render(<TuxSectionHeader level={1} title="Top Level" />);
    expect(screen.getByRole("heading", { level: 1, name: "Top Level" })).toBeDefined();

    rerender(<TuxSectionHeader level={3} title="Subsection" />);
    expect(screen.getByRole("heading", { level: 3, name: "Subsection" })).toBeDefined();
  });

  it("renders optional kicker eyebrow text", () => {
    render(
      <TuxSectionHeader
        kicker="FY2026 AUDIT"
        title="Institutional Quality Report"
      />,
    );
    const kicker = screen.getByText("FY2026 AUDIT");
    expect(kicker.className).toContain("tux-section-header__kicker");
  });

  it("supports classic and minimal variants", () => {
    const { container, rerender } = render(
      <TuxSectionHeader variant="classic" title="Classic Header" />,
    );
    let header = container.querySelector(".tux-section-header");
    expect(header?.className).toContain("tux-section-header--classic");

    rerender(<TuxSectionHeader variant="minimal" title="Minimal Header" />);
    header = container.querySelector(".tux-section-header");
    expect(header?.className).toContain("tux-section-header--minimal");
  });

  it("supports child elements in place of title", () => {
    render(
      <TuxSectionHeader>
        <span>Custom <em>Highlighted</em> Heading</span>
      </TuxSectionHeader>,
    );
    expect(screen.getByRole("heading", { level: 2 }).textContent).toContain("Custom Highlighted Heading");
  });
});
