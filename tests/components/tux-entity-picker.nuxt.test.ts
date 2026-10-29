import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxEntityPicker, { type EntityOption } from "~/components/TuxEntityPicker.vue";
import { runComponentAxe } from "../axe-helper";

const sampleEntities: EntityOption[] = [
  {
    id: "ent-1",
    code: "CSJ-0015",
    label: "Central Corridor Study",
    subtitle: "Milepoints 230–241",
    owner: "Dr. Chen",
    status: "active",
    metaLabel: "42 sensors",
  },
  {
    id: "ent-2",
    code: "CSJ-0049",
    label: "Archived Work-Zone Log",
    owner: "R. Patel",
    status: "closed",
    metaLabel: "FY25",
  },
  {
    id: "ent-3",
    code: "CSJ-0114",
    label: "Freight Priority Evaluation",
    owner: "A. Alvarez",
    status: "expiring",
    metaLabel: "18 signals",
  },
];

describe("TuxEntityPicker Component", () => {
  it("renders ARIA combobox, opens listbox, and passes accessibility checks in closed and open states", async () => {
    const wrapper = await mountSuspended(TuxEntityPicker, {
      props: {
        modelValue: "ent-1",
        options: sampleEntities,
        label: "Study Corridor",
      },
    });

    const closedViolations = await runComponentAxe(wrapper.element);
    expect(closedViolations).toEqual([]);

    const combobox = wrapper.find('input[role="combobox"]');
    expect(combobox.attributes("aria-expanded")).toBe("false");

    await combobox.trigger("click");
    expect(combobox.attributes("aria-expanded")).toBe("true");
    expect(wrapper.text()).toContain("Central Corridor Study");
    expect(wrapper.text()).toContain("Archived Work-Zone Log");

    const openViolations = await runComponentAxe(wrapper.element);
    expect(openViolations).toEqual([]);
  });

  it("filters options, supports keyboard selection, blocks closed items, and clears selection", async () => {
    const wrapper = await mountSuspended(TuxEntityPicker, {
      props: {
        modelValue: "ent-1",
        options: sampleEntities,
        label: "Study Corridor",
      },
    });

    const combobox = wrapper.find('input[role="combobox"]');
    await combobox.setValue("Alvarez");
    expect(wrapper.emitted("search")?.[0]).toEqual(["Alvarez"]);

    await combobox.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["ent-3"]);
    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ id: "ent-3" });

    // Reopen and attempt to click the closed entity -> should not emit selection
    await combobox.trigger("click");
    const closedOpt = wrapper
      .findAll('[role="option"]')
      .find((el) => el.text().includes("Archived Work-Zone Log"));
    expect(closedOpt?.attributes("aria-disabled")).toBe("true");
    await closedOpt?.trigger("click");
    expect(wrapper.emitted("update:modelValue")).toHaveLength(1);

    // Clear selection
    const clearBtn = wrapper.find('button[aria-label="Clear selected entity"]');
    await clearBtn.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([null]);
    expect(wrapper.emitted("select")?.[1]).toEqual([null]);
  });
});
