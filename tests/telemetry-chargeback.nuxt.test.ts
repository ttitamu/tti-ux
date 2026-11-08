import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TelemetryChargebackPage from "~/pages/examples/telemetry-chargeback.vue";
import { runComponentAxe } from "./axe-helper";

describe("/examples/telemetry-chargeback Composition Suite", () => {
  it("renders all 4 telemetry & chargeback views and passes axe accessibility on each view", async () => {
    const wrapper = await mountSuspended(TelemetryChargebackPage);

    expect(wrapper.text()).toContain("Telemetry & Chargeback Engine");
    expect(wrapper.text()).toContain("Table Catalog & Distributed Query Engine");
    expect(wrapper.text()).toContain("Runaway Accelerator Spend Velocity");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    const tabs = wrapper.findAll("[role='tab']");
    expect(tabs.length).toBe(4);

    // Tab 2: Rate Cards & Simulator
    await tabs[1]!.trigger("click");
    expect(wrapper.text()).toContain("Self-Hosted Infrastructure Rate Schedules");
    expect(wrapper.text()).toContain("Next-Cycle Capacity & Pool Comparison Simulator");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // Tab 3: Statement Voucher
    await tabs[2]!.trigger("click");
    expect(wrapper.text()).toContain("STMT-2026-10-0419");
    expect(wrapper.text()).toContain("Monthly Resource Chargeback Statement");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // Tab 4: Immutable Audit Trail
    await tabs[3]!.trigger("click");
    expect(wrapper.text()).toContain("Cycle Attribution, Rate & Signoff Audit Stream");
    expect(wrapper.text()).toContain("Frozen cycle statement snapshot STMT-2026-10-0419");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });
});
