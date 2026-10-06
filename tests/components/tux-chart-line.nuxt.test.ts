import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartLine from "~/components/TuxChartLine.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartLine Component", () => {
  const sampleLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const sampleSeries = [
    { key: "speed", label: "Average Speed", data: [62, 58, 54, 48, 55, 60] },
    { key: "target", label: "Target Speed", data: [60, 60, 60, 60, 60, 60] },
  ];

  it("renders multi-series line chart with gridlines, end labels, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartLine, {
      props: {
        labels: sampleLabels,
        series: sampleSeries,
        width: 640,
        height: 280,
        units: "mph",
      },
    });

    expect(wrapper.find(".tux-chart-line").exists()).toBe(true);
    expect(wrapper.find("svg.tux-chart-line__svg").exists()).toBe(true);
    expect(wrapper.findAll(".tux-chart-line__line").length).toBe(2);
    expect(wrapper.find(".tux-chart-line__end-labels").exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toContain("Average Speed");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports confidence bands, previous-period overlays, markers, and brush selector", async () => {
    const advancedSeries = [
      {
        key: "travel-time",
        label: "Travel Time Index",
        data: [1.2, 1.35, 1.4, 1.55, 1.45, 1.3],
        previous: [1.15, 1.25, 1.3, 1.45, 1.4, 1.25],
        band: [
          [1.1, 1.3],
          [1.25, 1.45],
          [1.3, 1.5],
          [1.45, 1.65],
          [1.35, 1.55],
          [1.2, 1.4],
        ] as Array<[number, number]>,
      },
    ];

    const wrapper = await mountSuspended(TuxChartLine, {
      props: {
        labels: sampleLabels,
        series: advancedSeries,
        markers: true,
        legend: true,
        brush: true,
      },
    });

    expect(wrapper.findAll(".tux-chart-line__band").length).toBe(1);
    expect(wrapper.findAll(".tux-chart-line__previous").length).toBe(1);
    expect(wrapper.find(".tux-chart-line__markers").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-line__legend").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-line__brush").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
