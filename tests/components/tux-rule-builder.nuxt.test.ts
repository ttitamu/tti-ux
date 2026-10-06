import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRuleBuilder, { type FieldDef, type Group } from "~/components/TuxRuleBuilder.vue";
import { runComponentAxe } from "../axe-helper";

const sampleFields: FieldDef[] = [
  { key: "speed", label: "Speed (mph)", type: "number" },
  {
    key: "facility",
    label: "Facility Type",
    type: "select",
    options: [
      { value: "freeway", label: "Freeway" },
      { value: "arterial", label: "Arterial" },
    ],
  },
  { key: "active", label: "Sensor Active", type: "boolean" },
];

const sampleGroup: Group = {
  id: "g-root",
  kind: "group",
  combinator: "AND",
  children: [
    { id: "r-1", kind: "rule", field: "speed", operator: ">", value: 65 },
  ],
};

describe("TuxRuleBuilder Component", () => {
  it("renders rule builder tree with actions and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxRuleBuilder, {
      props: {
        modelValue: sampleGroup,
        fields: sampleFields,
        showActions: true,
      },
    });

    expect(wrapper.text()).toContain("AND");
    expect(wrapper.text()).toContain("OR");
    expect(wrapper.text()).toContain("Speed (mph)");
    expect(wrapper.text()).toContain("Apply");
    expect(wrapper.text()).toContain("Clear");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles apply and clear emissions and supports showActions=false", async () => {
    const wrapper = await mountSuspended(TuxRuleBuilder, {
      props: {
        modelValue: sampleGroup,
        fields: sampleFields,
        showActions: true,
      },
    });

    const applyBtn = wrapper.findAll("button.tux-rule-builder__btn").find((b) => b.text().includes("Apply"));
    await applyBtn?.trigger("click");
    expect(wrapper.emitted("apply")).toBeTruthy();
    expect(wrapper.emitted("apply")?.[0]).toEqual([sampleGroup]);

    const clearBtn = wrapper.findAll("button.tux-rule-builder__btn").find((b) => b.text().includes("Clear"));
    await clearBtn?.trigger("click");
    expect(wrapper.emitted("clear")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();

    const noActionsWrapper = await mountSuspended(TuxRuleBuilder, {
      props: {
        modelValue: sampleGroup,
        fields: sampleFields,
        showActions: false,
      },
    });
    expect(noActionsWrapper.find(".tux-rule-builder__footer").exists()).toBe(false);

    const violations = await runComponentAxe(noActionsWrapper.element);
    expect(violations).toEqual([]);
  });
});
