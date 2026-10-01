import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartHeatmap from "~/components/TuxChartHeatmap.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartHeatmap Component", () => {
  const sampleRows = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const sampleCols = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  const sampleValues = [
    [10, 5, 45, 30, 55, 25],
    [12, 4, 48, 32, 58, 22],
    [8, 6, 50, 35, 62, 28],
    [14, 8, 46, 31, 60, 30],
    [15, 10, 52, 40, 75, 42],
  ];

  it("renders matrix heatmap with row/column labels, cell rectangles, legend ranges, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartHeatmap, {
      props: {
        rows: sampleRows,
        cols: sampleCols,
        values: sampleValues,
        width: 640,
        height: 280,
        units: "incidents",
      },
    });

    expect(wrapper.find(".tux-chart-heatmap").exists()).toBe(true);
    expect(wrapper.find("svg.tux-chart-heatmap__svg").exists()).toBe(true);
    expect(wrapper.findAll(".tux-chart-heatmap__cell").length).toBe(30);
    expect(wrapper.text()).toContain("Mon");
    expect(wrapper.text()).toContain("Fri");
    expect(wrapper.find(".tux-chart-heatmap__legend").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports missing data, slate ramp, in-cell value labels, and keyboard 2D cursor navigation", async () => {
    const valuesWithNull = [
      [10, null, 45],
      [12, 4, null],
    ];

    const wrapper = await mountSuspended(TuxChartHeatmap, {
      props: {
        rows: ["Morning", "Evening"],
        cols: ["North", "Central", "South"],
        values: valuesWithNull,
        ramp: "slate",
        valueLabels: true,
      },
    });

    expect(wrapper.attributes("data-ramp")).toBe("slate");
    expect(wrapper.findAll(".tux-chart-heatmap__cell--null").length).toBe(2);
    expect(wrapper.find(".tux-chart-heatmap__cell-label").exists()).toBe(true);

    const capture = wrapper.find(".tux-chart-heatmap__hover-capture");
    expect(capture.exists()).toBe(true);
    await capture.trigger("keydown", { key: "ArrowRight" });
    await capture.trigger("keydown", { key: "ArrowDown" });

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
