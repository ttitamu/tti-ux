import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxAuditLog, { type AuditLogEntry } from "~/components/TuxAuditLog.vue";
import { runComponentAxe } from "../axe-helper";

const sampleEntries: AuditLogEntry[] = [
  {
    id: "ev-1",
    timestamp: "2026-10-30 14:20:00Z",
    actor: "Dr. Elena Vance",
    actorRole: "Principal Investigator",
    action: "Updated Attribution Split",
    category: "attribution",
    severity: "warning",
    target: "Study 02-410922",
    reason: "Rebalanced corridor telemetry run across shared sponsors.",
    digest: "sha256:9f4c82b1",
    changes: [
      { field: "share_percent", before: "50%", after: "75%" },
      { field: "pool_code", before: "POOL-UNASSIGNED", after: "POOL-CORRIDOR-02" },
    ],
  },
  {
    id: "ev-2",
    timestamp: "2026-10-29 09:00:00Z",
    actor: "Marcus Holloway",
    actorRole: "Governance Officer",
    action: "Published GPU Tariff",
    category: "rate",
    severity: "info",
    target: "On-Prem GPU Cluster",
    digest: "sha256:3a17e0d4",
  },
];

describe("TuxAuditLog Component", () => {
  it("renders entries, digest tokens, severity/category pills, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxAuditLog, {
      props: {
        entries: sampleEntries,
      },
    });

    expect(wrapper.text()).toContain("Dr. Elena Vance");
    expect(wrapper.text()).toContain("Study 02-410922");
    expect(wrapper.text()).toContain("sha256:9f4c82b1");
    expect(wrapper.text()).toContain("Changes (2)");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("expands field diff disclosure, filters by search/category, emits inspect & export, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxAuditLog, {
      props: {
        entries: sampleEntries,
      },
    });

    // Expand Changes (2) disclosure
    const disclosureBtn = wrapper.findAll("button").find((b) => b.text().includes("Changes (2)"));
    expect(disclosureBtn?.attributes("aria-expanded")).toBe("false");
    await disclosureBtn!.trigger("click");
    expect(disclosureBtn?.attributes("aria-expanded")).toBe("true");
    expect(wrapper.text()).toContain("POOL-UNASSIGNED");
    expect(wrapper.text()).toContain("POOL-CORRIDOR-02");

    // Expanded diff table must pass axe (including scrollable-region-focusable)
    const expandedViolations = await runComponentAxe(wrapper.element);
    expect(expandedViolations).toEqual([]);

    // Inspect event
    const inspectBtn = wrapper.find('button[aria-label*="Inspect audit event ev-1"]');
    await inspectBtn.trigger("click");
    expect(wrapper.emitted("inspect")?.[0]?.[0]).toMatchObject({ id: "ev-1" });

    // Filter by category "rate"
    const rateCatBtn = wrapper.findAll("button").find((b) => b.text().startsWith("Rate"));
    await rateCatBtn!.trigger("click");
    expect(wrapper.text()).toContain("Published GPU Tariff");
    expect(wrapper.text()).not.toContain("Updated Attribution Split");

    // Export JSON of filtered entries (1 entry)
    const exportJsonBtn = wrapper.findAll("button").find((b) => b.text().includes("JSON"));
    await exportJsonBtn!.trigger("click");
    const exportCall = wrapper.emitted("export")?.[0];
    expect(exportCall?.[0]).toBe("json");
    expect((exportCall?.[1] as AuditLogEntry[]).length).toBe(1);

    // Search filter via input
    const allCatBtn = wrapper.findAll("button").find((b) => b.text().startsWith("All"));
    await allCatBtn!.trigger("click");
    const searchInput = wrapper.find('input[aria-label="Filter audit events"]');
    await searchInput.setValue("Elena");
    expect(wrapper.text()).toContain("Dr. Elena Vance");
    expect(wrapper.text()).not.toContain("Marcus Holloway");

    const filteredViolations = await runComponentAxe(wrapper.element);
    expect(filteredViolations).toEqual([]);
  });
});
