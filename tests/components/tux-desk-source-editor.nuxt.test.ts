import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDeskSourceEditor from "../../app/components/desk/TuxDeskSourceEditor.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskSourceEditor Component", () => {
  const sampleDoc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Autonomous transport infrastructure testing." }],
      },
    ],
  };

  it("renders format switchers, code textarea, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDeskSourceEditor, {
      props: {
        doc: sampleDoc,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("tux-desk-source-editor");

    // Format tabs
    expect(wrapper.text()).toContain("Markdown (MDC)");
    expect(wrapper.text()).toContain("HTML Template");
    expect(wrapper.text()).toContain("JSON AST");

    // Textarea input
    const textarea = wrapper.find("textarea");
    expect(textarea.exists()).toBe(true);
    expect(textarea.attributes("aria-label")).toBe("Source code");
    expect(textarea.element.value).toContain("Autonomous transport infrastructure testing.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("switches format to JSON and displays valid JSON AST", async () => {
    const wrapper = await mountSuspended(TuxDeskSourceEditor, {
      props: {
        doc: sampleDoc,
      },
    });

    const jsonBtn = wrapper
      .findAll("button")
      .find((b) => b.text().includes("JSON AST"));
    expect(jsonBtn).toBeDefined();
    await jsonBtn?.trigger("click");

    const textarea = wrapper.find("textarea");
    expect(textarea.element.value).toContain('"type": "doc"');

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles input changes and emits update:doc", async () => {
    const wrapper = await mountSuspended(TuxDeskSourceEditor, {
      props: {
        doc: sampleDoc,
      },
    });

    const jsonBtn = wrapper
      .findAll("button")
      .find((b) => b.text().includes("JSON AST"));
    await jsonBtn?.trigger("click");

    const textarea = wrapper.find("textarea");
    const updatedAst = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Updated paragraph." }],
        },
      ],
    };

    await textarea.setValue(JSON.stringify(updatedAst));

    // When dirty, "Apply to Canvas" button appears
    const applyBtn = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Apply to Canvas"));
    expect(applyBtn).toBeDefined();
    await applyBtn?.trigger("click");

    expect(wrapper.emitted("update:doc")).toBeTruthy();
    expect(wrapper.emitted("update:doc")?.[0]).toEqual([updatedAst]);
  });
});
