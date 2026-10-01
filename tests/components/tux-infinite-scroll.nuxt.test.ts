import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeAll, describe, expect, it } from "vitest";
import TuxInfiniteScroll from "~/components/TuxInfiniteScroll.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxInfiniteScroll Component", () => {
  beforeAll(() => {
    if (typeof window !== "undefined") {
      if (!window.IntersectionObserver) {
        window.IntersectionObserver = class {
          observe() {}
          unobserve() {}
          disconnect() {}
        } as any;
      }
    }
  });

  it("renders sentinel container and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxInfiniteScroll, {
      props: {
        loaded: 20,
        total: 100,
      },
    });

    expect(wrapper.find(".tux-infinite-scroll__sentinel").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders keyboard fallback button and emits load event on click", async () => {
    const wrapper = await mountSuspended(TuxInfiniteScroll, {
      props: {
        loaded: 25,
        total: 100,
        keyboardFallback: true,
      },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain("Load more");

    await btn.trigger("click");
    expect(wrapper.emitted("load")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders terminal state when loaded equals or exceeds total", async () => {
    const wrapper = await mountSuspended(TuxInfiniteScroll, {
      props: {
        loaded: 100,
        total: 100,
        noun: "record",
      },
    });

    expect(wrapper.find(".tux-infinite-scroll__terminal").exists()).toBe(true);
    expect(wrapper.text()).toContain("End of list · 100 records");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
