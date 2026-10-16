/**
 * Port-fidelity locks for the TuxChartPatternsDefs React port — verifies all 7
 * CVD/monochrome SVG pattern definitions and custom prefix support.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxChartPatternsDefs } from "./TuxChartPatternsDefs";

describe("TuxChartPatternsDefs (react port)", () => {
  it("renders all 7 SVG <pattern> definitions with default tux-pat- prefix", () => {
    const { container } = render(
      <svg>
        <TuxChartPatternsDefs />
      </svg>,
    );

    const defs = container.querySelector("defs.tux-chart-patterns-defs");
    expect(defs).toBeTruthy();

    const expectedIds = [
      "tux-pat-diag-right",
      "tux-pat-diag-left",
      "tux-pat-dots",
      "tux-pat-crosshatch",
      "tux-pat-horizontal",
      "tux-pat-vertical",
      "tux-pat-diamonds",
    ];

    const patterns = defs!.querySelectorAll("pattern");
    expect(patterns).toHaveLength(7);
    for (const id of expectedIds) {
      expect(defs!.querySelector(`pattern#${id}`)).toBeTruthy();
    }
  });

  it("supports custom prefix prop for scoped chart instances", () => {
    const { container } = render(
      <svg>
        <TuxChartPatternsDefs prefix="custom-chart-" />
      </svg>,
    );

    expect(container.querySelector("pattern#custom-chart-diag-right")).toBeTruthy();
    expect(container.querySelector("pattern#custom-chart-diamonds")).toBeTruthy();
  });
});
