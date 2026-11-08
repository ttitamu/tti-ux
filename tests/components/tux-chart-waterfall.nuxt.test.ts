import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartWaterfall, { type WaterfallStep } from "~/components/TuxChartWaterfall.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartWaterfall Component", () => {
  const crashSteps: WaterfallStep[] = [
    { key: "base", label: "Baseline", value: 100, kind: "start" },
    { key: "vmt", label: "VMT Growth", value: 15, kind: "delta" },
    { key: "roundabout", label: "Roundabouts", value: -30, kind: "delta" },
    { key: "sub", label: "Midpoint", value: 0, kind: "subtotal" },
    { key: "lighting", label: "Lighting", value: -10, kind: "delta" },
    { key: "total", label: "Observed", value: 0, kind: "total" },
  ];

  it("computes cumulative step baselines, dashed connectors, signed labels, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxChartWaterfall, {
      props: {
        steps: crashSteps,
        polarity: "invert",
        units: "crashes",
      },
    });

    expect(wrapper.find(".tux-chart-waterfall").exists()).toBe(true);
    expect(wrapper.attributes("data-polarity")).toBe("invert");

    const svg = wrapper.find("svg.tux-chart-waterfall__svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("tabindex")).toBe("0");
    expect(svg.attributes("role")).toBe("img");

    const bars = wrapper.findAll(".tux-chart-waterfall__bar");
    expect(bars.length).toBe(crashSteps.length);

    // Inverted polarity: +15 VMT growth is adverse, -30 Roundabouts is favorable
    expect(bars[0]!.classes()).toContain("tux-chart-waterfall__bar--anchor");
    expect(bars[1]!.classes()).toContain("tux-chart-waterfall__bar--adverse");
    expect(bars[2]!.classes()).toContain("tux-chart-waterfall__bar--favorable");
    expect(bars[3]!.classes()).toContain("tux-chart-waterfall__bar--anchor");
    expect(bars[5]!.classes()).toContain("tux-chart-waterfall__bar--total");

    // Connectors bridge adjacent bars (n - 1 lines)
    expect(wrapper.findAll(".tux-chart-waterfall__connector").length).toBe(crashSteps.length - 1);

    // Signed labels & computed cumulative total (100 + 15 - 30 - 10 = 75)
    expect(wrapper.text()).toContain("+15");
    expect(wrapper.text()).toContain("-30");
    expect(wrapper.text()).toContain("75");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports direct polarity, keyboard roving cursor, hover emit, and tooltip toggle", async () => {
    const wrapper = await mountSuspended(TuxChartWaterfall, {
      props: {
        steps: crashSteps,
        polarity: "direct",
      },
    });

    const bars = wrapper.findAll(".tux-chart-waterfall__bar");
    // Direct polarity: +15 is favorable, -30 is adverse
    expect(bars[1]!.classes()).toContain("tux-chart-waterfall__bar--favorable");
    expect(bars[2]!.classes()).toContain("tux-chart-waterfall__bar--adverse");

    const svg = wrapper.find("svg.tux-chart-waterfall__svg");
    await svg.trigger("keydown", { key: "ArrowRight" });

    expect(wrapper.emitted("hover")).toBeTruthy();
    expect(wrapper.find(".tux-chart-waterfall__tooltip").exists()).toBe(true);

    await svg.trigger("keydown", { key: "Escape" });
    expect(wrapper.find(".tux-chart-waterfall__tooltip").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
