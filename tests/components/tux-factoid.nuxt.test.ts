import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxFactoid from "../../app/components/TuxFactoid.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFactoid Component", () => {
  const sampleItems = [
    { value: "4.2", suffix: "M", label: "Annual daily vehicle miles traveled", source: "TxDOT 2024" },
    { value: 98, suffix: "%", label: "Sensor uptime across corridor testbeds", source: "TTI Telemetry" },
    { value: 12, label: "Active connected autonomous vehicle lanes", source: "FHWA Pilot" },
  ];

  it("renders factoid items with values, suffixes, labels, and sources", async () => {
    const wrapper = await mountSuspended(TuxFactoid, {
      props: {
        items: sampleItems,
        title: "Corridor Performance Metrics",
        eyebrow: "Institutional Research",
        dek: "High-density telemetry summaries from the I-35 connected corridor.",
        columns: 3,
      },
    });

    expect(wrapper.classes()).toContain("tux-factoid");
    expect(wrapper.find(".tux-factoid__title").text()).toBe("Corridor Performance Metrics");
    expect(wrapper.find(".tux-factoid__eyebrow").text()).toBe("Institutional Research");
    expect(wrapper.find(".tux-factoid__dek").text()).toContain("High-density telemetry summaries");

    const cells = wrapper.findAll(".tux-factoid__cell");
    expect(cells.length).toBe(3);
    expect(cells[0].text()).toContain("4.2");
    expect(cells[0].text()).toContain("M");
    expect(cells[0].text()).toContain("Annual daily vehicle miles traveled");
    expect(cells[0].text()).toContain("TxDOT 2024");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports bold and elegant styling variants", async () => {
    const wrapperBold = await mountSuspended(TuxFactoid, {
      props: {
        items: sampleItems.slice(0, 2),
        variant: "bold",
        columns: 4,
      },
    });
    expect(wrapperBold.classes()).toContain("tux-factoid--bold");

    const wrapperElegant = await mountSuspended(TuxFactoid, {
      props: {
        items: sampleItems.slice(0, 2),
        variant: "elegant",
        title: "Historical Impact",
      },
    });
    expect(wrapperElegant.classes()).toContain("tux-factoid--elegant");

    const violations = await runComponentAxe(wrapperBold.element);
    expect(violations).toEqual([]);
  });
});
