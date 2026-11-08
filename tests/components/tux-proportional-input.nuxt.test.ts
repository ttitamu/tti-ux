import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxProportionalInput, {
  type ProportionalSlice,
} from "~/components/TuxProportionalInput.vue";
import { runComponentAxe } from "../axe-helper";

const sampleSlices: ProportionalSlice[] = [
  { id: "sov", code: "SOV", label: "Single-Occupancy", value: 50, locked: true },
  { id: "hov", code: "HOV", label: "Carpool", value: 20, locked: false },
  { id: "brt", code: "BRT", label: "Bus Rapid Transit", value: 10, locked: false },
];

describe("TuxProportionalInput Component", () => {
  it("renders slices, reports remaining delta when unbalanced, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxProportionalInput, {
      props: {
        modelValue: sampleSlices,
        targetTotal: 100,
        unit: "%",
        decimals: 1,
        title: "Corridor Mode Share",
      },
    });

    expect(wrapper.text()).toContain("Corridor Mode Share");
    expect(wrapper.text()).toContain("80.0% / 100.0%");
    expect(wrapper.text()).toContain("20.0% remaining");

    const lockBtn = wrapper.find('button[aria-label="Unlock Single-Occupancy"]');
    expect(lockBtn.attributes("aria-pressed")).toBe("true");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles Split Evenly, Rebalance Unlocked, lock toggle, and balanced status", async () => {
    const wrapper = await mountSuspended(TuxProportionalInput, {
      props: {
        modelValue: sampleSlices,
        targetTotal: 100,
        unit: "%",
        decimals: 1,
      },
    });

    const splitBtn = wrapper
      .findAll("button.tux-prop-input__btn")
      .find((b) => b.text() === "Split Evenly");
    await splitBtn?.trigger("click");
    // Locked SOV stays 50; remaining 50 split evenly -> 25 and 25
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([
      { id: "sov", code: "SOV", label: "Single-Occupancy", value: 50, locked: true },
      { id: "hov", code: "HOV", label: "Carpool", value: 25, locked: false },
      { id: "brt", code: "BRT", label: "Bus Rapid Transit", value: 25, locked: false },
    ]);

    const rebalanceBtn = wrapper
      .findAll("button.tux-prop-input__btn")
      .find((b) => b.text() === "Rebalance Unlocked");
    await rebalanceBtn?.trigger("click");
    // Remaining 50 scaled across 20:10 (2:1) -> 33.3 and 16.7 (sum = 100.0)
    expect(wrapper.emitted("update:modelValue")?.[1]?.[0]).toEqual([
      { id: "sov", code: "SOV", label: "Single-Occupancy", value: 50, locked: true },
      { id: "hov", code: "HOV", label: "Carpool", value: 33.3, locked: false },
      { id: "brt", code: "BRT", label: "Bus Rapid Transit", value: 16.7, locked: false },
    ]);

    const lockBtn = wrapper.find('button[aria-label="Unlock Single-Occupancy"]');
    await lockBtn.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[2]?.[0]?.[0]).toMatchObject({
      id: "sov",
      locked: false,
    });

    const balancedWrapper = await mountSuspended(TuxProportionalInput, {
      props: {
        modelValue: [
          { id: "a", label: "Mode A", value: 60 },
          { id: "b", label: "Mode B", value: 40 },
        ],
        targetTotal: 100,
      },
    });
    expect(balancedWrapper.text()).toContain("100.0% / 100.0% · Balanced");

    const violations = await runComponentAxe(balancedWrapper.element);
    expect(violations).toEqual([]);
  });
});
