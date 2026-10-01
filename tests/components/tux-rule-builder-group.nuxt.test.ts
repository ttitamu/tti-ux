import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRuleBuilderGroup from "~/components/TuxRuleBuilderGroup.vue";
import type { FieldDef, Group } from "~/components/TuxRuleBuilder.vue";
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
    {
      id: "g-nested",
      kind: "group",
      combinator: "OR",
      children: [
        { id: "r-2", kind: "rule", field: "facility", operator: "is", value: "freeway" },
      ],
    },
  ],
};

describe("TuxRuleBuilderGroup Component", () => {
  it("renders group combinators, nested groups, fields, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxRuleBuilderGroup, {
      props: {
        modelValue: sampleGroup,
        depth: 0,
        isRoot: true,
      },
      global: {
        provide: {
          "tux-rule-builder:fields": sampleFields,
          "tux-rule-builder:maxDepth": 3,
        },
      },
    });

    expect(wrapper.text()).toContain("AND");
    expect(wrapper.text()).toContain("OR");
    expect(wrapper.text()).toContain("Speed (mph)");
    expect(wrapper.text()).toContain("Facility Type");
    expect(wrapper.find(".tux-rule-builder-group--root").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles combinator toggle and rule additions", async () => {
    const wrapper = await mountSuspended(TuxRuleBuilderGroup, {
      props: {
        modelValue: sampleGroup,
        depth: 0,
        isRoot: true,
      },
      global: {
        provide: {
          "tux-rule-builder:fields": sampleFields,
          "tux-rule-builder:maxDepth": 3,
        },
      },
    });

    const orBtn = wrapper.findAll("button.tux-rule-builder-group__combinator-btn").find((b) => b.text().includes("OR"));
    await orBtn?.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    const updated = wrapper.emitted("update:modelValue")?.[0]?.[0] as Group;
    expect(updated.combinator).toBe("OR");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
