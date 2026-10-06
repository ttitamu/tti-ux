import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartGauge from "~/components/TuxChartGauge.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartGauge Component", () => {
  it("renders arc gauge with needle, status bands, center stat, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartGauge, {
      props: {
        value: 78,
        min: 0,
        max: 100,
        size: 240,
        variant: "arc",
        bands: [
          { from: 0, to: 40, tone: "error" },
          { from: 40, to: 70, tone: "warning" },
          { from: 70, to: 100, tone: "success" },
        ],
        centerLabel: "System Reliability",
        centerValue: 78,
        units: "%",
      },
    });

    expect(wrapper.find(".tux-chart-gauge").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-gauge__track").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-gauge__needle").exists()).toBe(true);
    expect(wrapper.findAll(".tux-chart-gauge__band").length).toBe(3);
    expect(wrapper.text()).toContain("System Reliability");
    expect(wrapper.text()).toContain("78");
    expect(wrapper.text()).toContain("%");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports progress variant, custom ticks formatting, and center slot fallback", async () => {
    const wrapper = await mountSuspended(TuxChartGauge, {
      props: {
        value: 85,
        min: 0,
        max: 100,
        variant: "progress",
        format: (n: number) => `${n}k`,
      },
      slots: {
        center: () => "<div class=\"custom-gauge-center\"><span>85,000 Users</span></div>",
      },
    });

    expect(wrapper.find(".tux-chart-gauge__fill").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-gauge__needle").exists()).toBe(false);
    expect(wrapper.text()).toContain("85,000 Users");
    expect(wrapper.text()).toContain("0k");
    expect(wrapper.text()).toContain("100k");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
