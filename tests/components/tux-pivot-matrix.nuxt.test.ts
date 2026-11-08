import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxPivotMatrix from "~/components/TuxPivotMatrix.vue";
import { runComponentAxe } from "../axe-helper";

const rowLabels = ["Fatal (K)", "Serious Injury (A)"];
const colLabels = ["Daylight", "Dark — Lighted", "Dark — Unlighted"];
const values = [
  [10, 5, 15], // row sum = 30
  [40, 20, 30], // row sum = 90
  // col sums = [50, 25, 45], grand total = 120
];

describe("TuxPivotMatrix Component", () => {
  it("computes row sums, column sums, and grand total accurately and passes axe", async () => {
    const wrapper = await mountSuspended(TuxPivotMatrix, {
      props: {
        caption: "Crash Severity by Lighting",
        rowHeaderLabel: "Severity",
        rowLabels,
        colLabels,
        values,
        shaded: true,
      },
    });

    expect(wrapper.find("caption").text()).toContain("Crash Severity by Lighting");
    expect(wrapper.text()).toContain("Severity");
    expect(wrapper.text()).toContain("30");
    expect(wrapper.text()).toContain("90");
    expect(wrapper.text()).toContain("50");
    expect(wrapper.text()).toContain("25");
    expect(wrapper.text()).toContain("45");
    expect(wrapper.text()).toContain("120");

    // Verify shaded intensity classes applied
    expect(wrapper.find(".tux-pivot-matrix__cell--tier-4").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits selectCell on cell button click and supports unshaded prefix/suffix formatting", async () => {
    const wrapper = await mountSuspended(TuxPivotMatrix, {
      props: {
        caption: "Crash Costs Matrix",
        rowLabels,
        colLabels,
        values,
        valuePrefix: "$",
        valueSuffix: "k",
        decimals: 1,
        shaded: false,
      },
    });

    expect(wrapper.text()).toContain("$120.0k");
    expect(wrapper.find(".tux-pivot-matrix__cell--tier-4").exists()).toBe(false);

    const cellButtons = wrapper.findAll(".tux-pivot-matrix__cell-btn");
    // Index 2 corresponds to row 0 ("Fatal (K)"), col 2 ("Dark — Unlighted"), value 15
    await cellButtons[2]!.trigger("click");

    expect(wrapper.emitted("selectCell")?.[0]).toEqual([
      {
        rowIndex: 0,
        colIndex: 2,
        rowLabel: "Fatal (K)",
        colLabel: "Dark — Unlighted",
        value: 15,
      },
    ]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
