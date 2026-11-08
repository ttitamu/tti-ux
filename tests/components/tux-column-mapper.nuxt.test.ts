import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxColumnMapper, { type TargetFieldSpec } from "~/components/TuxColumnMapper.vue";
import { runComponentAxe } from "../axe-helper";

const sourceColumns = ["STA_ID", "FACILITY_NAME", "VOL_COUNT"];
const sampleRows = [
  {
    STA_ID: "TX-104",
    FACILITY_NAME: "US-190 Westbound",
    VOL_COUNT: 14250,
  },
];

const targetFields: TargetFieldSpec[] = [
  {
    key: "stationId",
    label: "Station ID",
    required: true,
    type: "string",
    aliases: ["sta_id"],
  },
  {
    key: "dailyVolume",
    label: "Daily Volume",
    required: true,
    type: "number",
    aliases: ["vol_count", "aadt"],
  },
  {
    key: "facility",
    label: "Facility Name",
    required: false,
    type: "string",
  },
];

describe("TuxColumnMapper Component", () => {
  it("renders target fields, flags numeric type mismatches, disables confirm when incomplete, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxColumnMapper, {
      props: {
        sourceColumns,
        sampleRows,
        targetFields,
        modelValue: {
          dailyVolume: "FACILITY_NAME", // Non-numeric sample on numeric field
        },
      },
    });

    expect(wrapper.text()).toContain("Station ID");
    expect(wrapper.text()).toContain("Required");
    expect(wrapper.text()).toContain("US-190 Westbound");
    expect(wrapper.text()).toContain("Type mismatch: expected numeric value");

    const confirmBtn = wrapper.find(".tux-column-mapper__btn--primary");
    expect((confirmBtn.element as HTMLButtonElement).disabled).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("auto-maps columns via fuzzy name/alias match and emits update:modelValue and confirm", async () => {
    const wrapper = await mountSuspended(TuxColumnMapper, {
      props: {
        sourceColumns,
        sampleRows,
        targetFields,
        modelValue: {},
        confirmLabel: "Apply Mapping",
      },
    });

    const autoMapBtn = wrapper
      .findAll("button")
      .find((b) => b.text() === "Auto-Map Columns");
    await autoMapBtn!.trigger("click");

    const emittedMapping = wrapper.emitted("update:modelValue")?.[0]?.[0];
    expect(emittedMapping).toEqual({
      stationId: "STA_ID",
      dailyVolume: "VOL_COUNT",
      facility: "FACILITY_NAME",
    });

    // Confirm button should now be enabled because all required fields are mapped
    const confirmBtn = wrapper.find(".tux-column-mapper__btn--primary");
    expect((confirmBtn.element as HTMLButtonElement).disabled).toBe(false);

    await confirmBtn.trigger("click");
    expect(wrapper.emitted("confirm")?.[0]?.[0]).toEqual({
      stationId: "STA_ID",
      dailyVolume: "VOL_COUNT",
      facility: "FACILITY_NAME",
    });
  });
});
