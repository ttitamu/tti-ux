import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxBranchNav from "../../app/components/TuxBranchNav.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxBranchNav Component", () => {
  it("renders alternative navigation with counter and buttons", async () => {
    const wrapper = await mountSuspended(TuxBranchNav, {
      props: {
        modelValue: 2,
        total: 5,
        ariaLabel: "Model response variants",
      },
    });

    expect(wrapper.element.tagName).toBe("NAV");
    expect(wrapper.classes()).toContain("tux-branch-nav");
    expect(wrapper.attributes("aria-label")).toBe("Model response variants");

    expect(wrapper.find(".tux-branch-nav__position").text()).toContain("2 of 5");

    const buttons = wrapper.findAll("button.tux-branch-nav__btn");
    expect(buttons.length).toBe(2);

    await buttons[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([3]);
    expect(wrapper.emitted("next")).toHaveLength(1);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("hides when hideSingleton is true and total is 1", async () => {
    const wrapper = await mountSuspended(TuxBranchNav, {
      props: {
        modelValue: 1,
        total: 1,
        hideSingleton: true,
      },
    });

    expect(wrapper.find(".tux-branch-nav").exists()).toBe(false);
  });
});
