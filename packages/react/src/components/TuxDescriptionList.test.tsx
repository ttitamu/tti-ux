import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxDescriptionList } from "./TuxDescriptionList";

describe("TuxDescriptionList (React)", () => {
  const sampleItems = [
    { term: "Project Number", value: "0-7124" },
    { term: "Lead Agency", value: "Texas Department of Transportation" },
    { term: "Status", value: "Active Telemetry" },
  ];

  it("renders semantic dl, dt, and dd elements in inline layout", () => {
    const { container } = render(
      <TuxDescriptionList
        items={sampleItems}
        title="Project Metadata"
        layout="inline"
      />,
    );

    const title = container.querySelector(".tux-dl__title");
    expect(title).not.toBeNull();
    expect(title?.textContent).toBe("Project Metadata");

    const dl = container.querySelector("dl");
    expect(dl).not.toBeNull();
    expect(dl?.classList.contains("tux-dl--inline")).toBe(true);
    expect(dl?.classList.contains("tux-dl--editorial")).toBe(true);

    const terms = container.querySelectorAll("dt");
    expect(terms.length).toBe(3);
    expect(terms[0].textContent).toBe("Project Number");

    const values = container.querySelectorAll("dd");
    expect(values.length).toBe(3);
    expect(values[0].textContent).toBe("0-7124");
  });

  it("supports stacked layout and data emphasis", () => {
    const { container } = render(
      <TuxDescriptionList
        items={sampleItems.slice(0, 1)}
        layout="stacked"
        emphasis="data"
      />,
    );

    const dl = container.querySelector("dl");
    expect(dl?.classList.contains("tux-dl--stacked")).toBe(true);
    expect(dl?.classList.contains("tux-dl--data")).toBe(true);
  });
});
