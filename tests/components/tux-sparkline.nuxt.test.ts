import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSparkline from "~/components/TuxSparkline.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxSparkline Component", () => {
  it("renders SVG trendline with accessible title, aria-label, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxSparkline, {
      props: {
        data: [10, 15, 12, 18, 25, 22, 30],
        units: "mph",
        tone: "brand",
        showArea: true,
        showLastPoint: true,
      },
    });

    const svg = wrapper.find("svg.tux-sparkline__svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("role")).toBe("img");
    expect(svg.attributes("aria-label")).toContain("Trend: 7 points");
    expect(svg.attributes("aria-label")).toContain("low 10 mph");
    expect(svg.attributes("aria-label")).toContain("high 30 mph");
    expect(wrapper.find("title").text()).toContain("Trend: 7 points");
    expect(wrapper.find("path.tux-sparkline__line").exists()).toBe(true);
    expect(wrapper.find("path.tux-sparkline__area").exists()).toBe(true);
    expect(wrapper.find("circle.tux-sparkline__last").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports delta badge, semantic tones, and custom dimensions", async () => {
    const wrapper = await mountSuspended(TuxSparkline, {
      props: {
        data: [50, 45, 40, 35, 30],
        width: 140,
        height: 40,
        tone: "error",
        showDelta: true,
        deltaFormat: "percent",
      },
    });

    expect(wrapper.find(".tux-sparkline--error").exists()).toBe(true);
    const delta = wrapper.find(".tux-sparkline__delta");
    expect(delta.exists()).toBe(true);
    expect(delta.text()).toContain("-40%");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
