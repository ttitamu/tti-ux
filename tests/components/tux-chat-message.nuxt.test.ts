import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxChatMessage from "../../app/components/TuxChatMessage.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChatMessage Component", () => {
  it("renders user message with avatar initials and message body", async () => {
    const wrapper = await mountSuspended(TuxChatMessage, {
      props: {
        role: "user",
        author: "Marcus Chen",
        timestamp: "10:42 AM",
      },
      slots: {
        default: () => "Analyze speed compliance variances along I-35 corridor mile 12 to 24.",
      },
    });

    expect(wrapper.classes()).toContain("tux-chat-message--user");
    expect(wrapper.attributes("data-role")).toBe("user");
    expect(wrapper.find(".tux-chat-message__author").text()).toBe("Marcus Chen");
    expect(wrapper.find(".tux-chat-message__ts").text()).toBe("10:42 AM");
    expect(wrapper.find(".tux-chat-message__avatar-user").text()).toBe("MC");
    expect(wrapper.find(".tux-chat-message__content").text()).toContain("Analyze speed compliance variances");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders assistant message with sunken background, meta, and tool slots", async () => {
    const wrapper = await mountSuspended(TuxChatMessage, {
      props: {
        role: "assistant",
        author: "TTI Mobility Intelligence",
        timestamp: "10:43 AM",
        meta: "anthropic/claude-3-7-sonnet · 1.8s",
      },
      slots: {
        default: () => "Speed compliance was 84.2% across the designated segment during peak hours.",
        tools: () => h("button", { type: "button" }, "Copy Response"),
      },
    });

    expect(wrapper.classes()).toContain("tux-chat-message--assistant");
    expect(wrapper.attributes("data-role")).toBe("assistant");
    expect(wrapper.find(".tux-chat-message__meta").text()).toContain("claude-3-7-sonnet");
    expect(wrapper.find(".tux-chat-message__tools").text()).toContain("Copy Response");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
