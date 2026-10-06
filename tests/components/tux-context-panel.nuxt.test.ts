import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxContextPanel from "../../app/components/TuxContextPanel.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxContextPanel Component", () => {
  it("renders aside landmark with accessible name and slot content", async () => {
    const wrapper = await mountSuspended(TuxContextPanel, {
      props: {
        width: 360,
      },
      slots: {
        default: () => "Grounding Corpora: TxDOT Research 2020-2025",
      },
    });

    expect(wrapper.element.tagName).toBe("ASIDE");
    expect(wrapper.classes()).toContain("tux-context-panel");
    expect(wrapper.attributes("aria-label")).toBe("Conversation context");
    expect(wrapper.attributes("style")).toContain("width: 360px;");
    expect(wrapper.text()).toContain("Grounding Corpora");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom string width props", async () => {
    const wrapper = await mountSuspended(TuxContextPanel, {
      props: {
        width: "24rem",
      },
    });

    expect(wrapper.attributes("style")).toContain("width: 24rem;");
  });
});
