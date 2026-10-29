import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxFeedStatus, {
  type FeedConnectorItem,
} from "~/components/TuxFeedStatus.vue";
import { runComponentAxe } from "../axe-helper";

const sampleFeeds: FeedConnectorItem[] = [
  {
    id: "loops",
    name: "Inductive Loop Stream",
    category: "Roadside",
    status: "healthy",
    lastSynced: "2026-10-29 10:00",
    recordCount: 125400,
    lagLabel: "3s",
  },
  {
    id: "wim",
    name: "WIM Axle Classifier",
    category: "Freight",
    status: "stale",
    lastSynced: "2026-10-29 06:00",
    recordCount: 41200,
    lagLabel: "4h",
    message: "Cabinet backhaul delayed.",
  },
  {
    id: "rwis",
    name: "Weather Sensor Relay",
    status: "syncing",
    lastSynced: "2026-10-29 09:58",
  },
  {
    id: "probe",
    name: "Probe Trajectory Feed",
    status: "error",
    lastSynced: "2026-10-29 01:15",
    message: "Upstream certificate expired.",
  },
];

describe("TuxFeedStatus Component", () => {
  it("renders summary strip counts, feed telemetry details, and passes axe accessibility", async () => {
    const wrapper = await mountSuspended(TuxFeedStatus, {
      props: {
        title: "Corridor Telemetry Health",
        feeds: sampleFeeds,
        layout: "list",
      },
    });

    expect(wrapper.text()).toContain("Corridor Telemetry Health");
    expect(wrapper.text()).toContain("1 healthy");
    expect(wrapper.text()).toContain("1 stale");
    expect(wrapper.text()).toContain("1 syncing");
    expect(wrapper.text()).toContain("1 error");
    expect(wrapper.text()).toContain("125,400 records");
    expect(wrapper.text()).toContain("Lag: 4h");
    expect(wrapper.text()).toContain("Upstream certificate expired.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits sync and syncAll events and supports grid layout with syncable=false", async () => {
    const wrapper = await mountSuspended(TuxFeedStatus, {
      props: {
        feeds: sampleFeeds,
      },
    });

    const syncWimBtn = wrapper.find('button[aria-label="Sync WIM Axle Classifier"]');
    expect(syncWimBtn.exists()).toBe(true);
    await syncWimBtn.trigger("click");
    expect(wrapper.emitted("sync")?.[0]).toEqual(["wim"]);

    const syncAllBtn = wrapper.find(".tux-feed-status__sync-all-btn");
    await syncAllBtn.trigger("click");
    expect(wrapper.emitted("syncAll")).toBeTruthy();

    const gridWrapper = await mountSuspended(TuxFeedStatus, {
      props: {
        feeds: sampleFeeds,
        layout: "grid",
        syncable: false,
      },
    });
    expect(gridWrapper.find(".tux-feed-status__items--grid").exists()).toBe(true);
    expect(gridWrapper.find(".tux-feed-status__sync-all-btn").exists()).toBe(false);
    expect(gridWrapper.find(".tux-feed-status__sync-btn").exists()).toBe(false);

    const gridViolations = await runComponentAxe(gridWrapper.element);
    expect(gridViolations).toEqual([]);
  });
});
