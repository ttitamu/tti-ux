import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxProse from "~/components/TuxProse.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxProse Component", () => {
  it("renders article element with typography content and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxProse, {
      slots: {
        default: () => `
          <h1>Urban Congestion Trends 2026</h1>
          <p>The annual congestion evaluation summarizes travel time indices across 494 urban areas.</p>
          <blockquote>Safety and throughput remain primary focal vectors.</blockquote>
          <code>var(--brand-primary)</code>
        `,
      },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe("article");
    expect(wrapper.text()).toContain("Urban Congestion Trends 2026");
    expect(wrapper.text()).toContain("The annual congestion evaluation summarizes");
    expect(wrapper.text()).toContain("Safety and throughput remain primary focal vectors.");
    expect(wrapper.text()).toContain("var(--brand-primary)");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom wrapper element via as prop", async () => {
    const wrapper = await mountSuspended(TuxProse, {
      props: {
        as: "div",
      },
      slots: {
        default: () => "<p>Nested research section in div wrapper</p>",
      },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
    expect(wrapper.text()).toContain("Nested research section in div wrapper");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
