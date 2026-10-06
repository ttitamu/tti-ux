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
});
