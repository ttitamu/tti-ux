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
});
