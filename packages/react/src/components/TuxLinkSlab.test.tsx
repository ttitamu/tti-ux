import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxLinkSlab } from "./TuxLinkSlab";

describe("TuxLinkSlab (React)", () => {
  const sampleLinks = [
    {
      label: "About TTI",
      to: "/about",
      description: "Mission, executive leadership, and historical milestones.",
    },
    {
      label: "Research Programs",
      href: "https://tti.tamu.edu/programs",
      description: "Highways, transit, safety, and freight divisions.",
    },
    {
      label: "Contact & Facilities",
      to: "/contact",
    },
  ];

  it("renders nav landmark with accessible name and link row", () => {
    const { container } = render(
      <TuxLinkSlab links={sampleLinks} ariaLabel="Institutional portals" />,
    );

    const nav = container.querySelector("nav");
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute("aria-label")).toBe("Institutional portals");
    expect(nav?.classList.contains("tux-link-slab")).toBe(true);
    expect(nav?.classList.contains("tux-link-slab--plain")).toBe(true);

    const links = container.querySelectorAll("a.tux-link-slab__link");
    expect(links.length).toBe(3);
    expect(links[0].textContent).toContain("About TTI");
    expect(links[0].textContent).toContain("Mission, executive leadership");
  });

  it("supports tone variants and custom icon injection", () => {
    const iconLinks = [
      {
        label: "Corridor Lab",
        to: "/labs/corridor",
        icon: <span data-testid="custom-icon">Icon</span>,
      },
    ];

    const { container, getByTestId } = render(
      <TuxLinkSlab links={iconLinks} tone="maroon" />,
    );

    const nav = container.querySelector("nav");
    expect(nav?.classList.contains("tux-link-slab--maroon")).toBe(true);
    expect(getByTestId("custom-icon")).toBeDefined();
  });
});
