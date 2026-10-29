import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSegmentedInput, { type CodeSegmentDef } from "~/components/TuxSegmentedInput.vue";
import { runComponentAxe } from "../axe-helper";

const csjSegments: CodeSegmentDef[] = [
  { key: "ctrl", label: "Control", length: 4, charset: "digits" },
  { key: "sec", label: "Section", length: 2, charset: "digits" },
  { key: "job", label: "Job", length: 3, charset: "digits" },
];

describe("TuxSegmentedInput Component", () => {
  it("renders labeled segment boxes, enforces completion status, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxSegmentedInput, {
      props: {
        modelValue: "0015-13-074",
        segments: csjSegments,
        label: "Highway CSJ Number",
        helpText: "Nine-digit control-section-job identifier.",
      },
    });

    expect(wrapper.text()).toContain("Highway CSJ Number");
    expect(wrapper.text()).toContain("Control");
    expect(wrapper.text()).toContain("Section");
    expect(wrapper.text()).toContain("Job");
    expect(wrapper.text()).toContain("Complete · 9/9");

    const inputs = wrapper.findAll("input.tux-segmented-input__box");
    expect(inputs).toHaveLength(3);
    expect((inputs[0]?.element as HTMLInputElement).value).toBe("0015");
    expect((inputs[1]?.element as HTMLInputElement).value).toBe("13");
    expect((inputs[2]?.element as HTMLInputElement).value).toBe("074");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("filters charset, joins segments, distributes pasted codes, and emits complete", async () => {
    const wrapper = await mountSuspended(TuxSegmentedInput, {
      props: {
        modelValue: "",
        segments: csjSegments,
        label: "CSJ Input",
      },
    });

    const inputs = wrapper.findAll("input.tux-segmented-input__box");
    await inputs[0]?.setValue("00a15");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["0015"]);

    await inputs[0]?.trigger("paste", {
      clipboardData: {
        getData: () => "0412-08-199",
      },
    });

    const emittedUpdates = wrapper.emitted("update:modelValue") ?? [];
    expect(emittedUpdates[emittedUpdates.length - 1]).toEqual(["0412-08-199"]);
    expect(wrapper.emitted("complete")?.[0]).toEqual(["0412-08-199"]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
