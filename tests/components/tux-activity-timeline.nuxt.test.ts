import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxActivityTimeline from "../../app/components/TuxActivityTimeline.vue";

describe("TuxActivityTimeline Component", () => {
  const sampleItems = [
    {
      id: "ev-1",
      time: "10:00 AM",
      datetime: "2026-03-01T10:00:00",
      title: "Scoping Phase Complete",
      description: "Charter approved by DOT sponsors.",
      tone: "info" as const,
    },
    {
      id: "ev-2",
      time: "02:30 PM",
      datetime: "2026-03-02T14:30:00",
      title: "Sensor Calibration",
      description: "LiDAR and inductive loops verified in field test.",
      tone: "success" as const,
      current: true,
    },
    {
      id: "ev-3",
      time: "04:00 PM",
      title: "Pending Sponsor Review",
      tone: "warning" as const,
    },
  ];

  it("renders ordered list with timeline items and passes axe accessibility audit", async () => {
    const wrapper = await mountSuspended(TuxActivityTimeline, {
      props: {
        items: sampleItems,
      },
    });

    const ol = wrapper.find("ol.tux-activity-timeline");
    expect(ol.exists()).toBe(true);

    const items = wrapper.findAll("li.tux-activity-timeline__item");
    expect(items.length).toBe(3);

    expect(items[0].classes()).toContain("tux-activity-timeline__item--info");
    expect(items[1].classes()).toContain("tux-activity-timeline__item--current");
    expect(items[1].classes()).toContain("tux-activity-timeline__item--success");
    expect(items[2].classes()).toContain("tux-activity-timeline__item--warning");

    const timeEl = wrapper.find("time");
    expect(timeEl.exists()).toBe(true);
    expect(timeEl.attributes("datetime")).toBe("2026-03-01T10:00:00");
    expect(timeEl.text()).toBe("10:00 AM");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports dense mode modifier", async () => {
    const wrapper = await mountSuspended(TuxActivityTimeline, {
      props: {
        items: sampleItems,
        dense: true,
      },
    });

    expect(wrapper.classes()).toContain("tux-activity-timeline--dense");
  });

  it("renders group heading row when heading is true", async () => {
    const itemsWithHeading = [
      { id: "hdr-1", title: "Quarter 1 Milestones", heading: true },
      ...sampleItems,
    ];

    const wrapper = await mountSuspended(TuxActivityTimeline, {
      props: {
        items: itemsWithHeading,
      },
    });

    const heading = wrapper.find(".tux-activity-timeline__heading");
    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe("Quarter 1 Milestones");
  });

  it("supports trailing slot for badges or actions", async () => {
    const wrapper = await mountSuspended(TuxActivityTimeline, {
      props: {
        items: sampleItems,
      },
      slots: {
        trailing: ({ item }: { item: { id: string } }) => h("span", { class: `badge-${item.id}` }, "Badge"),
      },
    });

    expect(wrapper.find(".badge-ev-1").exists()).toBe(true);
  });
});
