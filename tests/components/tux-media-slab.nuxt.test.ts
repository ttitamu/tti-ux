import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { h } from "vue";
import TuxMediaSlab from "../../app/components/TuxMediaSlab.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMediaSlab Component", () => {
  it("renders overlay layout with title, eyebrow, and tone placeholder", async () => {
    const wrapper = await mountSuspended(TuxMediaSlab, {
      props: {
        title: "Autonomous Vehicle Proving Grounds",
        eyebrow: "Research Infrastructure",
        dek: "State-of-the-art proving facilities for connected freight and roadside sensors.",
        tone: "maroon",
        layout: "overlay",
      },
    });

    expect(wrapper.classes()).toContain("tux-media-slab");
    expect(wrapper.classes()).toContain("tux-media-slab--overlay");
    expect(wrapper.text()).toContain("Autonomous Vehicle Proving Grounds");
    expect(wrapper.text()).toContain("Research Infrastructure");
    expect(wrapper.text()).toContain("State-of-the-art proving facilities");

    const placeholder = wrapper.find(".tux-media-slab__placeholder");
    expect(placeholder.classes()).toContain("tux-media-slab__placeholder--maroon");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders split layout with custom image and action slot", async () => {
    const wrapper = await mountSuspended(TuxMediaSlab, {
      props: {
        title: "Connected Freight Corridors",
        layout: "split",
        imageSide: "left",
        src: "/images/freight.jpg",
        alt: "Connected truck on highway",
        height: "tall",
      },
      slots: {
        actions: () => h("a", { href: "/initiatives/freight" }, "Explore Initiative"),
      },
    });

    expect(wrapper.classes()).toContain("tux-media-slab--split");
    expect(wrapper.classes()).toContain("tux-media-slab--image-left");
    expect(wrapper.classes()).toContain("tux-media-slab--height-tall");

    const img = wrapper.find("img.tux-media-slab__img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/images/freight.jpg");
    expect(img.attributes("alt")).toBe("Connected truck on highway");

    expect(wrapper.text()).toContain("Explore Initiative");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
