import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxHeroCanvas from "~/components/TuxHeroCanvas.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxHeroCanvas Component", () => {
  it("renders canvas stage with seamless blend and accessible playback controls", async () => {
    const wrapper = await mountSuspended(TuxHeroCanvas, {
      props: {
        variant: "sol",
        blend: "seamless",
        showControls: true,
      },
      slots: {
        default: () => "<h1>Research Index Hero</h1>",
      },
    });

    expect(wrapper.find(".tux-hero-canvas").exists()).toBe(true);
    expect(wrapper.find(".tux-hero-canvas--blend-seamless").exists()).toBe(true);
    expect(wrapper.find(".tux-hero-canvas__bottom-bleed").exists()).toBe(true);

    const btn = wrapper.find(".tux-hero-canvas__playback-btn");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("aria-label")).toContain("Pause");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("toggles playback state and updates aria-label on click", async () => {
    const wrapper = await mountSuspended(TuxHeroCanvas, {
      props: {
        variant: "sol",
        blend: "seamless",
        showControls: true,
      },
    });

    const btn = wrapper.find(".tux-hero-canvas__playback-btn");
    await btn.trigger("click");
    expect(btn.attributes("aria-label")).toContain("Play");

    await btn.trigger("click");
    expect(btn.attributes("aria-label")).toContain("Pause");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
