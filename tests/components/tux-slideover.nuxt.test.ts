import { describe, expect, it, beforeAll } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxSlideover from "../../app/components/TuxSlideover.vue";

describe("TuxSlideover Component", () => {
  beforeAll(() => {
    if (typeof HTMLDialogElement !== "undefined") {
      HTMLDialogElement.prototype.showModal =
        HTMLDialogElement.prototype.showModal ||
        function (this: HTMLDialogElement) {
          this.setAttribute("open", "");
        };
      HTMLDialogElement.prototype.close =
        HTMLDialogElement.prototype.close ||
        function (this: HTMLDialogElement) {
          this.removeAttribute("open");
        };
    }
  });

  it("renders slideover panel with title, eyebrow, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxSlideover, {
      props: {
        modelValue: true,
        title: "Incident Field Report",
        eyebrow: "Crash Detail",
        side: "right",
      },
      slots: {
        default: () => "Detailed telemetry report for sensor station 48-A.",
        footer: () => "<button type='button'>Acknowledge</button>",
      },
    });

    expect(wrapper.classes()).toContain("tux-slideover");
    expect(wrapper.classes()).toContain("tux-slideover--right");
    expect(wrapper.find(".tux-slideover__title").text()).toBe("Incident Field Report");
    expect(wrapper.find(".tux-slideover__eyebrow").text()).toBe("Crash Detail");
    expect(wrapper.find(".tux-slideover__body").text()).toContain("Detailed telemetry report for sensor station 48-A.");
    expect(wrapper.find(".tux-slideover__footer").text()).toContain("Acknowledge");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports left and bottom edge placements", async () => {
    const leftWrapper = await mountSuspended(TuxSlideover, {
      props: {
        modelValue: true,
        side: "left",
        title: "Navigation Drawer",
      },
    });
    expect(leftWrapper.classes()).toContain("tux-slideover--left");

    const bottomWrapper = await mountSuspended(TuxSlideover, {
      props: {
        modelValue: true,
        side: "bottom",
        title: "Bottom Filter Sheet",
      },
    });
    expect(bottomWrapper.classes()).toContain("tux-slideover--bottom");
  });
});
