import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartHistogram from "~/components/TuxChartHistogram.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartHistogram Component", () => {
  const sampleValues = [
    12, 14, 15, 18, 19, 21, 22, 23, 23, 24, 25, 26, 28, 29, 31, 33, 35, 38, 42, 45,
  ];

  it("bins continuous sample values, renders bars, axis labels, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartHistogram, {
      props: {
        values: sampleValues,
        width: 640,
        height: 280,
        binCount: 8,
        xLabel: "Travel Time (min)",
        units: "trips",
      },
    });

    expect(wrapper.find(".tux-chart-histogram").exists()).toBe(true);
    expect(wrapper.find("svg.tux-chart-histogram__svg").exists()).toBe(true);
    expect(wrapper.findAll(".tux-chart-histogram__bar").length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain("Travel Time (min)");
    expect(wrapper.text()).toContain("Count");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports percentile markers, normalized mode, and keyboard roving cursor", async () => {
    const wrapper = await mountSuspended(TuxChartHistogram, {
      props: {
        values: sampleValues,
        percentiles: [50, 95],
        normalize: true,
      },
    });

    expect(wrapper.text()).toContain("% of samples");
    expect(wrapper.findAll(".tux-chart-histogram__percentile-line").length).toBe(2);
    expect(wrapper.text()).toContain("p50");
    expect(wrapper.text()).toContain("p95");

    const capture = wrapper.find(".tux-chart-histogram__hover-capture");
    expect(capture.exists()).toBe(true);
    await capture.trigger("keydown", { key: "ArrowRight" });

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
