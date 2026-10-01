import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxDataTable from "../../app/components/TuxDataTable.vue";

describe("TuxDataTable Component", () => {
  const sampleColumns = [
    { key: "corridor", label: "Corridor Segment" },
    { key: "county", label: "County" },
    { key: "volume", label: "Daily Traffic", numeric: true },
  ];

  const sampleRows = [
    { corridor: "IH-35 Central", county: "Travis", volume: 185000 },
    { corridor: "IH-10 Katy", county: "Harris", volume: 220000 },
  ];

  it("renders table with numbered caption, description, and data rows", async () => {
    const wrapper = await mountSuspended(TuxDataTable, {
      props: {
        tableNumber: "Table 3-1",
        caption: "Statewide Freeway Corridor Volume",
        description: "Annual average daily traffic (AADT) counts.",
        columns: sampleColumns,
        rows: sampleRows,
      },
    });

    expect(wrapper.text()).toContain("Table 3-1");
    expect(wrapper.text()).toContain("Statewide Freeway Corridor Volume");
    expect(wrapper.text()).toContain("Annual average daily traffic (AADT) counts.");
    expect(wrapper.text()).toContain("IH-35 Central");
    expect(wrapper.text()).toContain("IH-10 Katy");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders sortable headers with interactive buttons", async () => {
    const sortableCols = [
      { key: "corridor", label: "Corridor Segment", sortable: true },
      { key: "volume", label: "Daily Traffic", numeric: true, sortable: true },
    ];

    const wrapper = await mountSuspended(TuxDataTable, {
      props: {
        columns: sortableCols,
        rows: sampleRows,
        sortKey: "corridor",
        sortDir: "asc",
      },
    });

    const sortButtons = wrapper.findAll("button");
    expect(sortButtons.length).toBeGreaterThan(0);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders totals row when provided", async () => {
    const wrapper = await mountSuspended(TuxDataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        totals: {
          label: "Total Daily Volume",
          values: { volume: "405,000" },
        },
      },
    });

    expect(wrapper.text()).toContain("Total Daily Volume");
    expect(wrapper.text()).toContain("405,000");
  });
});
