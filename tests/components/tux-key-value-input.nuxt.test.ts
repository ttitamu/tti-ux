import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxKeyValueInput, {
  type KeySchemaDef,
  type KeyValuePair,
} from "~/components/TuxKeyValueInput.vue";
import { runComponentAxe } from "../axe-helper";

const sampleSchema: KeySchemaDef[] = [
  { key: "corridor_id", label: "Corridor ID", required: true, suggestions: ["IH-35", "US-290"] },
  { key: "sensor_type", label: "Sensor Type", required: true, suggestions: ["radar", "loop"] },
  { key: "qc_tier", label: "QC Tier", suggestions: ["raw", "calibrated"] },
];

describe("TuxKeyValueInput Component", () => {
  it("renders rows, highlights missing required keys, and passes accessibility checks", async () => {
    const initialPairs: KeyValuePair[] = [
      { key: "corridor_id", value: "IH-35" },
    ];

    const wrapper = await mountSuspended(TuxKeyValueInput, {
      props: {
        modelValue: initialPairs,
        schema: sampleSchema,
      },
    });

    expect(wrapper.text()).toContain("Missing required keys:");
    expect(wrapper.text()).toContain("sensor_type");
    expect(wrapper.text()).toContain("Add missing required keys");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("populates missing required keys, warns on duplicate/unapproved keys, and adds/removes rows", async () => {
    const wrapper = await mountSuspended(TuxKeyValueInput, {
      props: {
        modelValue: [
          { key: "corridor_id", value: "IH-35" },
          { key: "corridor_id", value: "US-290" },
          { key: "custom_attr", value: "beta" },
        ],
        schema: sampleSchema,
        strictKeys: true,
      },
    });

    expect(wrapper.text()).toContain("Duplicate key");
    expect(wrapper.text()).toContain("corridor_id");
    expect(wrapper.text()).toContain("Unapproved key");
    expect(wrapper.text()).toContain("custom_attr");

    const addMissingBtn = wrapper.find("button.tux-kv-input__missing-btn");
    await addMissingBtn.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([
      { key: "corridor_id", value: "IH-35" },
      { key: "corridor_id", value: "US-290" },
      { key: "custom_attr", value: "beta" },
      { key: "sensor_type", value: "" },
    ]);

    const addBtn = wrapper.find("button.tux-kv-input__add");
    await addBtn.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]?.[0]).toHaveLength(4);

    const removeButtons = wrapper.findAll("button.tux-kv-input__remove");
    await removeButtons[2]?.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[2]?.[0]).toEqual([
      { key: "corridor_id", value: "IH-35" },
      { key: "corridor_id", value: "US-290" },
    ]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
