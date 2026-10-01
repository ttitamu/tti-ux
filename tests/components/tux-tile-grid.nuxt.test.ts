import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxTileGrid from "../../app/components/TuxTileGrid.vue";

describe("TuxTileGrid Component", () => {
  it("renders canonical 6-tile fundamentals grid on eggshell surface", async () => {
    const wrapper = await mountSuspended(TuxTileGrid, {
      props: {
        title: "TTI FUNDAMENTALS",
        subtitle: "Core operating principles driving our public research mission.",
      },
    });

    expect(wrapper.text()).toContain("TTI FUNDAMENTALS");
    expect(wrapper.text()).toContain("Core operating principles driving our public research mission.");
    expect(wrapper.text()).toContain("Safety First");
    expect(wrapper.text()).toContain("Ethical Integrity");
    expect(wrapper.text()).toContain("Collaborative Spirit");
    expect(wrapper.text()).toContain("Research Excellence");
    expect(wrapper.text()).toContain("Continuous Learning");
    expect(wrapper.text()).toContain("Public Stewardship");

    const tiles = wrapper.findAll(".tux-tile");
    expect(tiles.length).toBe(6);
    expect(tiles[0].classes()).toContain("bg-surface-eggshell");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports column variants and raised white surface", async () => {
    const wrapper = await mountSuspended(TuxTileGrid, {
      props: {
        columns: 2,
        surface: "raised",
        tiles: [
          { title: "Atlas Corridor", description: "Telemetry engine", to: "/examples/corridor-analytics" },
          { title: "Landscape Studio", description: "Design kit", to: "/desk" },
        ],
      },
    });

    const grid = wrapper.find(".grid");
    expect(grid.classes()).toContain("sm:grid-cols-2");

    const tiles = wrapper.findAll(".tux-tile");
    expect(tiles.length).toBe(2);
    expect(tiles[0].classes()).toContain("bg-surface-raised");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders badges and navigation links cleanly", async () => {
    const wrapper = await mountSuspended(TuxTileGrid, {
      props: {
        tiles: [
          {
            title: "Forgejo Code Repository",
            description: "Self-hosted Git service",
            href: "https://code.tti.tamu.edu",
            badge: "Secure",
          },
        ],
      },
    });

    expect(wrapper.text()).toContain("Forgejo Code Repository");
    expect(wrapper.text()).toContain("Secure");

    const link = wrapper.find("a[target='_blank']");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("https://code.tti.tamu.edu");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
