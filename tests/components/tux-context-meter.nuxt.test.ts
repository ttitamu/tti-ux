import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxContextMeter from "../../app/components/TuxContextMeter.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxContextMeter Component", () => {
  it("renders trigger button with formatted percentage and accessible name", async () => {
    const wrapper = await mountSuspended(TuxContextMeter, {
      props: {
        used: 32000,
        max: 100000,
      },
    });

    const trigger = wrapper.find("button.tux-context-meter__trigger");
    expect(trigger.exists()).toBe(true);
    expect(trigger.text()).toBe("32.0%");
    expect(trigger.attributes("aria-label")).toBe("Context window: 32.0% used");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("applies warning and error tone styling at high utilization thresholds", async () => {
    const warnWrapper = await mountSuspended(TuxContextMeter, {
      props: {
        used: 70000,
        max: 100000,
      },
    });
    expect(warnWrapper.find(".tux-context-meter__trigger--warning").exists()).toBe(true);

    const errWrapper = await mountSuspended(TuxContextMeter, {
      props: {
        used: 92000,
        max: 100000,
      },
    });
    expect(errWrapper.find(".tux-context-meter__trigger--error").exists()).toBe(true);
  });
});
