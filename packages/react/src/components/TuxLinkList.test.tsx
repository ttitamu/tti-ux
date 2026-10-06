import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxLinkList } from "./TuxLinkList";

describe("TuxLinkList (React)", () => {
  const sampleGroups = [
    {
      heading: "For Sponsors",
      items: [
        {
          label: "Research Proposals Guide",
          href: "https://tti.tamu.edu/proposals",
          description: "Submission procedures and institutional review timelines.",
          featured: true,
        },
        {
          label: "Master Agreements",
          to: "/agreements/master",
          description: "TxDOT and USDOT umbrella agreement templates.",
        },
      ],
    },
    {
      heading: "For Students",
      items: [
        {
          label: "Graduate Fellowships",
          href: "https://tti.tamu.edu/fellowships",
        },
      ],
    },
  ];

  it("renders categorized groups with headings and links", () => {
    const { container } = render(
      <TuxLinkList groups={sampleGroups} layout="columns" columns={2} />,
    );

    const root = container.querySelector(".tux-link-list");
    expect(root).not.toBeNull();
    expect(root?.classList.contains("tux-link-list--columns")).toBe(true);
    expect(root?.classList.contains("tux-link-list--cols-2")).toBe(true);

    const headings = container.querySelectorAll(".tux-link-list__heading");
    expect(headings.length).toBe(2);
    expect(headings[0].textContent).toBe("For Sponsors");
    expect(headings[1].textContent).toBe("For Students");

    const links = container.querySelectorAll("a.tux-link-list__link");
    expect(links.length).toBe(3);
  });

  it("handles featured styling, external glyphs, and target blank", () => {
    const { container } = render(
      <TuxLinkList groups={sampleGroups} layout="stacked" />,
    );

    const root = container.querySelector(".tux-link-list");
    expect(root?.classList.contains("tux-link-list--stacked")).toBe(true);

    const featuredItem = container.querySelector(".tux-link-list__item--featured");
    expect(featuredItem).not.toBeNull();
    expect(featuredItem?.textContent).toContain("Research Proposals Guide");

    const externalLink = container.querySelector('a[href^="https://tti.tamu.edu/proposals"]');
    expect(externalLink?.getAttribute("target")).toBe("_blank");
    expect(externalLink?.getAttribute("rel")).toContain("noopener");
    expect(externalLink?.querySelector(".tux-link-list__external-icon")).not.toBeNull();
  });
});
