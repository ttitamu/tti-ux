// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxStalenessBanner from "../../app/components/TuxStalenessBanner.vue";

describe("TuxStalenessBanner Component", () => {
  it("renders warning banner when stale is true with accessible alert role", async () => {
    const wrapper = await mountSuspended(TuxStalenessBanner, {
      props: {
        stale: true,
        owner: "TTI Mobility Group",
      },
    });

    expect(wrapper.find("[data-testid='tux-staleness-banner']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='tux-staleness-banner']").attributes("role")).toBe("alert");
    expect(wrapper.text()).toContain("Verification window expired");
    expect(wrapper.text()).toContain("TTI Mobility Group");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("does not render when stale is false and showVerifiedBadge is false", async () => {
    const wrapper = await mountSuspended(TuxStalenessBanner, {
      props: {
        stale: false,
        showVerifiedBadge: false,
      },
    });

    expect(wrapper.find("[data-testid='tux-staleness-banner']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='tux-staleness-verified']").exists()).toBe(false);
  });

  it("renders verified pill when not stale and showVerifiedBadge is true", async () => {
    const wrapper = await mountSuspended(TuxStalenessBanner, {
      props: {
        stale: false,
        showVerifiedBadge: true,
        verifiedUntil: "2030-01-01",
        owner: "Data Architecture",
      },
    });

    expect(wrapper.find("[data-testid='tux-staleness-verified']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Verified documentation");
    expect(wrapper.text()).toContain("Data Architecture");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits request-review event on button click", async () => {
    const wrapper = await mountSuspended(TuxStalenessBanner, {
      props: {
        stale: true,
        pageId: "docs/adr/0001",
        owner: "Core Team",
      },
    });

    const btn = wrapper.find(".tux-staleness-banner__btn");
    expect(btn.exists()).toBe(true);
    await btn.trigger("click");

    const emitted = wrapper.emitted("request-review");
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]?.[0]).toMatchObject({
      pageId: "docs/adr/0001",
      owner: "Core Team",
    });
    expect(wrapper.text()).toContain("Review flagged");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("dismisses when close button is clicked", async () => {
    const wrapper = await mountSuspended(TuxStalenessBanner, {
      props: {
        stale: true,
        dismissable: true,
      },
    });

    const closeBtn = wrapper.find(".tux-staleness-banner__dismiss");
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger("click");

    expect(wrapper.emitted("dismiss")).toBeTruthy();
    expect(wrapper.find("[data-testid='tux-staleness-banner']").exists()).toBe(false);
  });
});

