import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartGeoDotDensity from "../../app/components/TuxChartGeoDotDensity.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartGeoDotDensity Component", () => {
  it("renders rejection-sampled incident dots within Texas boundaries and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartGeoDotDensity, {
      props: {
        palette: "maroon",
        title: "Autonomous Vehicle Interventions",
        showLegend: true,
        dots: 50,
        dotLegend: "1 Dot = 10 Interventions",
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Autonomous Vehicle Interventions");

    // Texas outline path
    expect(wrapper.find("path").exists()).toBe(true);

    // Circles for dots (50 data dots + 1 legend dot = 51 circles)
    const circles = wrapper.findAll("circle");
    expect(circles.length).toBe(51);

    // Title and legend text
    expect(wrapper.text()).toContain("AUTONOMOUS VEHICLE INTERVENTIONS");
    expect(wrapper.text()).toContain("1 DOT = 10 INTERVENTIONS");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports zero dots and slate palette", async () => {
    const wrapper = await mountSuspended(TuxChartGeoDotDensity, {
      props: {
        palette: "slate",
        title: "Zero-Incident Corridor",
        showLegend: false,
        dots: 0,
        dotLegend: "1 Dot = 1 Event",
      },
    });

    const circles = wrapper.findAll("circle");
    expect(circles.length).toBe(0);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
