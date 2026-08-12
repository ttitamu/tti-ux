// @vitest-environment nuxt
/**
 * TuxTreemap — keyboard drill-in contract. Cells were focusable with
 * no key handlers (a focus ring with no readout and no way to drill);
 * these tests lock the fixed behavior: cells are buttons with
 * accessible names, focus shows the tooltip, Enter drills, Backspace
 * drills up, and the canvas is a group (not an opaque image) so the
 * buttons aren't nested-interactive violations.
 */
import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxTreemap from "../../app/components/TuxTreemap.vue";

// Three levels deep on purpose: with the default maxDepth of 2, "a1"
// sits AT the depth cutoff while still having children — that's the
// shape that renders as a plain (focusable, drillable) cell.
const data = {
  name: "corpus",
  children: [
    {
      name: "alpha",
      children: [
        {
          name: "a1",
          children: [
            { name: "x", size: 35 },
            { name: "y", size: 25 },
          ],
        },
        { name: "a2", size: 40 },
      ],
    },
    { name: "beta", size: 50 },
  ],
};

describe("TuxTreemap keyboard contract", () => {
  it("renders leaf cells as buttons with accessible names inside a group canvas", async () => {
    const w = await mountSuspended(TuxTreemap, { props: { data } });
    expect(w.find("svg.tux-treemap__canvas").attributes("role")).toBe("group");
    const leaves = w.findAll(".tux-treemap__cell--leaf");
    expect(leaves.length).toBeGreaterThan(0);
    for (const leaf of leaves) {
      expect(leaf.attributes("role")).toBe("button");
      expect(leaf.attributes("tabindex")).toBe("0");
      expect(leaf.attributes("aria-label")).toBeTruthy();
    }
  });

  it("focus shows the tooltip anchored to the cell; Escape dismisses", async () => {
    const w = await mountSuspended(TuxTreemap, { props: { data } });
    const leaf = w.find(".tux-treemap__cell--leaf");
    await leaf.trigger("focus");
    const tip = w.find(".tux-treemap__tooltip");
    expect(tip.exists()).toBe(true);
    expect(tip.attributes("role")).toBe("status");
    await leaf.trigger("keydown", { key: "Escape" });
    expect(w.find(".tux-treemap__tooltip").exists()).toBe(false);
  });

  it("Enter drills into a cell with children; Backspace drills back up", async () => {
    const w = await mountSuspended(TuxTreemap, { props: { data } });
    const crumbs = () => w.findAll(".tux-treemap__crumb").length;
    const before = crumbs();
    const drillable = w
      .findAll(".tux-treemap__cell--leaf")
      .find((c) => (c.attributes("aria-label") ?? "").includes("drill"));
    expect(drillable, "expected a drillable leaf cell (aria-label mentions drilling)").toBeTruthy();
    await drillable!.trigger("keydown", { key: "Enter" });
    expect(crumbs()).toBe(before + 1);
    await w.find(".tux-treemap__cell--leaf").trigger("keydown", { key: "Backspace" });
    expect(crumbs()).toBe(before);
  });
});
