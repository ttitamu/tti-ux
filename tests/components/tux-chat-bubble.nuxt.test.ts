import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChatBubble from "~/components/TuxChatBubble.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChatBubble Component", () => {
  it("renders assistant speech bubble with suggestion chips and passes axe", async () => {
    const wrapper = await mountSuspended(TuxChatBubble, {
      props: {
        role: "assistant",
        title: "Assistant",
        subtitle: "Transportation Research",
        suggestions: ["Summarize Corridors", "Export Data"],
      },
      slots: {
        default: () => "Analysis complete for statewide freeways.",
      },
    });

    expect(wrapper.text()).toContain("Assistant");
    expect(wrapper.text()).toContain("Transportation Research");
    expect(wrapper.text()).toContain("Analysis complete for statewide freeways.");
    expect(wrapper.text()).toContain("Summarize Corridors");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders trigger launcher mode with teaser and activity states", async () => {
    const wrapper = await mountSuspended(TuxChatBubble, {
      props: {
        mode: "trigger",
        title: "Assistant",
        state: "attention",
        teaser: "Need assistance with this route?",
      },
    });

    const triggerBtn = wrapper.find("button.tux-chat-bubble__launcher-btn");
    expect(triggerBtn.exists()).toBe(true);
    expect(triggerBtn.classes()).toContain("tux-chat-bubble__launcher-btn--attention");
    expect(wrapper.text()).toContain("Need assistance with this route?");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits events for dismiss and suggestion clicks", async () => {
    const wrapper = await mountSuspended(TuxChatBubble, {
      props: {
        role: "assistant",
        dismissible: true,
        suggestions: ["Analyze"],
      },
    });

    const chipBtn = wrapper.find("button.rounded-full");
    expect(chipBtn.exists()).toBe(true);
    await chipBtn.trigger("click");
    expect(wrapper.emitted("select-suggestion")?.[0]).toEqual(["Analyze"]);

    const dismissBtn = wrapper.find("button[aria-label='Dismiss chat bubble']");
    expect(dismissBtn.exists()).toBe(true);
    await dismissBtn.trigger("click");
    expect(wrapper.emitted("dismiss")).toBeTruthy();
  });
});
