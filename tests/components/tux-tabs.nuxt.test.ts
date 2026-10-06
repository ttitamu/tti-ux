import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxTabs from "../../app/components/TuxTabs.vue";

describe("TuxTabs Component", () => {
  const sampleItems = [
    { value: "overview", label: "Overview" },
    { value: "metrics", label: "Metrics" },
    { value: "logs", label: "Logs" },
  ];

  it("renders tab items and passes axe accessibility audit", async () => {
    const wrapper = await mountSuspended(TuxTabs, {
      props: {
        items: sampleItems,
        modelValue: "overview",
      },
    });

    expect(wrapper.text()).toContain("Overview");
    expect(wrapper.text()).toContain("Metrics");
    expect(wrapper.text()).toContain("Logs");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("applies bold variant class to triggers", async () => {
    const wrapper = await mountSuspended(TuxTabs, {
      props: {
        items: sampleItems,
        variant: "bold",
      },
    });

    const triggers = wrapper.findAll(".tux-tabs__trigger--bold");
    expect(triggers.length).toBeGreaterThan(0);
  });

  it("supports slim sizing and vertical orientation", async () => {
    const wrapper = await mountSuspended(TuxTabs, {
      props: {
        items: sampleItems,
        size: "slim",
        orientation: "vertical",
      },
    });

    const list = wrapper.find(".tux-tabs__list");
    expect(list.classes()).toContain("tux-tabs__list--vertical");
    expect(list.classes()).toContain("tux-tabs__list--slim");
  });
});
