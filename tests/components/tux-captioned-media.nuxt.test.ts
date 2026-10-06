import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCaptionedMedia from "../../app/components/TuxCaptionedMedia.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCaptionedMedia Component", () => {
  it("renders image figure with caption, credit, and eyebrow", async () => {
    const wrapper = await mountSuspended(TuxCaptionedMedia, {
      props: {
        src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
        alt: "Connected autonomous shuttle navigating test intersection",
        caption: "Field trials of connected shuttle in mixed traffic conditions.",
        credit: "Photo: TTI Proving Grounds",
        eyebrow: "Figure 4",
        aspect: "16/9",
        align: "wide",
      },
    });

    expect(wrapper.element.tagName).toBe("FIGURE");
    expect(wrapper.classes()).toContain("tux-captioned-media");
    expect(wrapper.classes()).toContain("tux-captioned-media--wide");

    const img = wrapper.find("img.tux-captioned-media__img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("alt")).toBe("Connected autonomous shuttle navigating test intersection");

    expect(wrapper.find(".tux-captioned-media__eyebrow").text()).toBe("Figure 4");
    expect(wrapper.find(".tux-captioned-media__text").text()).toContain("Field trials of connected shuttle");
    expect(wrapper.find(".tux-captioned-media__credit").text()).toContain("Photo: TTI Proving Grounds");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders tone gradient placeholder when src is omitted", async () => {
    const wrapper = await mountSuspended(TuxCaptionedMedia, {
      props: {
        caption: "Telemetry sensor installation diagram.",
        tone: "maroon",
      },
    });

    expect(wrapper.find(".tux-captioned-media__placeholder").exists()).toBe(true);
    expect(wrapper.find(".tux-captioned-media__placeholder").classes()).toContain("tux-captioned-media__placeholder--maroon");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
