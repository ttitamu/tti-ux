import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxTabBar from "~/components/TuxTabBar.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxTabBar Component", () => {
  const sampleItems = [
    { label: "Home", to: "/", icon: "lucide:home" },
    { label: "Corridors", to: "/corridors", icon: "lucide:activity", badge: 3 },
    { label: "Reports", to: "/reports", icon: "lucide:file-text" },
    { label: "Settings", to: "/settings", icon: "lucide:settings", disabled: true },
  ];

  it("renders mobile tab bar navigation and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxTabBar, {
      props: {
        items: sampleItems,
        ariaLabel: "Mobile navigation",
      },
    });

    expect(wrapper.attributes("aria-label")).toBe("Mobile navigation");
    expect(wrapper.text()).toContain("Home");
    expect(wrapper.text()).toContain("Corridors");
    expect(wrapper.text()).toContain("3");
    expect(wrapper.text()).toContain("Reports");
    expect(wrapper.text()).toContain("Settings");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles disabled tab styling and aria-disabled", async () => {
    const wrapper = await mountSuspended(TuxTabBar, {
      props: {
        items: sampleItems,
      },
    });

    const disabledTab = wrapper.find(".tux-tab-bar__tab--disabled");
    expect(disabledTab.exists()).toBe(true);
    expect(disabledTab.attributes("aria-disabled")).toBe("true");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
