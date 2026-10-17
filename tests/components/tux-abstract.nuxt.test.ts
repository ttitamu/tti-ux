import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxAbstract from "../../app/components/TuxAbstract.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxAbstract Component", () => {
  it("renders structured abstract with background, methods, results, and conclusion", async () => {
    const wrapper = await mountSuspended(TuxAbstract, {
      props: {
        background: "Freeway bottlenecks cause significant economic delays across Texas metroplexes.",
        methods: "High-resolution telemetry was collected from 240 connected sensor stations along I-35.",
        results: "Adaptive metering reduced recurring peak delay by 18.4%.",
        conclusion: "Infrastructure telemetry provides scalable predictive routing for regional DOTs.",
        keywords: ["Connected Infrastructure", "Bottleneck Analytics", "Freeway Operations"],
        variant: "structured",
        level: 4,
      },
    });

    expect(wrapper.classes()).toContain("tux-abstract");
    expect(wrapper.find(".tux-abstract__eyebrow").text()).toBe("Abstract");

    const headings = wrapper.findAll(".tux-abstract__heading");
    expect(headings.length).toBe(4);
    expect(headings[0].text()).toBe("Background");
    expect(headings[1].text()).toBe("Methods");
    expect(headings[2].text()).toBe("Results");
    expect(headings[3].text()).toBe("Conclusion");

    expect(wrapper.text()).toContain("Freeway bottlenecks cause significant");
    expect(wrapper.text()).toContain("Connected Infrastructure");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders prose variant with custom heading level", async () => {
    const wrapper = await mountSuspended(TuxAbstract, {
      props: {
        background: "An empirical investigation into autonomous shuttle integration in university campus environments.",
        variant: "prose",
        level: 3,
      },
    });

    expect(wrapper.find(".tux-abstract__prose").exists()).toBe(true);
    expect(wrapper.text()).toContain("An empirical investigation");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("toggles between Technical Abstract and Plain-Language Legislative Brief and renders provenance", async () => {
    const wrapper = await mountSuspended(TuxAbstract, {
      props: {
        background: "Stochastic micro-simulation of connected Class 8 freight platoons along IH-10.",
        results: "Cooperative adaptive cruise control yielded 14.8% fuel savings.",
        plainSummary: "Connecting heavy freight trucks electronically on I-10 cuts diesel fuel use by nearly 15% while maintaining safe following distances.",
        policyTakeaways: [
          "Reduces corridor diesel emissions across rural Texas counties.",
          "Requires zero additional pavement widening on existing right-of-way.",
        ],
        projectNumber: "TxDOT 0-7142",
        doi: "10.1177/036119812604921",
        division: "teal",
      },
    });

    expect(wrapper.classes()).toContain("tux-abstract--division-teal");
    expect(wrapper.text()).toContain("TxDOT 0-7142");
    expect(wrapper.text()).toContain("10.1177/036119812604921");

    const buttons = wrapper.findAll(".tux-abstract__mode-btn");
    expect(buttons.length).toBe(2);

    // Switch to Plain-Language Brief
    await buttons[1]!.trigger("click");
    expect(wrapper.find(".tux-abstract__plain").exists()).toBe(true);
    expect(wrapper.text()).toContain("Connecting heavy freight trucks electronically");
    expect(wrapper.text()).toContain("Reduces corridor diesel emissions");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
