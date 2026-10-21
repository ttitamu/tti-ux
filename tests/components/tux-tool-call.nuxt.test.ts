import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxToolCall from "../../app/components/TuxToolCall.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxToolCall Component", () => {
  it("renders agent tool execution header, diff stats, and collapsible output", async () => {
    const wrapper = await mountSuspended(TuxToolCall, {
      props: {
        verb: "edit",
        arg: "app/components/TuxRoadwayCrossSection.vue",
        status: "completed",
        elapsedMs: 142,
        diff: { added: 18, removed: 4 },
        defaultOpen: true,
      },
      slots: {
        default: () => "Updated superelevation cross-slope from 4.0% to 6.0%.",
      },
    });

    const trigger = wrapper.find("button");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapper.text()).toContain("edit");
    expect(wrapper.text()).toContain("app/components/TuxRoadwayCrossSection.vue");
    expect(wrapper.text()).toContain("+18");
    expect(wrapper.text()).toContain("-4");
    expect(wrapper.text()).toContain("142ms");
    expect(wrapper.text()).toContain("Updated superelevation cross-slope");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
