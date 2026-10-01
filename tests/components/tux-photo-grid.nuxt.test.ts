import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxPhotoGrid from "~/components/TuxPhotoGrid.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxPhotoGrid Component", () => {
  it("renders photo gallery with captions, credits, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxPhotoGrid, {
      props: {
        items: [
          {
            src: "/images/crash-test.jpg",
            alt: "MASH 350 barrier impact testing at RELLIS Campus",
            caption: "High-speed crash testing facility",
            credit: "TTI Proving Grounds",
          },
          {
            alt: "Autonomous Freight Shuttle Corridor",
            caption: "Autonomous freight platooning",
            tone: "maroon",
          },
        ],
        kind: "photo",
        columns: 2,
      },
    });

    expect(wrapper.text()).toContain("High-speed crash testing facility");
    expect(wrapper.text()).toContain("TTI Proving Grounds");
    expect(wrapper.text()).toContain("Autonomous freight platooning");

    const img = wrapper.find("img.tux-photo-grid__img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("alt")).toBe("MASH 350 barrier impact testing at RELLIS Campus");

    const placeholder = wrapper.find(".tux-photo-grid__placeholder");
    expect(placeholder.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports logo kind with linked partner tiles and custom aspect ratio", async () => {
    const wrapper = await mountSuspended(TuxPhotoGrid, {
      props: {
        kind: "logo",
        aspect: "1/1",
        columns: 3,
        items: [
          {
            src: "/logos/txdot.png",
            alt: "Texas Department of Transportation",
            href: "https://www.txdot.gov",
          },
          {
            src: "/logos/fhwa.png",
            alt: "Federal Highway Administration",
            href: "/partners/fhwa",
          },
        ],
      },
    });

    expect(wrapper.find(".tux-photo-grid--logo").exists()).toBe(true);
    const links = wrapper.findAll(".tux-photo-grid__tile");
    expect(links.length).toBe(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
