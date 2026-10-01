import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCallout from "../../app/components/TuxCallout.vue";

describe("TuxCallout Component", () => {
  it("renders fact callout with canonical label and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxCallout, {
      props: {
        kind: "fact",
      },
      slots: {
        default: () => "Connected vehicle data reduced peak-hour queue delay by 18 percent.",
      },
    });

    expect(wrapper.attributes("role")).toBe("note");
    expect(wrapper.classes()).toContain("tux-callout");
    expect(wrapper.text()).toContain("Worth noting");
    expect(wrapper.text()).toContain("Connected vehicle data reduced peak-hour queue delay");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("maps stat kind to 'Key finding' and quote kind to 'Voice'", async () => {
    const statWrapper = await mountSuspended(TuxCallout, {
      props: { kind: "stat" },
      slots: { default: () => "Crash rates dropped significantly." },
    });
    expect(statWrapper.text()).toContain("Key finding");

    const quoteWrapper = await mountSuspended(TuxCallout, {
      props: { kind: "quote" },
      slots: { default: () => "Stakeholder feedback." },
    });
    expect(quoteWrapper.text()).toContain("Voice");
  });

  it("supports custom eyebrow and styling variants", async () => {
    const wrapper = await mountSuspended(TuxCallout, {
      props: {
        eyebrow: "Field Measurement",
        variant: "bold",
      },
      slots: {
        default: () => "Sensor network deployed across I-35 corridor.",
      },
    });

    expect(wrapper.classes()).toContain("tux-callout--bold");
    expect(wrapper.text()).toContain("Field Measurement");
    const bars = wrapper.findAll(".tux-callout__bar");
    expect(bars.length).toBe(3);
  });
});
