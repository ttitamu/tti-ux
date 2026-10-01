import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxAlphaNav from "../../app/components/TuxAlphaNav.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxAlphaNav Component", () => {
  it("renders alphabet navigation landmark with anchor jump links", async () => {
    const wrapper = await mountSuspended(TuxAlphaNav, {
      props: {
        available: ["A", "B", "C", "T"],
        mode: "anchor",
        ariaLabel: "Directory letter index",
      },
    });

    expect(wrapper.element.tagName).toBe("NAV");
    expect(wrapper.classes()).toContain("tux-alpha-nav");
    expect(wrapper.attributes("aria-label")).toBe("Directory letter index");

    const links = wrapper.findAll("a.tux-alpha-nav__link");
    expect(links.length).toBe(4);
    expect(links[0].attributes("href")).toBe("#A");
    expect(links[0].text()).toBe("A");

    const disabledSpans = wrapper.findAll("span.tux-alpha-nav__link--disabled");
    expect(disabledSpans.length).toBe(22);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports emit mode with links and All option", async () => {
    const wrapper = await mountSuspended(TuxAlphaNav, {
      props: {
        available: ["M", "P", "S"],
        mode: "emit",
        showAll: true,
        modelValue: "M",
      },
    });

    const activeLinks = wrapper.findAll("a.tux-alpha-nav__link");
    expect(activeLinks.length).toBe(4); // "All" + M, P, S
    expect(activeLinks[0].text()).toBe("All");

    await activeLinks[1].trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual(["M"]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
