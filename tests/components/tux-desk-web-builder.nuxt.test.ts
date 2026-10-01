import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDeskWebBuilder from "../../app/components/desk/TuxDeskWebBuilder.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskWebBuilder Component", () => {
  const sampleDoc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Enterprise mobility platform documentation." }],
      },
    ],
  };

  it("renders web builder command bar, canvas, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDeskWebBuilder, {
      props: {
        modelValue: sampleDoc,
        pageMeta: {
          title: "Mobility Operations Hub",
          slug: "mobility-ops-hub",
          reviewCadenceDays: 60,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("tux-desk-web-builder");

    // Command bar toggles
    expect(wrapper.text()).toContain("Navigator");
    expect(wrapper.text()).toContain("Inspector");
    expect(wrapper.text()).toContain("Presets");
    expect(wrapper.text()).toContain("Add Block");

    // Mode switchers
    expect(wrapper.text()).toContain("Visual");
    expect(wrapper.text()).toContain("Split");
    expect(wrapper.text()).toContain("Source");
    expect(wrapper.text()).toContain("Preview");

    // Region worksurface canvas
    const canvas = wrapper.find("[role='region']");
    expect(canvas.exists()).toBe(true);
    expect(canvas.attributes("aria-label")).toBe("Worksurface canvas");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("switches builder mode to source and split correctly", async () => {
    const wrapper = await mountSuspended(TuxDeskWebBuilder, {
      props: {
        modelValue: sampleDoc,
      },
    });

    // Switch to Source mode
    const sourceBtn = wrapper
      .findAll("button")
      .find((b) => b.text().trim() === "Source");
    expect(sourceBtn).toBeDefined();
    await sourceBtn?.trigger("click");

    expect(wrapper.find(".tux-desk-source-editor").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("switches builder mode to preview correctly", async () => {
    const wrapper = await mountSuspended(TuxDeskWebBuilder, {
      props: {
        modelValue: sampleDoc,
      },
    });

    // Switch to Preview mode
    const previewBtn = wrapper
      .findAll("button")
      .find((b) => b.text().trim() === "Preview");
    expect(previewBtn).toBeDefined();
    await previewBtn?.trigger("click");

    expect(wrapper.find(".tux-desk-article").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
