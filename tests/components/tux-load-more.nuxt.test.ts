import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxLoadMore from "~/components/TuxLoadMore.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxLoadMore Component", () => {
  it("renders load more button with remaining count and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxLoadMore, {
      props: {
        loaded: 10,
        total: 50,
        noun: "report",
      },
    });

    expect(wrapper.text()).toContain("Load more");
    expect(wrapper.text()).toContain("10");
    expect(wrapper.text()).toContain("50");
    expect(wrapper.text()).toContain("40 remaining");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits load event when button is clicked", async () => {
    const wrapper = await mountSuspended(TuxLoadMore, {
      props: {
        loaded: 15,
        total: 30,
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted("load")).toBeTruthy();
  });

  it("renders terminal state when loaded equals or exceeds total", async () => {
    const wrapper = await mountSuspended(TuxLoadMore, {
      props: {
        loaded: 50,
        total: 50,
        noun: "corridor",
        terminalLabel: "All corridors loaded",
      },
    });

    expect(wrapper.find("button").exists()).toBe(false);
    expect(wrapper.text()).toContain("All corridors loaded · 50 corridors");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("shows spinner and disables button when loading is true", async () => {
    const wrapper = await mountSuspended(TuxLoadMore, {
      props: {
        loaded: 10,
        total: 50,
        loading: true,
      },
    });

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
    expect(wrapper.text()).toContain("Loading…");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
