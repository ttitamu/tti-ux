import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSimulator, {
  type SimulatorParameter,
  type SimulatorPreset,
} from "~/components/TuxSimulator.vue";
import { runComponentAxe } from "../axe-helper";

const sampleParams: SimulatorParameter[] = [
  {
    id: "gpu",
    label: "On-Prem GPU Cluster",
    description: "80GB node allocation",
    unit: "GPU-hr",
    min: 0,
    max: 500,
    step: 10,
    value: 100,
    primaryRate: 2.0,
    comparisonRate: 4.0,
  },
  {
    id: "storage",
    label: "Parquet Archive Storage",
    unit: "TiB-mo",
    min: 0,
    max: 200,
    step: 5,
    value: 50,
    primaryRate: 10.0,
    comparisonRate: 20.0,
  },
];

const samplePresets: SimulatorPreset[] = [
  {
    id: "surge",
    label: "Surge Scenario",
    values: { gpu: 400, storage: 150 },
  },
];

describe("TuxSimulator Component", () => {
  it("renders synced range and number controls, computes totals/savings, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxSimulator, {
      props: {
        parameters: sampleParams,
        presets: samplePresets,
        primaryLabel: "On-Prem Pool",
        comparisonLabel: "External Pool",
        budgetLimit: 1000,
      },
    });

    // Primary: 100*2 + 50*10 = $700.00; Baseline: 100*4 + 50*20 = $1,400.00; Savings: $700.00 (-50.0%)
    expect(wrapper.text()).toContain("$700.00");
    expect(wrapper.text()).toContain("$1,400.00");
    expect(wrapper.text()).toContain("-50.0%");
    expect(wrapper.text()).toContain("Budget Utilization: 70.0%");
    expect(wrapper.text()).toContain("Within Budget Ceiling");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("applies presets, triggers over-budget status, updates exact numeric input, resets, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxSimulator, {
      props: {
        parameters: sampleParams,
        presets: samplePresets,
        budgetLimit: 1000,
      },
    });

    // Apply Surge Scenario preset -> Primary: 400*2 + 150*10 = $2,300.00 (> $1,000 ceiling)
    const presetBtn = wrapper.findAll("button").find((b) => b.text() === "Surge Scenario");
    await presetBtn!.trigger("click");

    expect(wrapper.emitted("applyPreset")?.[0]?.[0]).toMatchObject({ id: "surge" });
    expect(wrapper.text()).toContain("$2,300.00");
    expect(wrapper.text()).toContain("Over Ceiling (+$1,300.00)");

    const overBudgetViolations = await runComponentAxe(wrapper.element);
    expect(overBudgetViolations).toEqual([]);

    // Update exact numeric input for GPU to 50 -> Primary: 50*2 + 150*10 = $1,600.00
    const gpuNumber = wrapper.find('input[aria-label="On-Prem GPU Cluster exact quantity in GPU-hr"]');
    await gpuNumber.setValue("50");
    const lastEmitted = wrapper.emitted("update:parameters")?.at(-1)?.[0] as
      | SimulatorParameter[]
      | undefined;
    expect(lastEmitted?.find((p) => p.id === "gpu")?.value).toBe(50);
    expect(wrapper.text()).toContain("$1,600.00");

    // Reset restores initial values ($700.00)
    const resetBtn = wrapper.find('button[aria-label="Reset simulation parameters"]');
    await resetBtn.trigger("click");
    expect(wrapper.emitted("reset")).toBeTruthy();
    expect(wrapper.text()).toContain("Budget Utilization: 70.0%");
  });
});
