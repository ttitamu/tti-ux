import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TuxTableCaption } from "./TuxTableCaption";

describe("TuxTableCaption (React)", () => {
  it("renders table caption placed above table with label and number", () => {
    const { container } = render(
      <TuxTableCaption
        label="Table"
        number="2.1"
        caption="Annual Average Daily Traffic by Region."
        source="Source: TxDOT Geospatial Open Data, 2025."
        placement="above"
      >
        <table>
          <tbody>
            <tr>
              <td>Austin</td>
              <td>184,000</td>
            </tr>
          </tbody>
        </table>
      </TuxTableCaption>
    );

    const figure = container.querySelector("figure.tux-table-caption");
    expect(figure).not.toBeNull();
    expect(screen.getByText("Table 2.1.")).toBeDefined();
    expect(
      screen.getByText("Annual Average Daily Traffic by Region.")
    ).toBeDefined();
    expect(
      screen.getByText("Source: TxDOT Geospatial Open Data, 2025.")
    ).toBeDefined();
    expect(screen.getByText("Austin")).toBeDefined();
  });

  it("renders caption placed below when requested", () => {
    const { container } = render(
      <TuxTableCaption number={4} caption="Corridor metrics" placement="below">
        <table>
          <tbody>
            <tr>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
      </TuxTableCaption>
    );

    const figcaption = container.querySelector("figcaption");
    expect(figcaption).not.toBeNull();
    expect(screen.getByText("Table 4.")).toBeDefined();
  });
});
