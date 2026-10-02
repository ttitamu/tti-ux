import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxEditorialArticle from "~/components/TuxEditorialArticle.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxEditorialArticle Component", () => {
  it("renders publication title, category pill, date, and body prose", async () => {
    const wrapper = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
        category: "Research Computing",
        date: "2026-10-01",
        dateLabel: "October 1, 2026",
        readTime: "3 min read",
        heroImage: "/resources/news/computing-cluster.jpg",
        heroLayout: "boxed",
        tags: ["Research Computing", "GeoAI", "Traffic Simulation"],
      },
      slots: {
        default: () => [h("p", "Transportation researchers now have access to an expanded high-performance computing environment.")],
      },
    });

    expect(wrapper.text()).toContain("Next-Gen Computing Cluster");
    expect(wrapper.text()).toContain("Research Computing");
    expect(wrapper.text()).toContain("October 1, 2026");
    expect(wrapper.text()).toContain("3 min read");
    expect(wrapper.text()).toContain("Transportation researchers now have access");
    expect(wrapper.find(".tux-editorial__hero-boxed").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports split and full-bleed hero variants without accessibility violations", async () => {
    const wrapperSplit = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "Project Lifecycle Management Tools & Fall Workshop Series",
        heroImage: "/resources/news/project-lifecycle.svg",
        heroLayout: "split",
        contact: {
          name: "Training Coordination Team",
          email: "training@tti.tamu.edu",
          title: "Professional Development Group",
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
    expect(wrapperSplit.text()).toContain("Training Coordination Team");
    expect(wrapperSplit.text()).toContain("training@tti.tamu.edu");

    const violationsSplit = await runComponentAxe(wrapperSplit.element);
    expect(violationsSplit).toEqual([]);

    const wrapperFullBleed = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "Full Bleed Cinematic Article",
        heroImage: "/resources/news/computing-cluster.jpg",
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
