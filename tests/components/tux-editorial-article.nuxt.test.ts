import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxEditorialArticle from "~/components/TuxEditorialArticle.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxEditorialArticle Component", () => {
  it("renders publication title, category pill, date, and body prose", async () => {
    const wrapper = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "New Mobility 8 Server Expands Research Computing Capabilities",
        category: "Inside Lane",
        date: "2026-10-01",
        dateLabel: "October 1, 2026",
        readTime: "3 min read",
        heroImage: "/resources/news/mobility-8-server.jpg",
        heroLayout: "boxed",
        tags: ["Announcements", "Noteworthy", "Research Computing"],
      },
      slots: {
        default: () => [h("p", "Mobility researchers now have access to a powerful new computing resource.")],
      },
    });

    expect(wrapper.text()).toContain("New Mobility 8 Server");
    expect(wrapper.text()).toContain("Inside Lane");
    expect(wrapper.text()).toContain("October 1, 2026");
    expect(wrapper.text()).toContain("3 min read");
    expect(wrapper.text()).toContain("Mobility researchers now have access");
    expect(wrapper.find(".tux-editorial__hero-boxed").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports split and full-bleed hero variants without accessibility violations", async () => {
    const wrapperSplit = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "New RIMS Enhancements And Training Opportunities",
        heroImage: "/resources/news/rims-enhancements.png",
        heroLayout: "split",
        contact: {
          name: "Charlotte Glover",
          email: "c-glover@tti.tamu.edu",
          title: "Training Coordinator",
        },
      },
      slots: {
        default: () => [
          h("h2", "Why Attend?"),
          h("p", "Hands-on instruction tailored to your role."),
        ],
      },
    });

    expect(wrapperSplit.find(".tux-editorial__header-split").exists()).toBe(true);
    expect(wrapperSplit.text()).toContain("Charlotte Glover");
    expect(wrapperSplit.text()).toContain("c-glover@tti.tamu.edu");

    const violationsSplit = await runComponentAxe(wrapperSplit.element);
    expect(violationsSplit).toEqual([]);

    const wrapperFullBleed = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "Full Bleed Cinematic Article",
        heroImage: "/resources/news/mobility-8-server.jpg",
        heroLayout: "full-bleed",
      },
      slots: {
        default: () => [h("p", "Prose content inside full-bleed layout.")],
      },
    });

    expect(wrapperFullBleed.find(".tux-editorial__hero-fullbleed").exists()).toBe(true);
    const violationsFullBleed = await runComponentAxe(wrapperFullBleed.element);
    expect(violationsFullBleed).toEqual([]);
  });
});
