import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxAuthorByline from "../../app/components/TuxAuthorByline.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxAuthorByline Component", () => {
  it("renders compact author byline with affiliations and corresponding author note", async () => {
    const wrapper = await mountSuspended(TuxAuthorByline, {
      props: {
        layout: "compact",
        authors: [
          { name: "Dr. Elena Vance", affiliations: [1], corresponding: true, email: "e-vance@tti.tamu.edu" },
          { name: "Marcus Brody", affiliations: [1, 2] },
        ],
        affiliations: [
          "Texas A&M Transportation Institute",
          "Zachry Department of Civil & Environmental Engineering",
        ],
      },
    });

    expect(wrapper.classes()).toContain("tux-author-byline");
    expect(wrapper.classes()).toContain("tux-author-byline--compact");
    expect(wrapper.text()).toContain("Authors");
    expect(wrapper.text()).toContain("Dr. Elena Vance");
    expect(wrapper.text()).toContain("Marcus Brody");
    expect(wrapper.text()).toContain("Texas A&M Transportation Institute");
    expect(wrapper.text()).toContain("Zachry Department of Civil & Environmental Engineering");
    expect(wrapper.text()).toContain("e-vance@tti.tamu.edu");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders stacked author layout", async () => {
    const wrapper = await mountSuspended(TuxAuthorByline, {
      props: {
        layout: "stacked",
        authors: [
          { name: "Sarah Connor", affiliations: [1] },
        ],
        affiliations: [
          "Center for Transportation Safety",
        ],
      },
    });

    expect(wrapper.classes()).toContain("tux-author-byline--stacked");
    expect(wrapper.text()).toContain("Sarah Connor");
    expect(wrapper.text()).toContain("Center for Transportation Safety");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
