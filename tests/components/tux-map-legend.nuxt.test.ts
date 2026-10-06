import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMapLegend from "~/components/TuxMapLegend.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMapLegend Component", () => {
  it("renders stacked categorical legend with title, swatches, labels, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMapLegend, {
      props: {
        title: "Corridor Congestion Levels",
        eyebrow: "TxDOT Telemetry",
        layout: "stacked",
        entries: [
          { label: "Severe (>85% capacity)", color: "#500000", shape: "square" },
          { label: "Moderate (60-85%)", color: "#CFA935", shape: "circle" },
          { label: "Free Flow (<60%)", color: "#2B547E", shape: "line" },
        ],
      },
    });

    expect(wrapper.text()).toContain("TxDOT Telemetry");
    expect(wrapper.text()).toContain("Corridor Congestion Levels");
    expect(wrapper.text()).toContain("Severe (>85% capacity)");
    expect(wrapper.text()).toContain("Moderate (60-85%)");
    expect(wrapper.text()).toContain("Free Flow (<60%)");

    expect(wrapper.find(".tux-map-legend--stacked").exists()).toBe(true);
    expect(wrapper.findAll(".tux-map-legend__row").length).toBe(3);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders inline and gradient layouts correctly with custom stops and min/max labels", async () => {
    const inlineWrapper = await mountSuspended(TuxMapLegend, {
      props: {
        layout: "inline",
        entries: [
          { label: "Urban", color: "#500000" },
          { label: "Rural", color: "#2B547E" },
        ],
      },
    });

    expect(inlineWrapper.find(".tux-map-legend--inline").exists()).toBe(true);
    expect(inlineWrapper.findAll(".tux-map-legend__inline-row").length).toBe(2);

    const inlineViolations = await runComponentAxe(inlineWrapper.element);
    expect(inlineViolations).toEqual([]);

    const gradientWrapper = await mountSuspended(TuxMapLegend, {
      props: {
        layout: "gradient",
        gradient: {
          minLabel: "0 mph",
          maxLabel: "75+ mph",
          stops: [
            { color: "#500000", label: "0" },
            { color: "#CFA935", label: "35" },
            { color: "#2B547E", label: "75+" },
          ],
        },
      },
    });

    expect(gradientWrapper.find(".tux-map-legend--gradient").exists()).toBe(true);
    expect(gradientWrapper.text()).toContain("0 mph");
    expect(gradientWrapper.text()).toContain("75+ mph");
    expect(gradientWrapper.text()).toContain("35");

    const gradientViolations = await runComponentAxe(gradientWrapper.element);
    expect(gradientViolations).toEqual([]);
  });
});
