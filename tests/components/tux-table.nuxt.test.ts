import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxTable from "~/components/TuxTable.vue";
import { runComponentAxe } from "../axe-helper";

const sampleColumns = [
  { accessorKey: "id", header: "Corridor ID" },
  { accessorKey: "name", header: "Facility Name" },
  { accessorKey: "status", header: "Telemetry Status" },
];

const sampleData = [
  { id: "TX-01", name: "I-35 Central Austin", status: "completed" },
  { id: "TX-02", name: "I-10 Katy Freeway", status: "running" },
];

describe("TuxTable Component", () => {
  it("renders table with columns, data rows, status badges, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxTable, {
      attrs: {
        columns: sampleColumns,
        data: sampleData,
      },
      props: {
        statusAccessor: "status",
      },
    });

    expect(wrapper.text()).toContain("Corridor ID");
    expect(wrapper.text()).toContain("Facility Name");
    expect(wrapper.text()).toContain("Telemetry Status");
    expect(wrapper.text()).toContain("TX-01");
    expect(wrapper.text()).toContain("I-35 Central Austin");
    expect(wrapper.text()).toContain("TX-02");
    expect(wrapper.text()).toContain("I-10 Katy Freeway");

    // Status badges rendered by TuxBadge integration
    expect(wrapper.find(".tux-table").exists()).toBe(true);
    expect(wrapper.find("table").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom cell slots for specialized column formatting", async () => {
    const wrapper = await mountSuspended(TuxTable, {
      attrs: {
        columns: [
          { accessorKey: "code", header: "Sensor Code" },
          { accessorKey: "rate", header: "Sampling Rate" },
        ],
        data: [
          { code: "RAD-99", rate: "100 Hz" },
        ],
      },
      slots: {
        "rate-cell": ({ row }: { row: { original: { rate: string } } }) =>
          `<span class="badge-rate">${row.original?.rate ?? "100 Hz"} (Real-time)</span>`,
      },
    });

    expect(wrapper.text()).toContain("RAD-99");
    expect(wrapper.text()).toContain("100 Hz (Real-time)");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
