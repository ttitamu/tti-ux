import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxDropdown from "../../app/components/TuxDropdown.vue";

describe("TuxDropdown Component", () => {
  const sampleItems = [
    { label: "Corridor Analytics", to: "/research/corridors", description: "Real-time congestion and volume metrics" },
    { label: "Safety Studies", to: "/research/safety", description: "Empirical crash rate evaluations" },
    { label: "Transit Network", to: "/research/transit" },
  ];

  it("renders trigger label and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: {
        label: "Research Areas",
        items: sampleItems,
      },
    });

    const trigger = wrapper.find("button.tux-dropdown__trigger");
    expect(trigger.exists()).toBe(true);
    expect(trigger.text()).toContain("Research Areas");
    expect(trigger.attributes("aria-haspopup")).toBe("true");
    expect(trigger.attributes("aria-expanded")).toBe("false");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("toggles panel visibility on trigger click", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: {
        label: "Programs",
        items: sampleItems,
      },
    });

    const trigger = wrapper.find("button.tux-dropdown__trigger");
    await trigger.trigger("click");

    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find(".tux-dropdown__panel").isVisible()).toBe(true);
    expect(wrapper.text()).toContain("Corridor Analytics");
    expect(wrapper.text()).toContain("Real-time congestion and volume metrics");
  });

  it("renders direct navigation link trigger when 'to' is provided", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: {
        label: "Overview",
        to: "/research",
        items: sampleItems,
      },
    });

    const link = wrapper.find("a.tux-dropdown__trigger");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("/research");
  });
});
