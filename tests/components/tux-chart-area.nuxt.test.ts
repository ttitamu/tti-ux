import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartArea from "~/components/TuxChartArea.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartArea Component", () => {
  const sampleLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const sampleSeries = [
    { key: "transit", label: "Transit Ridership", data: [45, 52, 58, 64, 70, 78] },
    { key: "hwy", label: "Highway Volume", data: [30, 35, 40, 42, 48, 55] },
  ];

  it("renders overlay area chart with labels, series paths, end labels, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartArea, {
      props: {
        labels: sampleLabels,
        series: sampleSeries,
        width: 640,
        height: 280,
      },
    });

    expect(wrapper.find(".tux-chart-area").exists()).toBe(true);
    expect(wrapper.find("svg.tux-chart-area__svg").exists()).toBe(true);
    expect(wrapper.findAll(".tux-chart-area__area").length).toBe(2);
    expect(wrapper.find(".tux-chart-area").attributes("aria-label")).toContain("Area chart");
    expect(wrapper.text()).toContain("78");
    expect(wrapper.text()).toContain("55");
    expect(wrapper.text()).toContain("Jan");
    expect(wrapper.text()).toContain("Jun");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports stacked variant, legend, data markers, and keyboard roving cursor", async () => {
    const wrapper = await mountSuspended(TuxChartArea, {
      props: {
        labels: sampleLabels,
        series: sampleSeries,
        variant: "stacked",
        legend: true,
        markers: true,
        units: "trips",
      },
    });

    expect(wrapper.findAll(".tux-chart-area__area--stacked").length).toBe(2);
    expect(wrapper.find(".tux-chart-area__legend").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-area__end-labels").exists()).toBe(true);

    const capture = wrapper.find(".tux-chart-area__hover-capture");
    expect(capture.exists()).toBe(true);
    await capture.trigger("keydown", { key: "ArrowRight" });

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
