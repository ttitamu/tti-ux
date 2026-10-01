import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartBar from "~/components/TuxChartBar.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartBar Component", () => {
  const sampleLabels = ["Austin", "Dallas", "Houston", "San Antonio", "El Paso"];
  const sampleSeries = [
    { key: "actual", label: "Actual Traffic", data: [420, 580, 610, 390, 220] },
  ];

  it("renders vertical bar chart with category labels, bars, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartBar, {
      props: {
        labels: sampleLabels,
        series: sampleSeries,
        width: 640,
        height: 280,
      },
    });

    expect(wrapper.find(".tux-chart-bar").exists()).toBe(true);
    expect(wrapper.find("svg.tux-chart-bar__svg").exists()).toBe(true);
    expect(wrapper.findAll(".tux-chart-bar__bar").length).toBe(5);
    expect(wrapper.text()).toContain("Austin");
    expect(wrapper.text()).toContain("Houston");
    expect(wrapper.find(".tux-chart-bar__category-labels").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports horizontal orientation, stacked mode, comparison overlay, and inBarLabels", async () => {
    const multiSeries = [
      { key: "sov", label: "Single Occupancy", data: [300, 420, 460, 280, 160], comparison: [320, 400, 450, 300, 150] },
      { key: "hov", label: "High Occupancy", data: [120, 160, 150, 110, 60] },
    ];

    const wrapper = await mountSuspended(TuxChartBar, {
      props: {
        labels: sampleLabels,
        series: multiSeries,
        orientation: "horizontal",
        variant: "stacked",
        legend: true,
        inBarLabels: true,
        units: "vph",
      },
    });

    expect(wrapper.attributes("data-orient")).toBe("horizontal");
    expect(wrapper.find(".tux-chart-bar__bars--stacked").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-bar__legend").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
