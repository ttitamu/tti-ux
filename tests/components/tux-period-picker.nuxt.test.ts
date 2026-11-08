import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxPeriodPicker, {
  type PeriodPreset,
  type PeriodRangeValue,
} from "~/components/TuxPeriodPicker.vue";
import { runComponentAxe } from "../axe-helper";

const samplePresets: PeriodPreset[] = [
  { key: "mar", label: "March Cycle", start: "2026-03-01", end: "2026-03-31" },
  { key: "apr", label: "April Cycle", start: "2026-04-01", end: "2026-04-30" },
];

const initialValue: PeriodRangeValue = {
  start: "2026-03-01",
  end: "2026-03-31",
  preset: "mar",
  comparePrevious: true,
};

describe("TuxPeriodPicker Component", () => {
  it("renders presets, date inputs, duration summary, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxPeriodPicker, {
      props: {
        modelValue: initialValue,
        presets: samplePresets,
        label: "Corridor Reporting Period",
      },
    });

    expect(wrapper.text()).toContain("Corridor Reporting Period");
    expect(wrapper.text()).toContain("31 days");
    expect(wrapper.text()).toContain("March Cycle");
    expect(wrapper.text()).toContain("Compare to prior period");

    const activePill = wrapper
      .findAll("button.tux-period-picker__preset")
      .find((b) => b.text() === "March Cycle");
    expect(activePill?.attributes("aria-pressed")).toBe("true");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits update:modelValue on preset selection, cycle stepping, compare toggle, and apply", async () => {
    const wrapper = await mountSuspended(TuxPeriodPicker, {
      props: {
        modelValue: initialValue,
        presets: samplePresets,
        stepDays: 7,
      },
    });

    const aprilPill = wrapper
      .findAll("button.tux-period-picker__preset")
      .find((b) => b.text() === "April Cycle");
    await aprilPill?.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      {
        start: "2026-04-01",
        end: "2026-04-30",
        preset: "apr",
        comparePrevious: true,
      },
    ]);

    const nextBtn = wrapper.find('button[aria-label="Next period"]');
    await nextBtn.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([
      {
        start: "2026-03-08",
        end: "2026-04-07",
        preset: undefined,
        comparePrevious: true,
      },
    ]);

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(false);
    expect(wrapper.emitted("update:modelValue")?.[2]?.[0]).toMatchObject({
      comparePrevious: false,
    });

    const applyBtn = wrapper.find("button.tux-period-picker__apply");
    await applyBtn.trigger("click");
    expect(wrapper.emitted("apply")?.[0]).toEqual([initialValue]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
