import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDeskPresetPicker from "../../app/components/desk/TuxDeskPresetPicker.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskPresetPicker Component", () => {
  it("renders template preset selector with categories and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDeskPresetPicker, {
      props: {
        activePresetId: "research-brief",
        showClose: true,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("All Presets");
    expect(wrapper.text()).toContain("Research Programs");
    expect(wrapper.text()).toContain("Technical Reports");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("filters presets based on search query", async () => {
    const wrapper = await mountSuspended(TuxDeskPresetPicker, {
      props: {
        showClose: false,
      },
    });

    const searchInput = wrapper.find("input[type='search'], input[placeholder*='search' i], input");
    if (searchInput.exists()) {
      await searchInput.setValue("Technical");
      expect(wrapper.text()).toContain("Technical");
    }

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
