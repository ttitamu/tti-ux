import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxSkeleton from "../../app/components/TuxSkeleton.vue";

describe("TuxSkeleton Component", () => {
  it("renders primitive skeleton with accessible status role and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxSkeleton, {
      props: {
        width: "12rem",
        height: "2rem",
        label: "Loading corridor data…",
      },
    });

    expect(wrapper.attributes("role")).toBe("status");
    expect(wrapper.attributes("aria-label")).toBe("Loading corridor data…");
    expect(wrapper.classes()).toContain("tux-skeleton-wrap--primitive");
    expect(wrapper.classes()).toContain("tux-skeleton-wrap--shimmer");

    const skeletonEl = wrapper.find(".tux-skeleton");
    expect(skeletonEl.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders card preset with composed media, heading, and lines", async () => {
    const wrapper = await mountSuspended(TuxSkeleton, {
      props: {
        kind: "card",
        animated: "pulse",
      },
    });

    expect(wrapper.classes()).toContain("tux-skeleton-wrap--card");
    expect(wrapper.classes()).toContain("tux-skeleton-wrap--pulse");
    expect(wrapper.find(".tux-skeleton__card").exists()).toBe(true);
    expect(wrapper.find(".tux-skeleton__media").exists()).toBe(true);
    expect(wrapper.find(".tux-skeleton__heading").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders list preset with requested count of repeated lines", async () => {
    const wrapper = await mountSuspended(TuxSkeleton, {
      props: {
        kind: "list",
        count: 4,
        animated: "never",
      },
    });

    expect(wrapper.classes()).toContain("tux-skeleton-wrap--list");
    expect(wrapper.classes()).toContain("tux-skeleton-wrap--never");
    const items = wrapper.findAll(".tux-skeleton__list-item");
    expect(items.length).toBe(4);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
