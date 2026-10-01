import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxIconFeature from "~/components/TuxIconFeature.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxIconFeature Component", () => {
  const sampleItems = [
    {
      icon: "lucide:radar",
      title: "Connected Vehicle Infrastructure",
      body: "Edge sensors and roadside communication units monitoring corridor velocity.",
      cta: { label: "Explore Corridor Tech", to: "/research/connected" },
    },
    {
      icon: "lucide:shield-check",
      title: "Statewide Safety Analytics",
      body: "Predictive crash modeling and intersection safety telemetry across Texas.",
      cta: { label: "View Safety Center", href: "https://tti.tamu.edu/safety" },
    },
  ];

  it("renders feature items in grid layout with accessibility compliance", async () => {
    const wrapper = await mountSuspended(TuxIconFeature, {
      props: {
        items: sampleItems,
        layout: "grid",
        columns: 2,
      },
    });

    expect(wrapper.find(".tux-icon-feature--grid").exists()).toBe(true);
    expect(wrapper.find(".tux-icon-feature--cols-2").exists()).toBe(true);
    expect(wrapper.text()).toContain("Connected Vehicle Infrastructure");
    expect(wrapper.text()).toContain("Statewide Safety Analytics");
    expect(wrapper.text()).toContain("Explore Corridor Tech");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders feature items in list layout", async () => {
    const wrapper = await mountSuspended(TuxIconFeature, {
      props: {
        items: sampleItems,
        layout: "list",
      },
    });

    expect(wrapper.find(".tux-icon-feature--list").exists()).toBe(true);
    expect(wrapper.text()).toContain("Edge sensors and roadside communication units");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
