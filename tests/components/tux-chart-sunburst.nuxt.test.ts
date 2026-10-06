import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartSunburst from "~/components/TuxChartSunburst.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartSunburst Component", () => {
  const sampleData = [
    {
      label: "Highway Maintenance",
      children: [
        { label: "Pavement Resurfacing", value: 45 },
        { label: "Bridge Rehab", value: 30 },
        { label: "Drainage Repairs", value: 15 },
      ],
    },
    {
      label: "Safety Programs",
      children: [
        { label: "Intersection Lighting", value: 25 },
        { label: "Signage & Striping", value: 20 },
      ],
    },
    {
      label: "Intelligent Systems",
      children: [
        { label: "CCTV Expansion", value: 18 },
        { label: "DMS Upgrades", value: 12 },
      ],
    },
  ];

  it("renders two-ring sunburst with groups, children, center totals, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartSunburst, {
      props: {
        data: sampleData,
        size: 320,
        centerLabel: "Budget",
      },
    });

    expect(wrapper.find(".tux-chart-sunburst").exists()).toBe(true);
    expect(wrapper.find("svg.tux-chart-sunburst__svg").exists()).toBe(true);
    expect(wrapper.text()).toContain("BUDGET");
    expect(wrapper.text()).toContain("Highway Maintenance");
    expect(wrapper.text()).toContain("Safety Programs");
    expect(wrapper.find(".tux-chart-sunburst__legend").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports bare mode, custom formatters, and keyboard interaction", async () => {
    const wrapper = await mountSuspended(TuxChartSunburst, {
      props: {
        data: sampleData,
        showLegend: false,
        formatTotal: (t: number) => `$${t}k`,
        formatValue: (v: number) => `${v}k`,
      },
    });

    expect(wrapper.find(".tux-chart-sunburst--bare").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-sunburst__legend").exists()).toBe(false);

    const svg = wrapper.find("svg.tux-chart-sunburst__svg");
    await svg.trigger("keydown", { key: "ArrowRight" });

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
