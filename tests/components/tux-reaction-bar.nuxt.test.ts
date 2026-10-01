import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxReactionBar from "~/components/TuxReactionBar.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxReactionBar Component", () => {
  it("renders reaction buttons with labels, counts, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxReactionBar, {
      props: {
        modelValue: ["helpful"],
        counts: {
          helpful: 42,
          question: 5,
        },
      },
    });

    expect(wrapper.text()).toContain("Helpful");
    expect(wrapper.text()).toContain("42");
    expect(wrapper.text()).toContain("Question");
    expect(wrapper.text()).toContain("5");
    expect(wrapper.text()).toContain("Disagree");

    const buttons = wrapper.findAll("button.tux-reaction-bar__btn");
    expect(buttons.length).toBe(3);
    expect(buttons[0]?.attributes("aria-pressed")).toBe("true");
    expect(buttons[1]?.attributes("aria-pressed")).toBe("false");
    expect(buttons[2]?.attributes("aria-pressed")).toBe("false");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("toggles active reaction and emits update:modelValue and react events", async () => {
    const wrapper = await mountSuspended(TuxReactionBar, {
      props: {
        modelValue: [],
        size: "sm",
      },
    });

    expect(wrapper.find(".tux-reaction-bar--sm").exists()).toBe(true);

    const buttons = wrapper.findAll("button.tux-reaction-bar__btn");
    await buttons[0]?.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["helpful"]]);
    expect(wrapper.emitted("react")).toBeTruthy();
    expect(wrapper.emitted("react")?.[0]).toEqual(["helpful", true]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
