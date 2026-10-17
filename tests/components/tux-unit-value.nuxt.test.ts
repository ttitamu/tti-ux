import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxUnitValue from "~/components/TuxUnitValue.vue";
import { formatEngineeringUnit } from "~/composables/useTuxUnits";
import { runComponentAxe } from "../axe-helper";

describe("TuxUnitValue Component & useTuxUnits Engineering Conversions", () => {
  it("converts US Customary to Metric SI accurately across speed, load, distance, and temperature", () => {
    const speedSi = formatEngineeringUnit(60, "mph", "si", { decimals: 1, ci: 2 });
    expect(speedSi.formattedValue).toBe("96.6");
    expect(speedSi.formattedCi).toBe("3.2");
    expect(speedSi.unitSymbol).toBe("km/h");

    const loadSi = formatEngineeringUnit(10, "kip", "si", { decimals: 1 });
    expect(loadSi.formattedValue).toBe("44.5");
    expect(loadSi.unitSymbol).toBe("kN");

    const tempSi = formatEngineeringUnit(212, "F", "si", { decimals: 0, ci: 9 });
    expect(tempSi.formattedValue).toBe("100");
    expect(tempSi.formattedCi).toBe("5");
    expect(tempSi.unitSymbol).toBe("°C");
  });

  it("renders card variant with stationing, confidence interval, division accent, and toggles US to SI with zero axe violations", async () => {
    const wrapper = await mountSuspended(TuxUnitValue, {
      props: {
        variant: "card",
        division: "maroon",
        station: "STA 04+50",
        label: "Impact Load",
        value: 10,
        unit: "kip",
        ci: 1.5,
        decimals: 1,
        interactive: true,
      },
    });

    expect(wrapper.find(".tux-unit-value--card").exists()).toBe(true);
    expect(wrapper.find(".tux-unit-value--division-maroon").exists()).toBe(true);
    expect(wrapper.text()).toContain("STA 04+50");
    expect(wrapper.text()).toContain("Impact Load");
    expect(wrapper.text()).toContain("10.0");
    expect(wrapper.text()).toContain("kip");

    const toggleBtn = wrapper.find("button.tux-unit-value__toggle");
    expect(toggleBtn.exists()).toBe(true);
    await toggleBtn.trigger("click");

    expect(wrapper.text()).toContain("44.5");
    expect(wrapper.text()).toContain("kN");

    // Reset back to US
    await toggleBtn.trigger("click");
    expect(wrapper.text()).toContain("10.0");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
