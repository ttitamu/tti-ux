import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartFrame from "~/components/TuxChartFrame.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartFrame Component", () => {
  it("renders exhibit frame with eyebrow, title, signature rule, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartFrame, {
      props: {
        eyebrow: "Exhibit 11.01",
        title: "Corridor Congestion Trends",
        subtitle: "Annual average travel time index across major metropolitan corridors.",
      },
      slots: {
        default: () => "<div class=\"chart-body\"><p>Chart Visual Content</p></div>",
      },
    });

    expect(wrapper.text()).toContain("Exhibit 11.01");
    expect(wrapper.text()).toContain("Corridor Congestion Trends");
    expect(wrapper.text()).toContain("Annual average travel time index across major metropolitan corridors.");
    expect(wrapper.text()).toContain("Chart Visual Content");
    expect(wrapper.find("h3.tux-chart-frame__title").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-frame__rule").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports bare mode, methodological notes, source citations, and custom footer slots", async () => {
    const wrapper = await mountSuspended(TuxChartFrame, {
      props: {
        title: "Speed Variation by Lane Mile",
        bare: true,
        notes: "Data gathered at 5-minute aggregation intervals via radar sensors.",
        source: "Texas A&M Transportation Institute Urban Mobility Study (2026)",
      },
      slots: {
        default: () => "<div class=\"chart-canvas\">Rendered Line Chart</div>",
        footer: () => "<div class=\"custom-citation\"><p>Sample Size: N = 1,450 sensors</p></div>",
      },
    });

    expect(wrapper.find(".tux-chart-frame--bare").exists()).toBe(true);
    expect(wrapper.find(".tux-chart-frame__rule").exists()).toBe(false);
    expect(wrapper.text()).toContain("Data gathered at 5-minute aggregation intervals");
    expect(wrapper.text()).toContain("Texas A&M Transportation Institute Urban Mobility Study (2026)");
    expect(wrapper.text()).toContain("Sample Size: N = 1,450 sensors");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders multi-sensory sonification controls, expandable accessible data table, division accent, and DOI provenance with zero axe violations", async () => {
    const wrapper = await mountSuspended(TuxChartFrame, {
      props: {
        eyebrow: "Exhibit A11Y-01",
        title: "RELLIS Skid Resistance",
        doi: "TxDOT 0-7114",
        division: "teal",
        labels: ["STA 01+00", "STA 02+50"],
        series: [{ key: "sn", label: "Skid Number", unit: "SN", data: [52.4, 44.8] }],
      },
      slots: {
        default: () => "<div class=\"chart-canvas\">Bar Chart Slot</div>",
      },
    });

    expect(wrapper.find(".tux-chart-frame--division-teal").exists()).toBe(true);
    expect(wrapper.text()).toContain("TxDOT 0-7114");
    expect(wrapper.text()).toContain("Sonify Audio");
    expect(wrapper.text()).toContain("Data Table");

    // Expand accessible data table drawer
    const buttons = wrapper.findAll("button.tux-chart-frame__tool-btn");
    const tableBtn = buttons.find((b) => b.text().includes("Data Table"));
    expect(tableBtn).toBeDefined();
    await tableBtn!.trigger("click");

    expect(wrapper.find(".tux-chart-frame__data-drawer").exists()).toBe(true);
    expect(wrapper.text()).toContain("STA 01+00");
    expect(wrapper.text()).toContain("52.4");
    expect(wrapper.text()).toContain("Skid Number (SN)");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
