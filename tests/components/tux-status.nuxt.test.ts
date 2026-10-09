import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxStatus from "../../app/components/TuxStatus.vue";

describe("TuxStatus Component", () => {
  it("renders chip kind with default state label and passes axe checks", async () => {
    const wrapper = await mountSuspended(TuxStatus, {
      props: {
        state: "ok",
      },
    });

    expect(wrapper.classes()).toContain("tux-status--ok");
    expect(wrapper.text()).toBe("OK");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders dot kind with accessible role and aria-label", async () => {
    const wrapper = await mountSuspended(TuxStatus, {
      props: {
        state: "critical",
        kind: "dot",
      },
    });

    expect(wrapper.classes()).toContain("tux-status--critical");
    expect(wrapper.classes()).toContain("tux-status--dot");
    expect(wrapper.attributes("role")).toBe("status");
    expect(wrapper.attributes("aria-label")).toBe("CRITICAL");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports acked state, custom label, and text kind", async () => {
    const wrapper = await mountSuspended(TuxStatus, {
      props: {
        state: "warning",
        kind: "text",
        acked: true,
        label: "Acknowledged Ingest Latency",
      },
    });

    expect(wrapper.classes()).toContain("tux-status--warning");
    expect(wrapper.classes()).toContain("tux-status--text");
    expect(wrapper.classes()).toContain("tux-status--acked");
    expect(wrapper.text()).toBe("Acknowledged Ingest Latency");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders distinct multi-channel SVG shape glyphs for colorblind accessibility", async () => {
    // 1. OK renders circle base
    const okWrapper = await mountSuspended(TuxStatus, {
      props: { state: "ok", kind: "dot" },
    });
    expect(okWrapper.find("svg.tux-status__glyph").exists()).toBe(true);
    expect(okWrapper.find("circle.tux-status__shape-bg").exists()).toBe(true);

    // 2. WARNING renders triangle base
    const warnWrapper = await mountSuspended(TuxStatus, {
      props: { state: "warning", kind: "dot" },
    });
    expect(warnWrapper.find("svg.tux-status__glyph").exists()).toBe(true);
    expect(warnWrapper.find("path.tux-status__shape-bg").exists()).toBe(true);

    // 3. CRITICAL renders octagon polygon
    const critWrapper = await mountSuspended(TuxStatus, {
      props: { state: "critical", kind: "dot" },
    });
    expect(critWrapper.find("polygon.tux-status__shape-bg").exists()).toBe(true);

    // 4. MAINTENANCE renders rounded rectangle
    const maintWrapper = await mountSuspended(TuxStatus, {
      props: { state: "maintenance", kind: "dot" },
    });
    expect(maintWrapper.find("rect.tux-status__shape-bg").exists()).toBe(true);

    // 5. Chip kind with glyph=true renders leading shape glyph with text
    const chipGlyphWrapper = await mountSuspended(TuxStatus, {
      props: { state: "critical", kind: "chip", glyph: true },
    });
    expect(chipGlyphWrapper.find("svg.tux-status__glyph--inline").exists()).toBe(true);
    expect(chipGlyphWrapper.text()).toBe("CRITICAL");

    // 6. Dot kind with glyph=false suppresses SVG glyph
    const bareDotWrapper = await mountSuspended(TuxStatus, {
      props: { state: "ok", kind: "dot", glyph: false },
    });
    expect(bareDotWrapper.find("svg").exists()).toBe(false);
  });
});
