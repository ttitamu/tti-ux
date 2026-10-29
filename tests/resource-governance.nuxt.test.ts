import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ResourceGovernancePage from "~/pages/examples/resource-governance.vue";
import { runComponentAxe } from "./axe-helper";

describe("/examples/resource-governance Composition Suite", () => {
  it("renders all 5 governance workspace views and passes axe accessibility on each view", async () => {
    const wrapper = await mountSuspended(ResourceGovernancePage);

    expect(wrapper.text()).toContain("Resource Governance Workspace");
    expect(wrapper.text()).toContain("Scoped Allocation Ceiling Utilization");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    const tabs = wrapper.findAll("[role='tab']");
    expect(tabs.length).toBe(5);

    // Tab 2: Reconcile & Split
    await tabs[1]!.trigger("click");
    expect(wrapper.text()).toContain("Upstream Metering & Directory Connectors");
    expect(wrapper.text()).toContain("Shared Subscription Multi-Study Split");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // Tab 3: Workflow & Attestation
    await tabs[2]!.trigger("click");
    expect(wrapper.text()).toContain("Monthly Cycle Progression Board");
    expect(wrapper.text()).toContain("Next-Cycle Resource Disposition");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // Tab 4: Ledger & Handoff
    await tabs[3]!.trigger("click");
    expect(wrapper.text()).toContain("Verified Statement");
    expect(wrapper.text()).toContain("Structured Allocation String Validator");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // Tab 5: Tags & Schedules
    await tabs[4]!.trigger("click");
    expect(wrapper.text()).toContain("Required Resource Metadata Schema");
    expect(wrapper.text()).toContain("Automated Compute Active / Standby Window");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });
});
