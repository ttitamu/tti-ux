import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxNewsCollection from "../../app/components/TuxNewsCollection.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxNewsCollection Component", () => {
  it("renders news items with date, category, and read more link", async () => {
    const wrapper = await mountSuspended(TuxNewsCollection, {
      props: {
        layout: "stacked",
        items: [
          {
            date: "2026-04-15",
            dateLabel: "Apr 15, 2026",
            title: "TTI Researchers Deploy Edge AI on Texas Rural Corridors",
            category: "Research Highlight",
            dek: "Real-time edge compute nodes reduce telemetry latency across 12 county networks.",
            to: "/news/edge-ai-corridors",
          },
        ],
      },
    });

    expect(wrapper.classes()).toContain("tux-news");
    expect(wrapper.classes()).toContain("tux-news--stacked");
    expect(wrapper.text()).toContain("Apr 15, 2026");
    expect(wrapper.text()).toContain("Research Highlight");
    expect(wrapper.text()).toContain("TTI Researchers Deploy Edge AI");
    expect(wrapper.text()).toContain("Real-time edge compute nodes");
    expect(wrapper.text()).toContain("Read more");

    const time = wrapper.find("time");
    expect(time.exists()).toBe(true);
    expect(time.attributes("datetime")).toBe("2026-04-15");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders grid layout with columns modifier", async () => {
    const wrapper = await mountSuspended(TuxNewsCollection, {
      props: {
        layout: "grid",
        columns: 2,
        items: [
          {
            date: "2026-03-01",
            title: "Annual Transportation Short Course Highlights",
          },
          {
            date: "2026-02-14",
            title: "Automated Shuttles Safety Report Published",
          },
        ],
      },
    });

    expect(wrapper.classes()).toContain("tux-news--grid");
    expect(wrapper.classes()).toContain("tux-news--cols-2");
    const items = wrapper.findAll(".tux-news__item");
    expect(items.length).toBe(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
