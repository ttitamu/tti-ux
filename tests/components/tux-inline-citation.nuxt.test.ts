import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxInlineCitation from "~/components/TuxInlineCitation.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxInlineCitation Component", () => {
  it("renders academic inline citation pill with accessibility compliance", async () => {
    const wrapper = await mountSuspended(TuxInlineCitation, {
      props: {
        n: 3,
        title: "2024 Urban Mobility Report - Texas A&M Transportation Institute",
        href: "https://tti.tamu.edu/mobility",
        excerpt: "Annual congestion statistics across 494 US urban areas.",
        score: "0.94",
      },
    });

    expect(wrapper.text()).toContain("[3]");
    const link = wrapper.find(".tux-inline-citation");
    expect(link.attributes("aria-label")).toContain("Citation 3: 2024 Urban Mobility Report");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom pill label and emits select event on click", async () => {
    const wrapper = await mountSuspended(TuxInlineCitation, {
      props: {
        n: 1,
        label: "iv",
        title: "FHWA Work Zone Safety Guidelines",
      },
    });

    expect(wrapper.text()).toContain("[iv]");

    await wrapper.find(".tux-inline-citation").trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")![0]).toEqual([1]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
