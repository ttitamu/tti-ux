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

  it("applies multi-channel CVD redundancy: stroke-dash patterns and geometric markers", async () => {
    const multiSeries3 = [
      { key: "s1", label: "Series 1", data: [10, 20, 30] },
      { key: "s2", label: "Series 2", data: [15, 25, 35] },
      { key: "s3", label: "Series 3", data: [20, 30, 40] },
    ];

    const wrapper = await mountSuspended(TuxChartLine, {
      props: {
        labels: ["A", "B", "C"],
        series: multiSeries3,
        markers: true,
        legend: true,
      },
    });

    const lines = wrapper.findAll(".tux-chart-line__line");
    expect(lines.length).toBe(3);

    // Series 0 is solid (no dasharray)
    expect(lines[0].attributes("style")).not.toContain("stroke-dasharray");
    // Series 1 is dashed ("8 4")
    expect(lines[1].attributes("style")).toContain("stroke-dasharray: 8 4");
    // Series 2 is dotted ("2 3")
    expect(lines[2].attributes("style")).toContain("stroke-dasharray: 2 3");

    // Geometric markers
    expect(wrapper.findAll(".tux-chart-line__marker--circle").length).toBe(3);
    expect(wrapper.findAll(".tux-chart-line__marker--square").length).toBe(3);
    expect(wrapper.findAll(".tux-chart-line__marker--triangle").length).toBe(3);

    // Legend sample indicators
    const legendSwatches = wrapper.findAll(".tux-chart-line__legend-swatch");
    expect(legendSwatches.length).toBe(3);
    expect(legendSwatches[0].find("svg.tux-chart-line__legend-sample").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports explicit pattern overrides and patterns: false prop", async () => {
    const customSeries = [
      { key: "s1", label: "Series 1", data: [10, 20], dashArray: "12 4", marker: "star" as const },
      { key: "s2", label: "Series 2", data: [15, 25] },
    ];

    const wrapper = await mountSuspended(TuxChartLine, {
      props: {
        labels: ["A", "B"],
        series: customSeries,
        markers: true,
      },
    });

    const lines = wrapper.findAll(".tux-chart-line__line");
    expect(lines[0].attributes("style")).toContain("stroke-dasharray: 12 4");
    expect(wrapper.findAll(".tux-chart-line__marker--star").length).toBe(2);

    // Force solid lines when patterns: false
    const solidWrapper = await mountSuspended(TuxChartLine, {
      props: {
        labels: ["A", "B"],
        series: [
          { key: "s1", label: "Series 1", data: [10, 20] },
          { key: "s2", label: "Series 2", data: [15, 25] },
        ],
        patterns: false,
      },
    });

    const solidLines = solidWrapper.findAll(".tux-chart-line__line");
    expect(solidLines[0].attributes("style")).not.toContain("stroke-dasharray");
    expect(solidLines[1].attributes("style")).not.toContain("stroke-dasharray");
  });

  it("applies Okabe-Ito universal palette when palette='cvd'", async () => {
    const wrapper = await mountSuspended(TuxChartLine, {
      props: {
        labels: ["Q1", "Q2", "Q3"],
        series: [
          { key: "north", label: "North Bound", data: [50, 60, 55] },
          { key: "south", label: "South Bound", data: [45, 52, 58] },
        ],
        palette: "cvd",
        legend: true,
      },
    });

    const root = wrapper.find(".tux-chart-line");
    expect(root.classes()).toContain("tux-chart--cvd");
    expect(root.attributes("data-chart-palette")).toBe("cvd");

    const lines = wrapper.findAll(".tux-chart-line__line");
    expect(lines[0].attributes("style")).toContain("var(--chart-cvd-1, var(--chart-1))");
    expect(lines[1].attributes("style")).toContain("var(--chart-cvd-2, var(--chart-2))");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
