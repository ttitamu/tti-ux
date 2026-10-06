import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCorridorStrip from "../../app/components/TuxCorridorStrip.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCorridorStrip Component", () => {
  const sampleSegments = [
    { from: 10, to: 25, label: "Variable Speed Limit Zone", toneIndex: 2 },
    { from: 25, to: 40, label: "Work Zone Maintenance", toneIndex: 5 },
  ];

  const sampleEvents = [
    { mile: 18, label: "Automated Incident Detection Sensor", toneIndex: 1 },
    { mile: 32, label: "Ramp Metering Station", toneIndex: 3 },
  ];

  it("renders corridor figure with name, direction, segments, and events", async () => {
    const wrapper = await mountSuspended(TuxCorridorStrip, {
      props: {
        name: "I-35 Central Corridor",
        direction: "Northbound →",
        fromMile: 10,
        toMile: 40,
        segments: sampleSegments,
        events: sampleEvents,
      },
    });

    expect(wrapper.element.tagName).toBe("FIGURE");
    expect(wrapper.classes()).toContain("tux-corridor");
    expect(wrapper.attributes("role")).toBe("figure");
    expect(wrapper.attributes("aria-label")).toContain("I-35 Central Corridor");

    expect(wrapper.find(".tux-corridor__name").text()).toBe("I-35 Central Corridor");
    expect(wrapper.find(".eyebrow").text()).toBe("Northbound →");

    const segEls = wrapper.findAll(".tux-corridor__segment");
    expect(segEls.length).toBe(2);

    const eventEls = wrapper.findAll(".tux-corridor__event-dot");
    expect(eventEls.length).toBe(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports value series spark overlay and ticks", async () => {
    const wrapper = await mountSuspended(TuxCorridorStrip, {
      props: {
        fromMile: 0,
        toMile: 10,
        values: [45, 52, 60, 58, 62, 55, 48, 50, 65, 70, 68],
        valuesLabel: "Average Speed (MPH)",
        tickEvery: 2,
      },
    });

    expect(wrapper.find(".tux-corridor__values-label").text()).toBe("Average Speed (MPH)");
    expect(wrapper.find(".tux-corridor__values-path").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
