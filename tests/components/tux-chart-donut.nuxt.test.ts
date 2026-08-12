// @vitest-environment nuxt
/**
 * TuxChartDonut — the chart-tooltip contract (components.md):
 * single-tab-stop keyboard access, per-slice hover, branded card,
 * sibling dimming, native <title> fallback, hover emit, tooltip prop.
 * First mounted-component coverage in the repo — before this, no test
 * ever exercised props, emits, or keyboard behavior on any component.
 */
import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxChartDonut from "../../app/components/TuxChartDonut.vue";

const slices = [
  { key: "a", label: "Alpha", value: 50 },
  { key: "b", label: "Beta", value: 30 },
  { key: "g", label: "Gamma", value: 20 },
];

describe("TuxChartDonut interaction contract", () => {
  it("is a single tab stop with an instructive accessible name", async () => {
    const w = await mountSuspended(TuxChartDonut, { props: { slices } });
    const svg = w.find("svg.tux-chart-donut__svg");
    expect(svg.attributes("tabindex")).toBe("0");
    expect(svg.attributes("aria-label")).toContain("arrow keys");
  });

  it("arrow keys cycle slices from the midpoint; the card and emit carry the slice", async () => {
    const w = await mountSuspended(TuxChartDonut, { props: { slices } });
    // mid seed: floor(3/2) = 1 → ArrowRight lands on index 2 (Gamma)
    await w.find("svg").trigger("keydown", { key: "ArrowRight" });
    const tip = w.find(".tux-chart-donut__tooltip");
    expect(tip.exists()).toBe(true);
    expect(tip.text()).toContain("Gamma");
    expect(tip.text()).toContain("of total");
    const hoverEvents = w.emitted("hover");
    expect(hoverEvents?.at(-1)?.[0]).toMatchObject({ index: 2, key: "g", label: "Gamma", value: 20 });
  });

  it("Escape clears the card, un-dims siblings, and emits null", async () => {
    const w = await mountSuspended(TuxChartDonut, { props: { slices } });
    await w.find("svg").trigger("keydown", { key: "ArrowRight" });
    expect(w.findAll(".tux-chart-donut__slice--dim").length).toBe(2);
    await w.find("svg").trigger("keydown", { key: "Escape" });
    expect(w.find(".tux-chart-donut__tooltip").exists()).toBe(false);
    expect(w.findAll(".tux-chart-donut__slice--dim").length).toBe(0);
    expect(w.emitted("hover")?.at(-1)?.[0]).toBeNull();
  });

  it("pointer hover activates the slice and dims the rest", async () => {
    const w = await mountSuspended(TuxChartDonut, { props: { slices } });
    await w.findAll(".tux-chart-donut__slice")[0]!.trigger("pointerenter");
    expect(w.find(".tux-chart-donut__tooltip").text()).toContain("Alpha");
    expect(w.findAll(".tux-chart-donut__slice--dim").length).toBe(2);
  });

  it("keeps the native <title> fallback on every slice", async () => {
    const w = await mountSuspended(TuxChartDonut, { props: { slices } });
    for (const slice of w.findAll(".tux-chart-donut__slice")) {
      expect(slice.find("title").exists()).toBe(true);
    }
  });

  it("tooltip=false disables the whole interaction layer", async () => {
    const w = await mountSuspended(TuxChartDonut, { props: { slices, tooltip: false } });
    await w.find("svg").trigger("keydown", { key: "ArrowRight" });
    expect(w.find(".tux-chart-donut__tooltip").exists()).toBe(false);
    expect(w.emitted("hover")).toBeUndefined();
  });
});
