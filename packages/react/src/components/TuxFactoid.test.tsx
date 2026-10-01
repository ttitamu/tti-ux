import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxFactoid } from "./TuxFactoid";

describe("TuxFactoid (React)", () => {
  const sampleItems = [
    {
      value: "800",
      suffix: "+",
      label: "Sponsored research initiatives active across Texas corridors",
      source: "TTI Annual Ledger FY25",
    },
    {
      value: "15",
      suffix: "M",
      label: "Miles of automated roadside sensor network analyzed continuously",
    },
    {
      value: "99.8",
      suffix: "%",
      label: "Institutional testing reliability SLA over 10 consecutive quarters",
    },
    {
      value: "45",
      label: "Patent and software technology disclosures filed with Texas A&M",
    },
  ];

  it("renders factoid stats sliced to columns count with header elements", () => {
    const { container } = render(
      <TuxFactoid
        items={sampleItems}
        columns={3}
        eyebrow="Institutional Impact"
        title="Engineering Transportation Progress"
        dek="Proven empirical research across seven decades of state and national partnership."
      />,
    );

    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section?.classList.contains("tux-factoid")).toBe(true);
    expect(section?.classList.contains("tux-factoid--default")).toBe(true);

    const eyebrow = container.querySelector(".tux-factoid__eyebrow");
    expect(eyebrow?.textContent).toBe("Institutional Impact");

    const title = container.querySelector(".tux-factoid__title");
    expect(title?.textContent).toBe("Engineering Transportation Progress");

    const cells = container.querySelectorAll(".tux-factoid__cell");
    expect(cells.length).toBe(3); // sliced to columns=3

    const value = container.querySelector(".tux-factoid__value");
    expect(value?.textContent).toContain("800+");

    const source = container.querySelector(".tux-factoid__source");
    expect(source?.textContent).toBe("TTI Annual Ledger FY25");
  });

  it("supports bold and elegant typography variants", () => {
    const { container } = render(
      <TuxFactoid
        items={sampleItems}
        columns={4}
        variant="bold"
        title="Headline"
      />,
    );

    const section = container.querySelector("section");
    expect(section?.classList.contains("tux-factoid--bold")).toBe(true);

    const title = container.querySelector(".tux-factoid__title");
    expect(title?.classList.contains("heading--bold")).toBe(true);

    const cells = container.querySelectorAll(".tux-factoid__cell");
    expect(cells.length).toBe(4);
  });
});
