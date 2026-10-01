import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxTeachingPopover from "~/components/TuxTeachingPopover.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxTeachingPopover Component", () => {
  it("renders popover with title, counter, action buttons, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxTeachingPopover, {
      props: {
        modelValue: true,
        step: 2,
        totalSteps: 5,
        title: "Attach Sensor Corpus",
        onBrand: true,
      },
      slots: {
        default: () => "<p>Scope the query to radar and telemetry datasets authorized for this project.</p>",
      },
    });

    const popover = document.querySelector(".tux-teaching-popover");
    expect(popover).not.toBeNull();
    expect(popover?.textContent).toContain("Attach Sensor Corpus");
    expect(popover?.textContent).toContain("2 of 5");
    expect(popover?.textContent).toContain("Next");
    expect(popover?.textContent).toContain("Skip");

    if (popover) {
      const violations = await runComponentAxe(popover);
      expect(violations).toEqual([]);
    }
  });

  it("handles finish action on last step and emits events", async () => {
    const wrapper = await mountSuspended(TuxTeachingPopover, {
      props: {
        modelValue: true,
        step: 3,
        totalSteps: 3,
        title: "Tour Complete",
      },
    });

    const primaryBtn = document.querySelector(".tux-teaching-popover__btn--primary") as HTMLButtonElement | null;
    expect(primaryBtn?.textContent).toContain("Got it");
    primaryBtn?.click();

    expect(wrapper.emitted("finish")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });
});
