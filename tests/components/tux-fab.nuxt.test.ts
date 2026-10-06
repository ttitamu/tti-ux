import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxFAB from "../../app/components/TuxFAB.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFAB Component", () => {
  it("renders circular icon-only floating action button with accessible name", async () => {
    const wrapper = await mountSuspended(TuxFAB, {
      props: {
        icon: "lucide:plus",
        ariaLabel: "Add new telemetry stream",
        side: "right",
        size: "md",
      },
    });

    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.classes()).toContain("tux-fab");
    expect(wrapper.classes()).toContain("tux-fab--md");
    expect(wrapper.classes()).toContain("tux-fab--side-right");
    expect(wrapper.attributes("aria-label")).toBe("Add new telemetry stream");

    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders extended pill floating action button with slot label", async () => {
    const wrapper = await mountSuspended(TuxFAB, {
      props: {
        icon: "lucide:plus",
        extended: true,
      },
      slots: {
        default: () => "New Incident Report",
      },
    });

    expect(wrapper.classes()).toContain("tux-fab--extended");
    expect(wrapper.find(".tux-fab__label").text()).toBe("New Incident Report");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
