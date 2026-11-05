import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxLogViewer, {
  type LogLineEntry,
} from "~/components/TuxLogViewer.vue";
import { runComponentAxe } from "../axe-helper";

const sampleLines: LogLineEntry[] = [
  {
    id: 1,
    timestamp: "2026-11-04 14:00:01",
    level: "info",
    source: "corridor-ingest-broker",
    message: "Connected 12 roadside sensor partitions for Study 02-411085.",
  },
  {
    id: 2,
    timestamp: "2026-11-04 14:00:04",
    level: "warn",
    source: "corridor-ingest-broker",
    message: "Cabinet MP-214 replay latency rose to 410ms.",
  },
  {
    id: 3,
    timestamp: "2026-11-04 14:00:09",
    level: "error",
    source: "table-catalog-service",
    message: "Commit lock conflict on partition 2026-11-04.",
  },
  {
    id: 4,
    timestamp: "2026-11-04 14:00:12",
    level: "debug",
    source: "distributed-query-pool",
    message: "Planned 8 scan tasks across On-Prem GPU Cluster.",
  },
];

describe("TuxLogViewer Component", () => {
  it("renders searchable, focusable monospace log region with severity counts and passes axe", async () => {
    const wrapper = await mountSuspended(TuxLogViewer, {
      props: {
        title: "Study 02-411085 Telemetry Logs",
        lines: sampleLines,
      },
    });

    expect(wrapper.text()).toContain("Study 02-411085 Telemetry Logs");
    expect(wrapper.text()).toContain("Showing 4 of 4 lines");
    expect(wrapper.findAll(".tux-log-viewer__row")).toHaveLength(4);

    const region = wrapper.find('.tux-log-viewer__viewport[role="region"]');
    expect(region.exists()).toBe(true);
    expect(region.attributes("tabindex")).toBe("0");
    expect(region.attributes("aria-label")).toBe("Study 02-411085 Telemetry Logs");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("filters by severity and search input, toggles line wrap, and emits copy, download, and selectLine", async () => {
    const wrapper = await mountSuspended(TuxLogViewer, {
      props: {
        lines: sampleLines,
      },
    });

    // Filter to ERROR severity
    const filterBtns = wrapper.findAll(".tux-log-viewer__filter-btn");
    const errorBtn = filterBtns.find((b) => b.text().includes("ERROR"));
    expect(errorBtn).toBeDefined();
    await errorBtn!.trigger("click");
    expect(wrapper.findAll(".tux-log-viewer__row")).toHaveLength(1);
    expect(wrapper.text()).toContain("Commit lock conflict");

    // Reset to ALL and filter by search query
    const allBtn = filterBtns.find((b) => b.text().includes("ALL"));
    await allBtn!.trigger("click");
    const searchInput = wrapper.find('input[aria-label="Search log output"]');
    await searchInput.setValue("MP-214");
    expect(wrapper.findAll(".tux-log-viewer__row")).toHaveLength(1);
    expect(wrapper.text()).toContain("Cabinet MP-214 replay latency rose to 410ms.");

    // Toggle wrap button
    const wrapBtn = wrapper.findAll(".tux-log-viewer__util-btn").find((b) => b.text() === "Wrap");
    expect(wrapBtn?.attributes("aria-pressed")).toBe("true");
    await wrapBtn!.trigger("click");
    expect(wrapBtn?.attributes("aria-pressed")).toBe("false");

    // Copy and Download emit filtered text
    const copyBtn = wrapper.find('button[aria-label="Copy visible log lines"]');
    await copyBtn.trigger("click");
    const copiedPayload = wrapper.emitted("copy")?.[0]?.[0] as string;
    expect(copiedPayload).toContain("WARN [corridor-ingest-broker] Cabinet MP-214");

    const downloadBtn = wrapper.find('button[aria-label="Download visible log lines"]');
    await downloadBtn.trigger("click");
    expect(wrapper.emitted("download")?.[0]?.[0]).toBe(copiedPayload);

    // Clicking a log row emits selectLine
    await wrapper.find(".tux-log-viewer__row").trigger("click");
    expect(wrapper.emitted("selectLine")?.[0]).toEqual([sampleLines[1]]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
