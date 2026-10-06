import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMapMarker from "~/components/TuxMapMarker.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMapMarker Component", () => {
  it("renders intersection, corridor, and site markers with role='img' and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMapMarker, {
      props: {
        kind: "intersection",
        size: "md",
        title: "I-35 & US-290 Interchange",
      },
    });

    const svg = wrapper.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("role")).toBe("img");
    expect(svg.attributes("aria-label")).toBe("I-35 & US-290 Interchange");
    expect(svg.find("title").text()).toBe("I-35 & US-290 Interchange");
    expect(svg.attributes("width")).toBe("26");
    expect(svg.attributes("height")).toBe("26");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders incident and treatment markers with tone index override and sizes", async () => {
    const incidentWrapper = await mountSuspended(TuxMapMarker, {
      props: {
        kind: "incident",
        size: "lg",
        toneIndex: 7,
      },
    });

    const incidentSvg = incidentWrapper.find("svg");
    expect(incidentSvg.attributes("width")).toBe("36");
    expect(incidentSvg.attributes("height")).toBe("36");
    expect(incidentSvg.classes()).toContain("tux-map-marker--c7");
    expect(incidentSvg.text()).toContain("!");

    const incidentViolations = await runComponentAxe(incidentWrapper.element);
    expect(incidentViolations).toEqual([]);

    const treatmentWrapper = await mountSuspended(TuxMapMarker, {
      props: {
        kind: "treatment",
        size: "sm",
      },
    });

    const treatmentSvg = treatmentWrapper.find("svg");
    expect(treatmentSvg.attributes("width")).toBe("18");
    expect(treatmentSvg.attributes("height")).toBe("18");
    expect(treatmentSvg.attributes("aria-label")).toBe("treatment marker");

    const treatmentViolations = await runComponentAxe(treatmentWrapper.element);
    expect(treatmentViolations).toEqual([]);
  });
});
