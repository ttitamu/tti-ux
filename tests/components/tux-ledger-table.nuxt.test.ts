import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxLedgerTable, { type LedgerGroup } from "~/components/TuxLedgerTable.vue";
import { runComponentAxe } from "../axe-helper";

const sampleGroups: LedgerGroup[] = [
  {
    id: "grp-1",
    code: "ITEM-344",
    label: "Surface Mixtures",
    badge: "Pavement",
    rows: [
      {
        id: "r-1",
        code: "344-6106",
        label: "Superpave SP-D",
        meta: "2-inch wearing course",
        quantity: 100,
        unit: "TON",
        rate: 120,
        amount: 12000,
      },
      {
        id: "r-2",
        code: "354-6045",
        label: "Cold Milling",
        quantity: 500,
        unit: "SY",
        rate: 3,
        amount: 1500,
      },
    ],
  },
  {
    id: "grp-2",
    code: "ITEM-6000",
    label: "Roadside Telemetry",
    rows: [
      {
        id: "r-3",
        code: "6064-6001",
        label: "Radar Detector Assembly",
        quantity: 2,
        unit: "EA",
        rate: 5000,
        amount: 10000,
      },
    ],
  },
];

describe("TuxLedgerTable Component", () => {
  it("renders caption, group subtotals, itemized rows, grand total, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxLedgerTable, {
      props: {
        caption: "Corridor Bill of Materials",
        groups: sampleGroups,
        valuePrefix: "$",
        decimals: 2,
      },
    });

    expect(wrapper.find("caption").text()).toContain("Corridor Bill of Materials");
    expect(wrapper.text()).toContain("Surface Mixtures");
    expect(wrapper.text()).toContain("$13,500.00");
    expect(wrapper.text()).toContain("$10,000.00");
    expect(wrapper.text()).toContain("$23,500.00");
    expect(wrapper.text()).toContain("100 TON");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports Collapse All / Expand All and emits CSV and TSV exports", async () => {
    const wrapper = await mountSuspended(TuxLedgerTable, {
      props: {
        caption: "Corridor Bill of Materials",
        groups: sampleGroups,
        valuePrefix: "$",
        decimals: 2,
      },
    });

    const buttons = wrapper.findAll("button");
    const collapseBtn = buttons.find((b) => b.text() === "Collapse All");
    const expandBtn = buttons.find((b) => b.text() === "Expand All");
    const csvBtn = buttons.find((b) => b.text() === "Export CSV");
    const tsvBtn = buttons.find((b) => b.text().includes("TSV"));

    await collapseBtn!.trigger("click");
    expect(wrapper.text()).not.toContain("Superpave SP-D");
    // Grand total and subtotals remain visible when collapsed
    expect(wrapper.text()).toContain("$23,500.00");

    // Collapsed state must also pass axe checks
    const collapsedViolations = await runComponentAxe(wrapper.element);
    expect(collapsedViolations).toEqual([]);

    await expandBtn!.trigger("click");
    expect(wrapper.text()).toContain("Superpave SP-D");

    await csvBtn!.trigger("click");
    const csvEvent = wrapper.emitted("export")?.[0]?.[0] as
      | { format: "csv" | "tsv"; content: string }
      | undefined;
    expect(csvEvent?.format).toBe("csv");
    expect(csvEvent?.content).toContain("Grand Total");
    expect(csvEvent?.content).toContain("23500.00");

    await tsvBtn!.trigger("click");
    const tsvEvent = wrapper.emitted("export")?.[1]?.[0] as
      | { format: "csv" | "tsv"; content: string }
      | undefined;
    expect(tsvEvent?.format).toBe("tsv");
    expect(tsvEvent?.content).toContain("\t");
  });
});
