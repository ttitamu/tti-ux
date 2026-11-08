import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxUptimeStrip, {
  type UptimeBucketItem,
} from "~/components/TuxUptimeStrip.vue";
import { runComponentAxe } from "../axe-helper";

const sampleBuckets: UptimeBucketItem[] = [
  {
    id: "b-1",
    label: "2026-11-01",
    state: "operational",
    uptimePct: 100,
    latencyMs: 21,
  },
  {
    id: "b-2",
    label: "2026-11-02",
    state: "maintenance",
    uptimePct: 100,
    latencyMs: 29,
    incidentSummary: "Scheduled 15m rolling broker restart.",
  },
  {
    id: "b-3",
    label: "2026-11-03",
    state: "outage",
    uptimePct: 96.5,
    latencyMs: 390,
    incidentSummary: "50m upstream cabinet link interruption.",
  },
  {
    id: "b-4",
    label: "2026-11-04",
    state: "degraded",
    uptimePct: 99.7,
    latencyMs: 118,
    incidentSummary: "12m table catalog metadata lock.",
  },
  {
    id: "b-5",
    label: "2026-11-05",
    state: "operational",
    uptimePct: 100,
    latencyMs: 24,
  },
];

describe("TuxUptimeStrip Component", () => {
  it("renders service header, rolling availability vs SLA, listbox ticks, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxUptimeStrip, {
      props: {
        serviceName: "Corridor Ingest Broker",
        serviceGroup: "Telemetry Pipeline",
        buckets: sampleBuckets,
        windowLabel: "Last 5 days",
        slaTargetPct: 99.9,
        currentLatencyMs: 24,
      },
    });

    expect(wrapper.text()).toContain("Corridor Ingest Broker");
    expect(wrapper.text()).toContain("Telemetry Pipeline");
    expect(wrapper.text()).toContain("Operational");
    expect(wrapper.text()).toContain("99.24%");
    expect(wrapper.text()).toContain("SLA 99.9% breached");
    expect(wrapper.text()).toContain("24 ms");
    expect(wrapper.text()).toContain("2026-11-05");

    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(5);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports keyboard roving navigation, click selection, and 44px stepper buttons", async () => {
    const wrapper = await mountSuspended(TuxUptimeStrip, {
      props: {
        serviceName: "Table Catalog Service",
        buckets: sampleBuckets,
      },
    });

    const listbox = wrapper.find('[role="listbox"]');
    expect(listbox.exists()).toBe(true);

    // Starts at latest bucket (index 4 -> b-5), ArrowLeft moves to index 3 (b-4)
    await listbox.trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.emitted("selectBucket")?.[0]).toEqual([sampleBuckets[3]]);
    expect(wrapper.text()).toContain("12m table catalog metadata lock.");

    // Home jumps to index 0 (b-1)
    await listbox.trigger("keydown", { key: "Home" });
    expect(wrapper.emitted("selectBucket")?.[1]).toEqual([sampleBuckets[0]]);

    // Next stepper advances to index 1 (b-2)
    const nextBtn = wrapper.find('button[aria-label="Inspect next time bucket"]');
    await nextBtn.trigger("click");
    expect(wrapper.emitted("selectBucket")?.[2]).toEqual([sampleBuckets[1]]);
    expect(wrapper.text()).toContain("Scheduled 15m rolling broker restart.");

    // Direct click on outage option (index 2 -> b-3)
    const options = wrapper.findAll('[role="option"]');
    await options[2]!.trigger("click");
    expect(wrapper.emitted("selectBucket")?.[3]).toEqual([sampleBuckets[2]]);
    expect(wrapper.text()).toContain("50m upstream cabinet link interruption.");
  });
});
