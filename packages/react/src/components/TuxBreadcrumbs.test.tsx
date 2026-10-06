/**
 * Unit tests for TuxBreadcrumbs React port.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxBreadcrumbs } from "./TuxBreadcrumbs";

describe("TuxBreadcrumbs (React port)", () => {
  const sampleTrail = [
    { label: "Home", to: "/" },
    { label: "Research", to: "/research" },
    { label: "Corridor Operations", to: "/research/corridor" },
    { label: "Active Project" },
  ];

  it("renders a semantic breadcrumb navigation landmark with ordered list", () => {
    render(<TuxBreadcrumbs trail={sampleTrail} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeDefined();
    expect(nav.className).toContain("tux-breadcrumbs");

    const current = screen.getByText("Active Project");
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(current.tagName).toBe("SPAN");
  });

  it("renders home link with home icon by default", () => {
    const { container } = render(<TuxBreadcrumbs trail={sampleTrail} />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toBeDefined();
    expect(homeLink?.getAttribute("href")).toBe("/");

    const homeSvg = container.querySelector(".tux-breadcrumbs__home-icon");
    expect(homeSvg).toBeDefined();
  });

  it("hides home icon when homeIcon is false", () => {
    const { container } = render(<TuxBreadcrumbs trail={sampleTrail} homeIcon={false} />);
    const homeSvg = container.querySelector(".tux-breadcrumbs__home-icon");
    expect(homeSvg).toBeNull();
  });

  it("supports chevron separator modifier", () => {
    render(<TuxBreadcrumbs trail={sampleTrail} chevron />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("tux-breadcrumbs--chevron");
    const chevrons = screen.getAllByText("›");
    expect(chevrons.length).toBe(3);
  });

  it("customizes aria-label for multiple breadcrumb landmarks", () => {
    render(<TuxBreadcrumbs trail={sampleTrail} ariaLabel="Sub-corridor navigation" />);
    const nav = screen.getByRole("navigation", { name: "Sub-corridor navigation" });
    expect(nav).toBeDefined();
  });
});
