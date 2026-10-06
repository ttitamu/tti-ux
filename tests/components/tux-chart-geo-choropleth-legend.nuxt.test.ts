import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import TuxChartGeoChoroplethLegend from "../../app/components/TuxChartGeoChoroplethLegend.vue";
import { tuxGeoRamp } from "../../app/utils/tuxChartGeo";
import { runComponentAxe } from "../axe-helper";

// Container harness providing <svg> context for SVG <g> fragment
const TuxChartGeoChoroplethLegendHarness = defineComponent({
  name: "TuxChartGeoChoroplethLegendHarness",
  props: {
    ramp: { type: Array, required: true },
    label: { type: String, required: true },
    stops: { type: Array, required: true },
    x: { type: Number, default: 24 },
    y: { type: Number, default: 100 },
  },
  setup(props) {
    return () => h("svg", {
      viewBox: "0 0 500 300",
      role: "img",
      "aria-label": "Choropleth Ramp Legend Preview",
    }, [
      h(TuxChartGeoChoroplethLegend, props as any),
    ]);
  },
});

describe("TuxChartGeoChoroplethLegend Component", () => {
  it("renders choropleth ramp rectangles, labels, tick stops, and passes accessibility checks", async () => {
    const ramp = tuxGeoRamp("maroon");
    const stops = ["0%", "25%", "50%", "75%", "100%"];

    const wrapper = await mountSuspended(TuxChartGeoChoroplethLegendHarness, {
      props: {
        ramp,
        label: "Commercial Traffic Intensity",
        stops,
        x: 24,
        y: 200,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("COMMERCIAL TRAFFIC INTENSITY");

    // 5 color swatch rectangles
    const rects = wrapper.findAll("rect");
    expect(rects.length).toBe(5);

    // Stop text markers
    for (const stop of stops) {
      expect(wrapper.text()).toContain(stop);
    }

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
