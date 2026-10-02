import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxScrollTop from "~/components/TuxScrollTop.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxScrollTop Component", () => {
  it("renders with circular svg indicator and passes accessibility audit", async () => {
    const wrapper = await mountSuspended(TuxScrollTop, {
      props: {
        threshold: 0,
        position: "bottom-right",
      },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.attributes("aria-label")).toContain("Scroll to top of page");
    expect(wrapper.find("svg.tux-scroll-top__ring").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports stacked positioning and custom labels", async () => {
    const wrapper = await mountSuspended(TuxScrollTop, {
      props: {
        threshold: 50,
        position: "bottom-right-stacked",
        ariaLabel: "Return to top of document",
      },
    });

    expect(wrapper.find(".tux-scroll-top--bottom-right-stacked").exists()).toBe(true);
    expect(wrapper.find("button").attributes("aria-label")).toContain("Return to top of document");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
