import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartGeoFlow from "../../app/components/TuxChartGeoFlow.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartGeoFlow Component", () => {
  it("renders origin-destination flow arcs between Texas metro nodes and passes accessibility checks", async () => {
    const sampleFlows = [
      { from: "DFW", to: "HOU", value: 85 },
      { from: "AUS", to: "SAT", value: 65 },
      { from: "HOU", to: "SAT", value: 45 },
    ];

    const wrapper = await mountSuspended(TuxChartGeoFlow, {
      props: {
        palette: "maroon",
        title: "Intercity Freight Corridor Volumes",
        showLegend: true,
        flows: sampleFlows,
        flowLegend: "Daily Freight Tons",
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Intercity Freight Corridor Volumes");

    // Texas outline + 3 flow paths
    const paths = wrapper.findAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(4);

    // Metro hub labels rendered (DFW, HOU, AUS, SAT, etc.)
    expect(wrapper.text()).toContain("DFW");
    expect(wrapper.text()).toContain("HOU");
    expect(wrapper.text()).toContain("AUS");
    expect(wrapper.text()).toContain("SAT");

    // Title and legend text
    expect(wrapper.text()).toContain("INTERCITY FREIGHT CORRIDOR VOLUMES");
    expect(wrapper.text()).toContain("DAILY FREIGHT TONS");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders safely when no flows are provided", async () => {
    const wrapper = await mountSuspended(TuxChartGeoFlow, {
      props: {
        palette: "slate",
        title: "Baseline Metro Map",
        showLegend: false,
        flows: [],
        flowLegend: "Volume",
      },
    });

    expect(wrapper.text()).toContain("BASELINE METRO MAP");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
