// @vitest-environment nuxt
/**
 * TuxRichDataGrid — virtualized big-list mode (@tanstack/vue-virtual).
 * Windowing must actually window: thousands of rows in, a bounded
 * number of <tr>s out, with spacer rows preserving scroll extent.
 * (jsdom has no layout, so the virtualizer sees a zero-height
 * viewport and renders a minimal window — the assertions bound the
 * row count rather than pin an exact window size.)
 */
import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxRichDataGrid from "../../app/components/TuxRichDataGrid.vue";

const columns = [
  { key: "name", label: "Name" },
  { key: "district", label: "District" },
];

function makeRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: `row-${i}`,
    name: `Corridor ${i}`,
    district: `District ${i % 25}`,
  }));
}

describe("TuxRichDataGrid virtualized mode", () => {
  it("renders a bounded window (not 2,000 rows) with spacer rows", async () => {
    const w = await mountSuspended(TuxRichDataGrid, {
      props: { columns, rows: makeRows(2000), rowKey: "id", virtualized: true },
    });
    const dataRows = w.findAll(".tux-rich-data-grid__row");
    expect(dataRows.length).toBeLessThan(100);
    expect(w.findAll(".tux-rich-data-grid__spacer").length).toBeGreaterThanOrEqual(1);
  });

  it("disables row expansion while virtualized (documented constraint)", async () => {
    const w = await mountSuspended(TuxRichDataGrid, {
      props: { columns, rows: makeRows(500), rowKey: "id", virtualized: true },
    });
    expect(w.find(".tux-rich-data-grid__chevron").exists()).toBe(false);
  });

  it("non-virtualized keeps rendering every row (behavior preserved)", async () => {
    const w = await mountSuspended(TuxRichDataGrid, {
      props: { columns, rows: makeRows(200), rowKey: "id" },
    });
    expect(w.findAll(".tux-rich-data-grid__row").length).toBe(200);
    expect(w.findAll(".tux-rich-data-grid__spacer").length).toBe(0);
  });

  it("renders provenance citation footer, unit toggle, and emits export-csv with embedded citation metadata", async () => {
    const w = await mountSuspended(TuxRichDataGrid, {
      props: {
        title: "I-35 Corridor Sensor Inventory",
        columns,
        rows: makeRows(3),
        rowKey: "id",
        projectNumber: "TxDOT 0-7142",
        doi: "10.5555/tti.2026.07142",
        showUnitToggle: true,
        division: "mobility",
      },
    });

    expect(w.attributes("data-division")).toBe("mobility");

    const unitBtn = w.find('[data-testid="tux-rich-data-grid-unit-toggle"]');
    expect(unitBtn.exists()).toBe(true);
    expect(unitBtn.text()).toContain("US Customary");

    const prov = w.find('[data-testid="tux-rich-data-grid-provenance"]');
    expect(prov.exists()).toBe(true);
    expect(prov.text()).toContain("TxDOT 0-7142");
    expect(prov.text()).toContain("10.5555/tti.2026.07142");

    const exportBtn = w.find('[data-testid="tux-rich-data-grid-export"]');
    await exportBtn.trigger("click");

    const emittedCsv = w.emitted("export-csv");
    expect(emittedCsv).toBeTruthy();
    const csvPayload = String(emittedCsv?.[0]?.[0] ?? "");
    expect(csvPayload).toContain("# Provenance: Texas A&M Transportation Institute (TTI).");
    expect(csvPayload).toContain("Project TxDOT 0-7142.");
    expect(csvPayload).toContain("Name,District");
  });
});

