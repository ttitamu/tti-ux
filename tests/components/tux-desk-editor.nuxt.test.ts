import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDeskEditor from "../../app/components/desk/TuxDeskEditor.client.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskEditor Component", () => {
  const sampleDoc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Documentation narrative text." }],
      },
    ],
  };

  it("renders editor toolbar, editable canvas, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDeskEditor, {
      props: {
        modelValue: sampleDoc,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("tux-desk-editor");

    // Verify toolbar buttons
    const boldBtn = wrapper.find("button[title*='Bold']");
    expect(boldBtn.exists()).toBe(true);

    const italicBtn = wrapper.find("button[title*='Italic']");
    expect(italicBtn.exists()).toBe(true);

    const heading2Btn = wrapper.find("button[title*='Heading 2']");
    expect(heading2Btn.exists()).toBe(true);

    const listBtn = wrapper.find("button[title*='Bullet list']");
    expect(listBtn.exists()).toBe(true);

    // Verify module palette rendered at bottom
    expect(wrapper.find(".tux-desk-palette").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports seamless mode and disabled state", async () => {
    const wrapper = await mountSuspended(TuxDeskEditor, {
      props: {
        modelValue: sampleDoc,
        seamless: true,
        disabled: true,
      },
    });

    expect(wrapper.classes()).toContain("tux-desk-editor--seamless");
    // In disabled mode, toolbar and bottom palette are hidden
    expect(wrapper.find(".tux-desk-editor__toolbar").exists()).toBe(false);
    expect(wrapper.find(".tux-desk-palette").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
