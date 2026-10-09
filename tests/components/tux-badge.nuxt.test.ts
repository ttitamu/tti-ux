import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxBadge from "../../app/components/TuxBadge.vue";

describe("TuxBadge Component", () => {
  it("renders with default props and slot content with clean accessibility", async () => {
    const wrapper = await mountSuspended(TuxBadge, {
      slots: {
        default: () => "Default Badge",
      },
    });
    expect(wrapper.text()).toContain("Default Badge");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders tier and lifecycle status with indicators and aria safety", async () => {
    const tierWrapper = await mountSuspended(TuxBadge, {
      props: { tier: "sensitive" },
    });
    expect(tierWrapper.classes()).toContain("tux-badge--tier-sensitive");

    const runningWrapper = await mountSuspended(TuxBadge, {
      props: { status: "running" },
    });
    expect(runningWrapper.classes()).toContain("tux-badge--status-running");
    expect(runningWrapper.findComponent({ name: "UIcon" }).exists()).toBe(true);

    const completedWrapper = await mountSuspended(TuxBadge, {
      props: { status: "completed" },
    });
    expect(completedWrapper.classes()).toContain("tux-badge--status-completed");
    expect(completedWrapper.find("[aria-hidden='true']").exists()).toBe(true);

    const violations = await runComponentAxe(completedWrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports bold mode and explicit dots & icons", async () => {
    const boldWrapper = await mountSuspended(TuxBadge, {
      props: { tone: "success", bold: true },
      slots: {
        default: () => "LIVE STREAM",
      },
    });
    expect(boldWrapper.text()).toContain("LIVE STREAM");

    const dotWrapper = await mountSuspended(TuxBadge, {
      props: { tone: "success", dot: true },
      slots: {
        default: () => "ONLINE",
      },
    });
    expect(dotWrapper.find(".animate-pulse").exists()).toBe(true);

    const iconWrapper = await mountSuspended(TuxBadge, {
      props: { tone: "brand", icon: "lucide:shield-check" },
      slots: {
        default: () => "Secured",
      },
    });
    expect(iconWrapper.findComponent({ name: "UIcon" }).exists()).toBe(true);

    const violations = await runComponentAxe(iconWrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders tags and count badges cleanly", async () => {
    const tagWrapper = await mountSuspended(TuxBadge, {
      props: { kind: "tag" },
      slots: {
        default: () => "topic:safety",
      },
    });
    expect(tagWrapper.text()).toContain("topic:safety");

    const countWrapper = await mountSuspended(TuxBadge, {
      props: { kind: "count", count: 42 },
      slots: {
        default: () => "pdf",
      },
    });
    expect(countWrapper.text()).toContain("pdf");
    expect(countWrapper.text()).toContain("42");

    const violations = await runComponentAxe(countWrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports multi-channel shape glyph redundancy for colorblind accessibility", async () => {
    // 1. Status completed with glyph renders check-circle icon
    const completedGlyphWrapper = await mountSuspended(TuxBadge, {
      props: { status: "completed", glyph: true },
    });
    const completedIcon = completedGlyphWrapper.findComponent({ name: "UIcon" });
    expect(completedIcon.exists()).toBe(true);
    expect(completedIcon.props("name")).toBe("lucide:check-circle-2");

    // 2. Status failed with glyph renders alert-octagon icon
    const failedGlyphWrapper = await mountSuspended(TuxBadge, {
      props: { status: "failed", glyph: true },
    });
    const failedIcon = failedGlyphWrapper.findComponent({ name: "UIcon" });
    expect(failedIcon.exists()).toBe(true);
    expect(failedIcon.props("name")).toBe("lucide:alert-octagon");

    // 3. Tone warning with glyph renders alert-triangle icon
    const warningGlyphWrapper = await mountSuspended(TuxBadge, {
      props: { tone: "warning", glyph: true },
      slots: { default: () => "CAUTION" },
    });
    const warningIcon = warningGlyphWrapper.findComponent({ name: "UIcon" });
    expect(warningIcon.exists()).toBe(true);
    expect(warningIcon.props("name")).toBe("lucide:alert-triangle");

    const violations = await runComponentAxe(completedGlyphWrapper.element);
    expect(violations).toEqual([]);
  });
});

