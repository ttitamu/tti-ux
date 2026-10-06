import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxTooltip from "../../app/components/TuxTooltip.vue";

describe("TuxTooltip Component", () => {
  it("renders trigger slot content and passes axe accessibility audit", async () => {
    const wrapper = await mountSuspended(TuxTooltip, {
      props: {
        text: "Refresh dataset metrics",
      },
      slots: {
        default: () => h("button", { type: "button" }, "Refresh"),
      },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Refresh");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders with custom title and keyboard shortcuts", async () => {
    const wrapper = await mountSuspended(TuxTooltip, {
      props: {
        title: "Palette Launcher",
        text: "Quick jump to navigation surfaces",
        kbds: ["⌘", "K"],
      },
      slots: {
        default: () => h("button", { type: "button" }, "Search"),
      },
    });

    expect(wrapper.find("button").exists()).toBe(true);
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports disabled prop without crashing", async () => {
    const wrapper = await mountSuspended(TuxTooltip, {
      props: {
        text: "Disabled hover hint",
        disabled: true,
      },
      slots: {
        default: () => h("button", { type: "button" }, "Disabled Target"),
      },
    });

    expect(wrapper.text()).toContain("Disabled Target");
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
