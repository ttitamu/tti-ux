import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartGeoDistricts from "../../app/components/TuxChartGeoDistricts.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartGeoDistricts Component", () => {
  it("renders 25 TxDOT engineering districts, centroids, title, and passes accessibility checks", async () => {
    const sampleDistricts = [
      { id: 1, value: 0.8 },  // Paris
      { id: 12, value: 0.95 }, // Houston
      { id: 14, value: 0.65 }, // Austin
      { id: 17, value: 0.4 },  // Bryan
    ];

    const wrapper = await mountSuspended(TuxChartGeoDistricts, {
      props: {
        palette: "maroon",
        title: "TxDOT District Pavement Quality",
        showLegend: true,
        districts: sampleDistricts,
        legendLabel: "Condition Score",
        legendStops: ["Poor", "Fair", "Good"],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("TxDOT District Pavement Quality");

    // 25 TxDOT districts groups
    const districtGroups = wrapper.findAll("g");
    expect(districtGroups.length).toBeGreaterThanOrEqual(25);

    // Number text labels for centroids (e.g. "17" for Bryan, "12" for Houston)
    expect(wrapper.text()).toContain("17");
    expect(wrapper.text()).toContain("12");

    // Title and legend
    expect(wrapper.text()).toContain("TXDOT DISTRICT PAVEMENT QUALITY");
    expect(wrapper.text()).toContain("CONDITION SCORE");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports slate palette and renders without legend", async () => {
    const wrapper = await mountSuspended(TuxChartGeoDistricts, {
      props: {
        palette: "slate",
        title: "Bridge Inspection Cadence",
        showLegend: false,
        districts: [],
        legendLabel: "Scale",
        legendStops: ["Min", "Max"],
      },
    });

    expect(wrapper.text()).toContain("BRIDGE INSPECTION CADENCE");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
