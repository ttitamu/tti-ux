import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRecordDiff, { type RecordDiffField } from "~/components/TuxRecordDiff.vue";
import { runComponentAxe } from "../axe-helper";

const sampleFields: RecordDiffField[] = [
  {
    key: "travel_time",
    label: "Corridor Travel Time",
    before: 20,
    after: 15,
    unit: "min",
    thresholdPct: 10, // -25% exceeds 10%
  },
  {
    key: "polling_hz",
    label: "Sensor Polling Rate",
    before: 10,
    after: 10,
    unit: "Hz",
  },
  {
    key: "lpi_sec",
    label: "Leading Pedestrian Interval",
    before: null,
    after: 5,
    unit: "sec",
  },
  {
    key: "legacy_port",
    label: "Legacy Serial Port",
    before: "COM-2",
    after: null,
  },
];

describe("TuxRecordDiff Component", () => {
  it("classifies added/removed/changed/unchanged fields, flags thresholdPct, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxRecordDiff, {
      props: {
        title: "Telemetry Controller Diff",
        beforeLabel: "Baseline",
        afterLabel: "Current",
        fields: sampleFields,
      },
    });

    expect(wrapper.text()).toContain("Telemetry Controller Diff");
    expect(wrapper.text()).toContain("1 changed · 1 added · 1 removed");
    expect(wrapper.text()).toContain("-5 min");
    expect(wrapper.text()).toContain("(-25.0%)");
    expect(wrapper.text()).toContain("Exceeds ±10%");
    expect(wrapper.text()).toContain("+ Added");
    expect(wrapper.text()).toContain("− Removed");
    expect(wrapper.text()).toContain("= Unchanged");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("filters out unchanged rows when Changes only is toggled and emits toggleFilter", async () => {
    const wrapper = await mountSuspended(TuxRecordDiff, {
      props: {
        fields: sampleFields,
        changesOnlyDefault: false,
      },
    });

    expect(wrapper.text()).toContain("Sensor Polling Rate");

    const filterBtn = wrapper.find(".tux-record-diff__filter-btn");
    expect(filterBtn.attributes("aria-pressed")).toBe("false");

    await filterBtn.trigger("click");
    expect(filterBtn.attributes("aria-pressed")).toBe("true");
    expect(wrapper.emitted("toggleFilter")?.[0]).toEqual([true]);
    expect(wrapper.text()).not.toContain("Sensor Polling Rate");
    expect(wrapper.text()).toContain("Corridor Travel Time");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
