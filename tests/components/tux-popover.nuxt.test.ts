import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxPopover from "../../app/components/TuxPopover.vue";

describe("TuxPopover Component", () => {
  it("renders trigger and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxPopover, {
      props: {
        title: "Telemetry Ingest Health",
        body: "Monitors loop detector uptime across the corridor.",
        width: "md",
      },
      slots: {
        default: () =>
          h("button", { type: "button", id: "popover-trigger" }, "Inspect Telemetry"),
      },
    });

    const trigger = wrapper.find("#popover-trigger");
    expect(trigger.exists()).toBe(true);
    expect(trigger.text()).toBe("Inspect Telemetry");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports disabled state", async () => {
    const wrapper = await mountSuspended(TuxPopover, {
      props: {
        disabled: true,
      },
      slots: {
        default: () =>
          h("button", { type: "button", disabled: true }, "Disabled Trigger"),
      },
    });

    const trigger = wrapper.find("button");
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes("disabled")).toBeDefined();
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
