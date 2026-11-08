import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSignoffChain, {
  type SignoffDecisionOption,
  type SignoffStage,
} from "~/components/TuxSignoffChain.vue";
import { runComponentAxe } from "../axe-helper";

const sampleStages: SignoffStage[] = [
  {
    id: "stage-1",
    label: "Sensor Calibration Check",
    actorName: "Dr. Elena Vance",
    actorRole: "Instrumentation Lead",
    status: "approved",
    timestamp: "2026-10-28 09:00",
    note: "All channels verified.",
  },
  {
    id: "stage-2",
    label: "Track Safety Clearance",
    actorName: "Marcus Holloway",
    actorRole: "Range Officer",
    status: "pending",
  },
  {
    id: "stage-3",
    label: "Final Test Release",
    actorName: "Dr. Priya Nair",
    status: "pending",
  },
];

const sampleDecisions: SignoffDecisionOption[] = [
  {
    value: "nominal",
    label: "Proceed with nominal test speed",
    description: "Standard 62 mph run.",
  },
  {
    value: "instrumented-hold",
    label: "Hold at T-60s for optical check",
  },
];

describe("TuxSignoffChain Component", () => {
  it("renders ordered stages, enforces attestation gating, and passes axe accessibility", async () => {
    const wrapper = await mountSuspended(TuxSignoffChain, {
      props: {
        stages: sampleStages,
        decisionOptions: sampleDecisions,
        modelValue: "nominal",
        attestationText: "I confirm all range gates are locked.",
      },
    });

    expect(wrapper.text()).toContain("Sensor Calibration Check");
    expect(wrapper.text()).toContain("Dr. Elena Vance");
    expect(wrapper.text()).toContain("Track Safety Clearance");
    expect(wrapper.text()).toContain("I confirm all range gates are locked.");

    const approveBtn = wrapper.find(".tux-signoff-chain__btn--approve");
    expect((approveBtn.element as HTMLButtonElement).disabled).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits update:modelValue, approve, and reject payloads and supports showActions=false", async () => {
    const wrapper = await mountSuspended(TuxSignoffChain, {
      props: {
        stages: sampleStages,
        decisionOptions: sampleDecisions,
        attestationText: "I confirm all range gates are locked.",
      },
    });

    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios.length).toBe(2);
    await radios[1]!.setValue(true);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["instrumented-hold"]);

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Perimeter clear and cameras armed.");

    const approveBtn = wrapper.find(".tux-signoff-chain__btn--approve");
    expect((approveBtn.element as HTMLButtonElement).disabled).toBe(false);
    await approveBtn.trigger("click");

    expect(wrapper.emitted("approve")?.[0]).toEqual([
      {
        stageId: "stage-2",
        attested: true,
        decision: "instrumented-hold",
        comment: "Perimeter clear and cameras armed.",
      },
    ]);

    const rejectBtn = wrapper.find(".tux-signoff-chain__btn--reject");
    await rejectBtn.trigger("click");
    expect(wrapper.emitted("reject")?.[0]).toEqual([
      {
        stageId: "stage-2",
        comment: "Perimeter clear and cameras armed.",
      },
    ]);

    const readonlyWrapper = await mountSuspended(TuxSignoffChain, {
      props: {
        stages: sampleStages,
        showActions: false,
      },
    });
    expect(readonlyWrapper.find(".tux-signoff-chain__gate").exists()).toBe(false);

    const readonlyViolations = await runComponentAxe(readonlyWrapper.element);
    expect(readonlyViolations).toEqual([]);
  });
});
