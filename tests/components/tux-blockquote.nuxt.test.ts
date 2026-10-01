import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxBlockquote from "../../app/components/TuxBlockquote.vue";

describe("TuxBlockquote Component", () => {
  it("renders centered editorial pull quote with attribution and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxBlockquote, {
      props: {
        quote: "Transportation research must translate into saved lives on Texas roadways.",
        attribution: "Gregory Winfree",
        role: "Agency Director, TTI",
        layout: "centered",
      },
    });

    expect(wrapper.classes()).toContain("tux-blockquote--centered");
    expect(wrapper.text()).toContain("Transportation research must translate into saved lives on Texas roadways.");
    expect(wrapper.text()).toContain("Gregory Winfree");
    expect(wrapper.text()).toContain("Agency Director, TTI");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports drop-cap magazine layout", async () => {
    const wrapper = await mountSuspended(TuxBlockquote, {
      props: {
        quote: "Innovation begins in our crash testing facilities.",
        layout: "drop-cap",
      },
    });

    expect(wrapper.classes()).toContain("tux-blockquote--drop-cap");
    const dropCap = wrapper.find(".tux-blockquote__drop-cap");
    expect(dropCap.exists()).toBe(true);
    expect(dropCap.text()).toBe("I");
  });
});
