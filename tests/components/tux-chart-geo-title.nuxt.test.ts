import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import TuxChartGeoTitle from "../../app/components/TuxChartGeoTitle.vue";
import { runComponentAxe } from "../axe-helper";

// Container harness providing <svg> context for SVG <text> fragment
const TuxChartGeoTitleHarness = defineComponent({
  name: "TuxChartGeoTitleHarness",
  props: {
    title: { type: String, required: true },
    x: { type: Number, default: 100 },
    y: { type: Number, default: 30 },
  },
  setup(props) {
    return () => h("svg", {
      viewBox: "0 0 500 300",
      role: "img",
      "aria-label": "Texas Map Title Preview",
    }, [
      h(TuxChartGeoTitle, props),
    ]);
  },
});

describe("TuxChartGeoTitle Component", () => {
  it("renders uppercase title text at specified SVG coordinates and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxChartGeoTitleHarness, {
      props: {
        title: "Freight Volume 2026",
        x: 480,
        y: 28,
      },
    });

    expect(wrapper.exists()).toBe(true);
    const textEl = wrapper.find("text");
    expect(textEl.exists()).toBe(true);
    expect(textEl.text()).toBe("FREIGHT VOLUME 2026");
    expect(textEl.attributes("x")).toBe("480");
    expect(textEl.attributes("y")).toBe("28");
    expect(textEl.attributes("text-anchor")).toBe("end");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
