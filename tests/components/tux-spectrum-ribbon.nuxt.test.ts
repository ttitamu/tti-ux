import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxSpectrumRibbon from "../../app/components/TuxSpectrumRibbon.vue";

describe("TuxSpectrumRibbon Component", () => {
  it("renders 5 canonical institutional spectrum bands with default props", async () => {
    const wrapper = await mountSuspended(TuxSpectrumRibbon);

    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("TTI Institutional Brand Spectrum");
    expect(wrapper.classes()).toContain("flex-row");
    expect(wrapper.classes()).toContain("h-1.5");

    const bands = wrapper.findAll(".flex-1");
    expect(bands.length).toBe(5);
    expect(bands[0].classes()).toContain("bg-spectrum-maroon");
    expect(bands[1].classes()).toContain("bg-spectrum-blue");
    expect(bands[2].classes()).toContain("bg-spectrum-teal");
    expect(bands[3].classes()).toContain("bg-spectrum-green");
    expect(bands[4].classes()).toContain("bg-spectrum-gold");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports size variants and rounded corners", async () => {
    const wrapper = await mountSuspended(TuxSpectrumRibbon, {
      props: {
        size: "lg",
        rounded: true,
      },
    });

    expect(wrapper.classes()).toContain("h-6");
    expect(wrapper.classes()).toContain("rounded-md");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports vertical orientation", async () => {
    const wrapper = await mountSuspended(TuxSpectrumRibbon, {
      props: {
        orientation: "vertical",
        size: "md",
      },
    });

    expect(wrapper.classes()).toContain("flex-col");
    expect(wrapper.classes()).toContain("w-3");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders textual division labels when showLabels is enabled on large sizes", async () => {
    const wrapper = await mountSuspended(TuxSpectrumRibbon, {
      props: {
        size: "xl",
        showLabels: true,
      },
    });

    expect(wrapper.text()).toContain("Operations");
    expect(wrapper.text()).toContain("Infrastructure");
    expect(wrapper.text()).toContain("Transit & Freight");
    expect(wrapper.text()).toContain("Safety & Environment");
    expect(wrapper.text()).toContain("Policy & Economics");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
