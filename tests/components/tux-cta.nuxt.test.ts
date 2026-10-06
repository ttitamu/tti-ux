import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCTA from "../../app/components/TuxCTA.vue";

describe("TuxCTA Component", () => {
  it("renders heading title, eyebrow, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxCTA, {
      props: {
        title: "Join the Connected Transportation Research Initiative",
        eyebrow: "partner with tti",
        dek: "Collaborate with researchers on national transit resilience studies.",
        tone: "maroon",
      },
    });

    expect(wrapper.classes()).toContain("tux-cta--maroon");
    expect(wrapper.text()).toContain("Join the Connected Transportation Research Initiative");
    expect(wrapper.text()).toContain("partner with tti");
    expect(wrapper.text()).toContain("Collaborate with researchers on national transit resilience studies.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports action slot projection and tone variants", async () => {
    const wrapper = await mountSuspended(TuxCTA, {
      props: {
        title: "Subscribe to Research Telemetry",
        tone: "gold",
        variant: "bold",
      },
      slots: {
        actions: () => h("button", { class: "test-action-btn" }, "Subscribe Now"),
      },
    });

    expect(wrapper.classes()).toContain("tux-cta--gold");
    expect(wrapper.classes()).toContain("tux-cta--bold");
    expect(wrapper.find(".test-action-btn").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
