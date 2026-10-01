import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxComposer from "~/components/TuxComposer.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxComposer Component", () => {
  it("renders with placeholder, hint, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxComposer, {
      props: {
        placeholder: "Type a prompt for transportation analysis…",
        hint: "Enter to send",
        models: [
          { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
          { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
        ],
      },
    });

    expect(wrapper.find("textarea").attributes("placeholder")).toBe("Type a prompt for transportation analysis…");
    expect(wrapper.text()).toContain("Enter to send");
    expect(wrapper.text()).toContain("Gemini 1.5 Pro");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles user input, emits submit event, and supports cancelable prop", async () => {
    const wrapper = await mountSuspended(TuxComposer, {
      props: {
        modelValue: "Analyze I-35 congestion corridors",
        cancelable: true,
        cancelLabel: "Discard prompt",
      },
    });

    expect(wrapper.find("textarea").element.value).toBe("Analyze I-35 congestion corridors");
    expect(wrapper.text()).toContain("Discard prompt");

    // Click send button
    const buttons = wrapper.findAll("button");
    const sendBtn = buttons.find(b => b.text().includes("Send"));
    expect(sendBtn).toBeDefined();
    await sendBtn!.trigger("click");

    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")![0]).toEqual(["Analyze I-35 congestion corridors"]);

    // Click cancel button
    const cancelBtn = buttons.find(b => b.text().includes("Discard prompt"));
    expect(cancelBtn).toBeDefined();
    await cancelBtn!.trigger("click");
    expect(wrapper.emitted("cancel")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
