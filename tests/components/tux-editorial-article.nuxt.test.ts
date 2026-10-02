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

  it("supports AI Modern style (DeepMind / Anthropic / OpenAI) with stats, highlights, and citation", async () => {
    const wrapperAi = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
        category: "Research Computing",
        dek: "High-performance GPU infrastructure delivers accelerated computing power to advance real-time traffic modeling.",
        heroImage: "/resources/news/computing-cluster.jpg",
        heroLayout: "ai-modern",
        author: { name: "Analytics Group", title: "Research Computing" },
        stats: [
          { value: "4.8x", label: "Throughput Speedup", detail: "Versus legacy single-node workloads" },
          { value: "99.4%", label: "Model Precision" },
        ],
        highlights: [
          "GPU-accelerated multi-node cluster dedicated to real-time traffic modeling.",
          "High-throughput NVMe scratch volume optimizes deep neural net training.",
        ],
        citation: {
          title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
          authors: "Analytics Group",
          journal: "TTI Research Publications",
          year: 2026,
          doi: "10.1145/tti.2026.042",
          bibtex: "@article{test, title={Test}}",
        },
      },
      slots: {
        default: () => [h("p", "High-performance compute enables groundbreaking simulation.")],
      },
    });

    expect(wrapperAi.find(".tux-editorial__header-ai").exists()).toBe(true);
    expect(wrapperAi.find(".tux-editorial__stats-grid").exists()).toBe(true);
    expect(wrapperAi.find(".tux-editorial__highlights-card").exists()).toBe(true);
    expect(wrapperAi.find(".tux-editorial__citation-card").exists()).toBe(true);
    expect(wrapperAi.text()).toContain("4.8x");
    expect(wrapperAi.text()).toContain("Throughput Speedup");
    expect(wrapperAi.text()).toContain("KEY RESEARCH FINDINGS");
    expect(wrapperAi.text()).toContain("HOW TO CITE THIS RESEARCH");

    const violationsAi = await runComponentAxe(wrapperAi.element);
    expect(violationsAi).toEqual([]);
  });

  it("supports Interactive Canvas (Sol) layout with animated canvas, playback controls, and 0 Axe violations", async () => {
    const wrapperCanvas = await mountSuspended(TuxEditorialArticle, {
      props: {
        title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
        category: "Research Index",
        dek: "High-performance GPU infrastructure delivers accelerated computing power to advance real-time traffic modeling.",
        heroLayout: "interactive-canvas",
        author: { name: "Transportation Analytics & Computing Initiative", role: "HPC Facility Group" },
        date: "2026-10-01",
        readTime: "3 min read",
        stats: [
          { value: "4.8x", label: "Throughput Speedup" },
        ],
      },
      slots: {
        default: () => [h("p", "Cutting edge transportation AI research.")],
      },
    });

    expect(wrapperCanvas.find(".tux-editorial__hero-canvas-stage").exists()).toBe(true);
    expect(wrapperCanvas.find(".tux-editorial__canvas-layer").exists()).toBe(true);
    expect(wrapperCanvas.find(".tux-editorial__canvas-playback-btn").exists()).toBe(true);
    expect(wrapperCanvas.text()).toContain("Research Index");
    expect(wrapperCanvas.text()).toContain("TECHNICAL BRIEF");
    expect(wrapperCanvas.text()).toContain("Transportation Analytics & Computing Initiative");

    // Toggle animation playback button
    const playbackBtn = wrapperCanvas.find(".tux-editorial__canvas-playback-btn");
    expect(playbackBtn.attributes("aria-label")).toBe("Pause interactive animation");
    await playbackBtn.trigger("click");
    expect(playbackBtn.attributes("aria-label")).toBe("Play interactive animation");

    const violationsCanvas = await runComponentAxe(wrapperCanvas.element);
    expect(violationsCanvas).toEqual([]);
  });
});
