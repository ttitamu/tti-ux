import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartGeographic from "~/components/TuxChartGeographic.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartGeographic Component", () => {
  it("renders Texas county choropleth map, title, legend, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartGeographic, {
      props: {
        kind: "county",
        title: "Texas Statewide Crash Rates",
        legendLabel: "Crashes / 100M VMT",
        counties: [
          { fips: "48453", value: 85 }, // Travis
          { fips: "48201", value: 92 }, // Harris
          { fips: "48113", value: 78 }, // Dallas
        ],
        palette: "maroon",
      },
    });

    expect(wrapper.find(".tux-chart-geographic").exists()).toBe(true);
    expect(wrapper.attributes("data-kind")).toBe("county");
    expect(wrapper.find("svg.tux-chart-geographic__svg").exists()).toBe(true);
    expect(wrapper.text().toUpperCase()).toContain("TEXAS STATEWIDE CRASH RATES");
    expect(wrapper.text().toUpperCase()).toContain("CRASHES / 100M VMT");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports districts and dot-density kinds with custom palettes", async () => {
    const wrapper = await mountSuspended(TuxChartGeographic, {
      props: {
        kind: "districts",
        title: "TxDOT Districts Telemetry",
        districts: [
          { id: 14, value: 65 }, // Austin
          { id: 12, value: 82 }, // Houston
        ],
        palette: "slate",
        showLegend: true,
      },
    });

    expect(wrapper.attributes("data-kind")).toBe("districts");
    expect(wrapper.find("svg.tux-chart-geographic__svg").exists()).toBe(true);
    expect(wrapper.text().toUpperCase()).toContain("TXDOT DISTRICTS TELEMETRY");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
