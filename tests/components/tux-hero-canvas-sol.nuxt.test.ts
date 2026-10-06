import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxHeroCanvasSol from "~/components/TuxHeroCanvasSol.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxHeroCanvasSol Component", () => {
  it("renders dedicated sol computing cluster canvas stage with seamless blend", async () => {
    const wrapper = await mountSuspended(TuxHeroCanvasSol, {
      props: {
        blend: "seamless",
        showControls: true,
      },
      slots: {
        default: () => "<h1>Next-Gen Computing Cluster</h1>",
      },
    });

    expect(wrapper.find(".tux-hero-canvas-sol").exists()).toBe(true);
    expect(wrapper.find(".tux-hero-canvas-sol--blend-seamless").exists()).toBe(true);
    expect(wrapper.find(".tux-hero-canvas-sol__bottom-bleed").exists()).toBe(true);

    const btn = wrapper.find(".tux-hero-canvas-sol__playback-btn");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("aria-label")).toContain("Pause");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("toggles playback state and updates aria-label on click", async () => {
    const wrapper = await mountSuspended(TuxHeroCanvasSol, {
      props: {
        blend: "seamless",
        showControls: true,
      },
    });

    const btn = wrapper.find(".tux-hero-canvas-sol__playback-btn");
    await btn.trigger("click");
    expect(btn.attributes("aria-label")).toContain("Play");

    await btn.trigger("click");
    expect(btn.attributes("aria-label")).toContain("Pause");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports adaptive and cinematic-dark modes", async () => {
    const wrapper = await mountSuspended(TuxHeroCanvasSol, {
      props: {
        mode: "adaptive",
      },
    });

    expect(wrapper.find(".tux-hero-canvas-sol--mode-adaptive").exists()).toBe(true);
  });
});
