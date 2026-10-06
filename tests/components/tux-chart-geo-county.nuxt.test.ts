import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartGeoCounty from "../../app/components/TuxChartGeoCounty.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartGeoCounty Component", () => {
  it("renders Texas county boundaries, title, legend, and passes accessibility checks", async () => {
    const sampleCounties = [
      { fips: "48001", value: 0.8 }, // Anderson
      { fips: "48453", value: 0.95 }, // Travis
      { fips: "48201", value: 0.7 }, // Harris
      { fips: "48041", value: 0.4 }, // Brazos
    ];

    const wrapper = await mountSuspended(TuxChartGeoCounty, {
      props: {
        palette: "maroon",
        title: "County Vehicle Density",
        showLegend: true,
        counties: sampleCounties,
        legendLabel: "Density Index",
        legendStops: ["Low", "Mid", "High"],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("County Vehicle Density");

    // Check SVG paths (254 counties + 1 state outline)
    const paths = wrapper.findAll("path");
    expect(paths.length).toBeGreaterThan(250);

    // Title and legend text
    expect(wrapper.text()).toContain("COUNTY VEHICLE DENSITY");
    expect(wrapper.text()).toContain("DENSITY INDEX");
    expect(wrapper.text()).toContain("High");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports slate palette and hidden legend", async () => {
    const wrapper = await mountSuspended(TuxChartGeoCounty, {
      props: {
        palette: "slate",
        title: "Commercial Freight Distribution",
        showLegend: false,
        counties: [],
        legendLabel: "Scale",
        legendStops: ["0", "100"],
      },
    });

    expect(wrapper.text()).toContain("COMMERCIAL FREIGHT DISTRIBUTION");
    expect(wrapper.find(".tux-chart-geo-choropleth-legend").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
