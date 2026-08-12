// @vitest-environment nuxt
/**
 * TuxChartScatter — the roving-cursor keyboard model. Dots must NOT be
 * individual tab stops (a 500-point scatter previously injected 500);
 * the svg is the single focusable surface and arrows walk points in
 * x order across all series.
 */
import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxChartScatter from "../../app/components/TuxChartScatter.vue";

const series = [
  { key: "a", label: "Series A", points: [{ x: 1, y: 10 }, { x: 3, y: 30 }] },
  { key: "b", label: "Series B", points: [{ x: 2, y: 20 }, { x: 4, y: 40 }] },
];

describe("TuxChartScatter roving cursor", () => {
  it("exposes exactly one tab stop — the svg, never the dots", async () => {
    const w = await mountSuspended(TuxChartScatter, { props: { series } });
    expect(w.find("svg").attributes("tabindex")).toBe("0");
    expect(w.find("svg").attributes("aria-label")).toContain("4 points across 2 series");
    for (const dot of w.findAll(".tux-chart-scatter__dot")) {
      expect(dot.attributes("tabindex")).toBeUndefined();
    }
  });

  it("arrows walk points in x order across series, ringing the active dot", async () => {
    const w = await mountSuspended(TuxChartScatter, { props: { series } });
    // flat x order is [1(a), 2(b), 3(a), 4(b)]; mid seed floor(4/2)=2 →
    // ArrowRight lands on x=4 (series B)
    await w.find("svg").trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("hover")?.at(-1)?.[0]).toMatchObject({ seriesKey: "b", x: 4, y: 40 });
    expect(w.findAll(".tux-chart-scatter__dot--active").length).toBe(1);
    // walk back down: 4 → 3 (series A)
    await w.find("svg").trigger("keydown", { key: "ArrowLeft" });
    expect(w.emitted("hover")?.at(-1)?.[0]).toMatchObject({ seriesKey: "a", x: 3 });
  });

  it("Escape clears the tooltip and emits null", async () => {
    const w = await mountSuspended(TuxChartScatter, { props: { series } });
    await w.find("svg").trigger("keydown", { key: "ArrowRight" });
    expect(w.find(".tux-chart-scatter__tooltip").exists()).toBe(true);
    await w.find("svg").trigger("keydown", { key: "Escape" });
    expect(w.find(".tux-chart-scatter__tooltip").exists()).toBe(false);
    expect(w.emitted("hover")?.at(-1)?.[0]).toBeNull();
  });

  it("pointer hover on a dot syncs the shared index so arrows continue from it", async () => {
    const w = await mountSuspended(TuxChartScatter, { props: { series } });
    // hover series B's first point (x=2, flat index 1)…
    const dots = w.findAll(".tux-chart-scatter__dot");
    await dots[2]!.trigger("pointerenter"); // dots render series-major: a0,a1,b0,b1 → index 2 = b(x=2)
    expect(w.emitted("hover")?.at(-1)?.[0]).toMatchObject({ seriesKey: "b", x: 2 });
    // …then ArrowRight continues in x order to x=3 (series A)
    await w.find("svg").trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("hover")?.at(-1)?.[0]).toMatchObject({ seriesKey: "a", x: 3 });
  });
});
