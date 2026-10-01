import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRichTextEditor from "~/components/TuxRichTextEditor.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxRichTextEditor Component", () => {
  it("renders with initial HTML content, placeholder, word count, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxRichTextEditor, {
      props: {
        modelValue: "<p>Initial transportation research findings.</p>",
        placeholder: "Write research report…",
        ariaLabel: "Report draft editor",
      },
    });

    expect(wrapper.classes()).toContain("tux-rte");
    const toolbar = wrapper.find("[role='toolbar']");
    expect(toolbar.exists()).toBe(true);
    expect(toolbar.attributes("aria-label")).toContain("Report draft editor toolbar");

    // Check count footer
    const footer = wrapper.find(".tux-rte__footer");
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toContain("words");
    expect(footer.text()).toContain("chars");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles disabled state, custom heading levels, and custom heights", async () => {
    const wrapper = await mountSuspended(TuxRichTextEditor, {
      props: {
        disabled: true,
        headingLevels: [1, 2],
        minHeight: "16rem",
      },
    });

    expect(wrapper.classes()).toContain("tux-rte--disabled");
    // When disabled, toolbar is hidden
    expect(wrapper.find("[role='toolbar']").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
