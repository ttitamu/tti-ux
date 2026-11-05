import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import TuxStatementSheet, {
  type StatementApprovalStamp,
  type StatementLineItem,
  type StatementParty,
} from "~/components/TuxStatementSheet.vue";
import { runComponentAxe } from "../axe-helper";

const sampleIssuer: StatementParty = {
  name: "Shared Compute & Telemetry Facility",
  code: "SVC-01",
  department: "Research Infrastructure",
  contact: "metering@example.edu",
};

const sampleRecipient: StatementParty = {
  name: "Study 02-410922",
  code: "ACCT-410922",
  department: "Corridor Systems",
  contact: "Dr. Elena Vance",
};

const sampleLines: StatementLineItem[] = [
  {
    id: "l1",
    category: "Compute",
    description: "On-Prem GPU Cluster",
    quantity: 100,
    unit: "GPU-hr",
    unitRate: 2.5,
  },
  {
    id: "l2",
    category: "Storage",
    description: "Parquet Archive Storage",
    quantity: 40,
    unit: "TiB-mo",
    unitRate: 10.0,
  },
];

const sampleApprovals: StatementApprovalStamp[] = [
  {
    id: "ap-1",
    role: "Metering Officer",
    signer: "Marcus Holloway",
    status: "approved",
    timestamp: "2026-10-31 18:00Z",
    decisionNote: "Telemetry verified.",
  },
  {
    id: "ap-2",
    role: "Principal Investigator",
    signer: "Dr. Elena Vance",
    status: "pending",
  },
];

describe("TuxStatementSheet Component", () => {
  it("renders voucher metadata, itemized math, adjustments, net total, stamps, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxStatementSheet, {
      props: {
        statementId: "STMT-2026-10-014",
        periodLabel: "October 2026",
        issueDate: "2026-11-01",
        status: "settled",
        issuer: sampleIssuer,
        recipient: sampleRecipient,
        lines: sampleLines,
        adjustments: [{ label: "Sponsored Credit", amount: -50 }],
        approvals: sampleApprovals,
        remittanceRef: "JRNL-8841",
        digest: "sha256:4e91c07b",
      },
    });

    // Line 1: 100 * 2.5 = $250.00; Line 2: 40 * 10 = $400.00; Subtotal: $650.00; Net: $600.00
    expect(wrapper.text()).toContain("STMT-2026-10-014");
    expect(wrapper.text()).toContain("$250.00");
    expect(wrapper.text()).toContain("$400.00");
    expect(wrapper.text()).toContain("$650.00");
    expect(wrapper.text()).toContain("-$50.00");
    expect(wrapper.text()).toContain("$600.00");
    expect(wrapper.text()).toContain("Marcus Holloway");
    expect(wrapper.text()).toContain("JRNL-8841");
    expect(wrapper.text()).toContain("sha256:4e91c07b");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("triggers print and exportCsv actions with statementId and passes axe when actions hidden", async () => {
    const printSpy = vi.fn();
    if (globalThis.window) {
      globalThis.window.print = printSpy;
    }

    const wrapper = await mountSuspended(TuxStatementSheet, {
      props: {
        statementId: "STMT-2026-10-099",
        periodLabel: "October 2026",
        issueDate: "2026-11-01",
        status: "pending",
        issuer: sampleIssuer,
        recipient: sampleRecipient,
        lines: sampleLines,
      },
    });

    const csvBtn = wrapper.find('button[aria-label="Export CSV for statement STMT-2026-10-099"]');
    const printBtn = wrapper.find('button[aria-label="Print statement STMT-2026-10-099"]');

    await csvBtn.trigger("click");
    expect(wrapper.emitted("exportCsv")?.[0]).toEqual(["STMT-2026-10-099"]);

    await printBtn.trigger("click");
    expect(wrapper.emitted("print")?.[0]).toEqual(["STMT-2026-10-099"]);
    if (globalThis.window) {
      expect(printSpy).toHaveBeenCalledTimes(1);
    }

    await wrapper.setProps({ showPrintAction: false });
    const hiddenViolations = await runComponentAxe(wrapper.element);
    expect(hiddenViolations).toEqual([]);
  });
});
