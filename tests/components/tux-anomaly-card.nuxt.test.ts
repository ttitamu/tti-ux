import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxAnomalyCard, {
  type AnomalySeriesPoint,
} from "~/components/TuxAnomalyCard.vue";
import { runComponentAxe } from "../axe-helper";

const sampleSeries: AnomalySeriesPoint[] = [
  { label: "10-30", actual: 42, baselineMin: 35, baselineMax: 52 },
  { label: "10-31", actual: 47, baselineMin: 36, baselineMax: 54 },
  { label: "11-01", actual: 44, baselineMin: 35, baselineMax: 53 },
  { label: "11-02", actual: 96, baselineMin: 36, baselineMax: 55 },
  { label: "11-03", actual: 184, baselineMin: 37, baselineMax: 56 },
];

describe("TuxAnomalyCard Component", () => {
  it("renders anomaly readouts, SVG baseline-envelope sparkband, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxAnomalyCard, {
      props: {
        id: "anom-01",
        title: "Unbounded Scan on Distributed Query Pool",
        targetEntity: "Study 02-411085",
        metricLabel: "Hourly Compute Slot Hours",
        currentValue: "184.0 slot-hr/h",
        baselineLabel: "14d envelope: 37.0 – 56.0 slot-hr/h",
        deltaLabel: "+340% vs 14d baseline",
        projectionLabel: "Projected to exhaust cap in 4 days",
        ruleSummary: "actual > 3.0 sigma above 14d baseline",
        severity: "critical",
        state: "open",
        series: sampleSeries,
      },
    });

    expect(wrapper.text()).toContain("Unbounded Scan on Distributed Query Pool");
    expect(wrapper.text()).toContain("Study 02-411085");
    expect(wrapper.text()).toContain("184.0 slot-hr/h");
    expect(wrapper.text()).toContain("+340% vs 14d baseline");
    expect(wrapper.text()).toContain("Projected to exhaust cap in 4 days");
    expect(wrapper.find(".tux-anomaly-card--open").exists()).toBe(true);

    const svg = wrapper.find('svg[role="img"]');
    expect(svg.exists()).toBe(true);
    expect(svg.find("polygon").exists()).toBe(true);
    expect(svg.findAll("polyline").length).toBeGreaterThanOrEqual(3);
    expect(svg.findAll("circle")).toHaveLength(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("follows ACK != MAINT sunken surface doctrine and emits acknowledge, snooze, and escalate", async () => {
    const wrapper = await mountSuspended(TuxAnomalyCard, {
      props: {
        id: "anom-42",
        title: "Elevated Replay Rate on Corridor Ingest Broker",
        metricLabel: "Ingest Write Rate",
        currentValue: "3.4 GiB/h",
        baselineLabel: "7d band: 1.3 – 2.2 GiB/h",
        deltaLabel: "+68% vs 7d baseline",
        severity: "warning",
        state: "acknowledged",
        series: sampleSeries,
      },
    });

    expect(wrapper.find(".tux-anomaly-card--triaged").exists()).toBe(true);
    expect(wrapper.text()).toContain("ACKNOWLEDGED");

    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(3);

    await buttons[0]!.trigger("click");
    expect(wrapper.emitted("acknowledge")?.[0]).toEqual(["anom-42"]);

    await buttons[1]!.trigger("click");
    expect(wrapper.emitted("snooze")?.[0]).toEqual(["anom-42"]);

    await buttons[2]!.trigger("click");
    expect(wrapper.emitted("escalate")?.[0]).toEqual(["anom-42"]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
