import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRateSchedule, { type RateScheduleItem } from "~/components/TuxRateSchedule.vue";
import { runComponentAxe } from "../axe-helper";

const sampleSchedules: RateScheduleItem[] = [
  {
    id: "sched-gpu",
    code: "CMP-GPU-01",
    name: "On-Prem GPU Cluster",
    category: "Accelerated Compute",
    unit: "GPU-hr",
    pricingModel: "tiered",
    baseRate: 2.0,
    overheadMultiplier: 1.1,
    effectiveFrom: "2026-09-01",
    effectiveTo: null,
    status: "active",
    tiers: [
      { id: "b1", label: "First 100", fromQuantity: 0, upToQuantity: 100, unitRate: 2.0 },
      { id: "b2", label: "Next 400", fromQuantity: 100, upToQuantity: 500, unitRate: 1.5 },
      { id: "b3", label: "Over 500", fromQuantity: 500, upToQuantity: null, unitRate: 1.0 },
    ],
  },
  {
    id: "sched-storage",
    code: "STR-PRQ-02",
    name: "Parquet Archive Storage",
    category: "Storage",
    unit: "TiB-mo",
    pricingModel: "flat",
    baseRate: 12.0,
    overheadMultiplier: 1.0,
    effectiveFrom: "2027-01-01",
    effectiveTo: "2027-12-31",
    status: "scheduled",
  },
  {
    id: "sched-legacy",
    code: "CMP-CPU-00",
    name: "Legacy Corridor Compute Node",
    unit: "vCPU-hr",
    pricingModel: "flat",
    baseRate: 0.1,
    overheadMultiplier: 1.0,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    status: "archived",
  },
];

describe("TuxRateSchedule Component", () => {
  it("renders schedules, computes stepped tiered + flat preview charges, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxRateSchedule, {
      props: {
        items: sampleSchedules,
        sampleQuantity: 200,
      },
    });

    // Stepped tiered for 200 GPU-hr: (100 * 2.0 + 100 * 1.5) * 1.1 = 350 * 1.1 = $385.00
    expect(wrapper.text()).toContain("$385.00");
    // Flat storage for 200 TiB-mo: 200 * 12.0 * 1.0 = $2,400.00
    expect(wrapper.text()).toContain("$2,400.00");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("expands tier brackets, filters by status, edits rates inline, emits events, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxRateSchedule, {
      props: {
        items: sampleSchedules,
        sampleQuantity: 100,
        editable: true,
      },
    });

    // Expand tier breakdown and run axe on expanded state
    const tierToggle = wrapper.findAll("button").find((b) => b.text().includes("Tiered (3)"));
    expect(tierToggle).toBeTruthy();
    await tierToggle!.trigger("click");
    expect(wrapper.text()).toContain("First 100");
    expect(wrapper.text()).toContain("Over 500");

    const expandedViolations = await runComponentAxe(wrapper.element);
    expect(expandedViolations).toEqual([]);

    // Trigger New Revision on active schedule
    const revBtn = wrapper.findAll("button").find((b) => b.text() === "New Revision");
    await revBtn!.trigger("click");
    expect(wrapper.emitted("createRevision")?.[0]?.[0]).toMatchObject({ id: "sched-gpu" });

    // Trigger select
    const selectBtn = wrapper.find(".tux-rate-schedule__select-btn");
    await selectBtn.trigger("click");
    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ id: "sched-gpu" });

    // Step sample quantity up (+25 -> 125)
    const incBtn = wrapper.find('button[aria-label="Increase sample quantity"]');
    await incBtn.trigger("click");
    // Flat storage: 125 * 12 = $1,500.00
    expect(wrapper.text()).toContain("$1,500.00");

    // Inline rate edit on Parquet Archive Storage
    const storageRateInput = wrapper.find(
      'input[aria-label*="Base rate for Parquet Archive Storage"]',
    );
    await storageRateInput.setValue("15");
    const updated = wrapper.emitted("update:items")?.[0]?.[0] as RateScheduleItem[] | undefined;
    expect(updated?.find((i) => i.id === "sched-storage")?.baseRate).toBe(15);

    // Filter to scheduled only
    const scheduledPill = wrapper
      .findAll("button")
      .find((b) => b.text().startsWith("Scheduled"));
    await scheduledPill!.trigger("click");
    expect(wrapper.text()).toContain("Parquet Archive Storage");
    expect(wrapper.text()).not.toContain("On-Prem GPU Cluster");

    const filteredViolations = await runComponentAxe(wrapper.element);
    expect(filteredViolations).toEqual([]);
  });
});
