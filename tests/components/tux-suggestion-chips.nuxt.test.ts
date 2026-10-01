import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxSuggestionChips from "../../app/components/TuxSuggestionChips.vue";

describe("TuxSuggestionChips Component", () => {
  it("renders suggestion chips, emits prompt on pick, and passes axe audit", async () => {
    const items = [
      "Compare average commute delays across I-35 and MoPac",
      { label: "Corridor Speeds", prompt: "What are the current corridor speeds?" },
    ];

    const wrapper = await mountSuspended(TuxSuggestionChips, {
      props: {
        items,
        label: "Suggested Prompts",
      },
    });

    expect(wrapper.classes()).toContain("tux-suggestion-chips");
    expect(wrapper.attributes("aria-label")).toBe("Suggested Prompts");
    expect(wrapper.text()).toContain("Suggested Prompts");
    expect(wrapper.text()).toContain("Compare average commute delays");
    expect(wrapper.text()).toContain("Corridor Speeds");

    const chips = wrapper.findAll("button.tux-suggestion-chips__chip");
    expect(chips.length).toBe(2);

    await chips[1].trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")![0]).toEqual(["What are the current corridor speeds?", 1]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports noArrow modifier", async () => {
    const wrapper = await mountSuspended(TuxSuggestionChips, {
      props: {
        items: ["Sample Query"],
        noArrow: true,
      },
    });

    const icons = wrapper.findAll(".tux-suggestion-chips__chip-icon");
    expect(icons.length).toBe(0);
  });
});
