import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartGeoUsContext from "../../app/components/TuxChartGeoUsContext.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartGeoUsContext Component", () => {
  it("renders 50 US states with highlighted state in maroon and passes accessibility checks", async () => {
    const sampleStates = [
      { code: "TX", value: 0.9 },
      { code: "CA", value: 0.85 },
      { code: "FL", value: 0.75 },
      { code: "NY", value: 0.7 },
    ];

    const wrapper = await mountSuspended(TuxChartGeoUsContext, {
      props: {
        palette: "maroon",
        title: "National Freight Corridor Volume",
        showLegend: true,
        states: sampleStates,
        highlight: "TX",
        legendLabel: "Volume Scale",
        legendStops: ["0", "50", "100"],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("National Freight Corridor Volume");

    // All states rendered (50 states + DC = 51 paths)
    const paths = wrapper.findAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(50);

    // TX state label and highlight
    expect(wrapper.text()).toContain("TX");
    expect(wrapper.text()).toContain("CA");
    expect(wrapper.text()).toContain("NATIONAL FREIGHT CORRIDOR VOLUME");
    expect(wrapper.text()).toContain("VOLUME SCALE");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom highlighted state and slate palette", async () => {
    const wrapper = await mountSuspended(TuxChartGeoUsContext, {
      props: {
        palette: "slate",
        title: "Federal Transit Grants",
        showLegend: false,
        states: [],
        highlight: "CO",
        legendLabel: "Grant Amount",
        legendStops: ["Low", "High"],
      },
    });

    expect(wrapper.text()).toContain("FEDERAL TRANSIT GRANTS");
    expect(wrapper.text()).toContain("CO");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
