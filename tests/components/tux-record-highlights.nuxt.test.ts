// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxRecordHighlights from "../../app/components/TuxRecordHighlights.vue";

describe("TuxRecordHighlights Component", () => {
  it("renders title, eyebrow, and highlight metric chips", async () => {
    const wrapper = await mountSuspended(TuxRecordHighlights, {
      props: {
        title: "I-35 Smart Corridor Initiative",
        eyebrow: "Research Program",
        items: [
          { label: "Active Nodes", value: 42, change: "+3", changeTone: "positive" },
          { label: "Uptime", value: "99.98%" },
          { label: "Review Cadence", value: "90 Days" },
        ],
      },
      slots: {
        badge: () => "<span class='status-pill'>ACTIVE</span>",
        actions: () => "<button class='btn-edit'>Edit Program</button>",
      },
    });

    expect(wrapper.find("[data-testid='tux-record-highlights']").exists()).toBe(true);
    expect(wrapper.text()).toContain("I-35 Smart Corridor Initiative");
    expect(wrapper.text()).toContain("Research Program");
    expect(wrapper.text()).toContain("ACTIVE");
    expect(wrapper.text()).toContain("Edit Program");
    expect(wrapper.text()).toContain("Active Nodes");
    expect(wrapper.text()).toContain("42");
    expect(wrapper.text()).toContain("+3");
  });
});
