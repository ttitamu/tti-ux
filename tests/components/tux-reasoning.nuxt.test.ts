import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxReasoning from "../../app/components/TuxReasoning.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxReasoning Component", () => {
  it("renders collapsed reasoning accordion by default and expands on click", async () => {
    const wrapper = await mountSuspended(TuxReasoning, {
      props: {
        duration: 4.2,
        tokensPerSec: 68.5,
        defaultOpen: false,
      },
      slots: {
        default: () => "1. Querying TxDOT PeMS detector loop archive...\n2. Aggregating 15-minute speed bins.",
      },
    });

    const trigger = wrapper.find("button");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.text()).toContain("Thought for 4.2s");
    expect(wrapper.text()).toContain("(68.5 tok/s)");

    await trigger.trigger("click");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapper.text()).toContain("Querying TxDOT PeMS detector loop archive");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
