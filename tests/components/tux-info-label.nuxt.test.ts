import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxInfoLabel from "../../app/components/TuxInfoLabel.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxInfoLabel Component", () => {
  it("renders label text and required marker", async () => {
    const wrapper = await mountSuspended(TuxInfoLabel, {
      props: {
        required: true,
      },
      slots: {
        default: () => "Speed limit compliance threshold",
      },
    });

    expect(wrapper.classes()).toContain("tux-info-label");
    expect(wrapper.text()).toContain("Speed limit compliance threshold");
    expect(wrapper.text()).toContain("*");
    expect(wrapper.find(".tux-info-label__required").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders info popover trigger button when info slot is present", async () => {
    const wrapper = await mountSuspended(TuxInfoLabel, {
      props: {
        infoAriaLabel: "Explanation of sensor calibration",
      },
      slots: {
        default: () => "Sensor calibration parameter",
        info: () => "Defines the variance coefficient for LiDAR point clouds.",
      },
    });

    const triggerBtn = wrapper.find("button.tux-info-label__trigger");
    expect(triggerBtn.exists()).toBe(true);
    expect(triggerBtn.attributes("aria-label")).toBe("Explanation of sensor calibration");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
