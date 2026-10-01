import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxPageHeader from "~/components/TuxPageHeader.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxPageHeader Component", () => {
  it("renders with title, eyebrow, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxPageHeader, {
      props: {
        eyebrow: "Mobility Telemetry",
        title: "Statewide Freight Corridors",
      },
      slots: {
        default: () => "Real-time arterial sensor aggregation across Texas Triangle.",
      },
    });

    expect(wrapper.text()).toContain("Mobility Telemetry");
    expect(wrapper.text()).toContain("Statewide Freight Corridors");
    expect(wrapper.text()).toContain("Real-time arterial sensor aggregation across Texas Triangle.");
    expect(wrapper.find("h1").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports level, tone, rhythm, and action buttons", async () => {
    const wrapper = await mountSuspended(TuxPageHeader, {
      props: {
        title: "Autonomous Fleet Operations",
        level: 2,
        tone: "maroon",
        rhythm: "hero",
      },
      slots: {
        actions: () => `<button type="button">Explore Corridors</button>`,
        media: () => `<div class="media-box">Telemetry Visualizer</div>`,
      },
    });

    expect(wrapper.find("h2").exists()).toBe(true);
    expect(wrapper.find(".tux-page-header--maroon").exists()).toBe(true);
    expect(wrapper.find(".tux-page-header--hero").exists()).toBe(true);
    expect(wrapper.text()).toContain("Explore Corridors");
    expect(wrapper.text()).toContain("Telemetry Visualizer");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
