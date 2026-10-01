import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxRemovableChip from "../../app/components/TuxRemovableChip.vue";

describe("TuxRemovableChip Component", () => {
  it("renders removable chip with label, remove button, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxRemovableChip, {
      props: {
        removable: true,
        removeLabel: "Remove I-35 corridor filter",
        size: "md",
      },
      slots: {
        default: () => "I-35 Corridor",
      },
    });

    expect(wrapper.classes()).toContain("tux-removable-chip");
    expect(wrapper.classes()).toContain("tux-removable-chip--md");
    expect(wrapper.classes()).toContain("tux-removable-chip--removable");
    expect(wrapper.text()).toContain("I-35 Corridor");

    const removeBtn = wrapper.find("button.tux-removable-chip__remove");
    expect(removeBtn.exists()).toBe(true);
    expect(removeBtn.attributes("aria-label")).toBe("Remove I-35 corridor filter");

    await removeBtn.trigger("click");
    expect(wrapper.emitted("remove")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports selected state and disabled modifier", async () => {
    const wrapper = await mountSuspended(TuxRemovableChip, {
      props: {
        selected: true,
        disabled: true,
      },
      slots: {
        default: () => "Active Filter",
      },
    });

    expect(wrapper.classes()).toContain("tux-removable-chip--selected");
    expect(wrapper.classes()).toContain("tux-removable-chip--disabled");
  });
});
