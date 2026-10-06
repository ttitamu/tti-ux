import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMarkdownEditor from "~/components/TuxMarkdownEditor.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMarkdownEditor Component", () => {
  it("renders with placeholder, rows, character/word counters, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMarkdownEditor, {
      props: {
        modelValue: "## Executive Summary\n\nTraffic congestion decreased by 14% on the loop.",
        rows: 10,
        placeholder: "Enter research analysis...",
        ariaLabel: "Technical memorandum editor",
      },
    });

    const textarea = wrapper.find("textarea");
    expect(textarea.exists()).toBe(true);
    expect(textarea.element.value).toContain("Traffic congestion decreased by 14%");
    expect(textarea.attributes("rows")).toBe("10");
    expect(textarea.attributes("placeholder")).toBe("Enter research analysis...");
    expect(textarea.attributes("aria-label")).toBe("Technical memorandum editor");

    expect(wrapper.find(".tux-md-editor__count").text()).toContain("characters");
    expect(wrapper.find(".tux-md-editor__count").text()).toContain("words");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders formatting toolbar buttons, preview toggle, and supports disabled state", async () => {
    const wrapper = await mountSuspended(TuxMarkdownEditor, {
      props: {
        modelValue: "Initial content",
        disabled: true,
      },
    });

    expect(wrapper.classes()).toContain("tux-md-editor--disabled");
    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("disabled")).toBeDefined();

    const toolbar = wrapper.find("[role='toolbar']");
    expect(toolbar.exists()).toBe(true);
    expect(toolbar.attributes("aria-label")).toBe("Formatting");

    // All toolbar buttons should be disabled
    const buttons = toolbar.findAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(7);
    for (const btn of buttons) {
      expect(btn.attributes("disabled")).toBeDefined();
    }

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
