import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDeskModulePalette from "../../app/components/desk/TuxDeskModulePalette.vue";
import { MODULE_LIST } from "../../app/utils/desk/modules";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskModulePalette Component", () => {
  it("renders canonical TUX module tiles and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDeskModulePalette);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("group");
    expect(wrapper.attributes("aria-label")).toBe("Insert a page module");

    // All module options from MODULE_LIST must be present
    for (const spec of MODULE_LIST) {
      expect(wrapper.text()).toContain(spec.label);
    }

    const tiles = wrapper.findAll(".tux-desk-palette__tile");
    expect(tiles.length).toBe(MODULE_LIST.length);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits insert event with module kind when tile is clicked", async () => {
    const wrapper = await mountSuspended(TuxDeskModulePalette);

    const firstTile = wrapper.find(".tux-desk-palette__tile");
    await firstTile.trigger("click");

    expect(wrapper.emitted("insert")).toBeTruthy();
    expect(wrapper.emitted("insert")?.[0]).toEqual([MODULE_LIST[0].kind]);
  });

  it("respects disabled state and prevents insertion", async () => {
    const wrapper = await mountSuspended(TuxDeskModulePalette, {
      props: {
        disabled: true,
      },
    });

    const tiles = wrapper.findAll("button.tux-desk-palette__tile");
    for (const tile of tiles) {
      expect(tile.attributes("disabled")).toBeDefined();
    }

    await tiles[0].trigger("click");
    expect(wrapper.emitted("insert")).toBeFalsy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
