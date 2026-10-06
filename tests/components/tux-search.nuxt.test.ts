import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxSearch from "../../app/components/TuxSearch.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxSearch Component", () => {
  it("renders field variant with input and search icon", async () => {
    const wrapper = await mountSuspended(TuxSearch, {
      props: {
        modelValue: "autonomous shuttle",
        placeholder: "Search research projects...",
        ariaLabel: "Search projects",
        clearable: true,
      },
    });

    expect(wrapper.classes()).toContain("tux-search");
    const input = wrapper.find('input[type="search"]');
    expect(input.exists()).toBe(true);
    expect((input.element as HTMLInputElement).value).toBe("autonomous shuttle");
    expect(input.attributes("placeholder")).toBe("Search research projects...");

    const clearBtn = wrapper.find("button.tux-search__clear");
    expect(clearBtn.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders slab variant with action button", async () => {
    const wrapper = await mountSuspended(TuxSearch, {
      props: {
        variant: "slab",
        actionLabel: "Search Corpus",
        placeholder: "Enter query or DOI...",
      },
    });

    expect(wrapper.classes()).toContain("tux-search--slab");
    const actionBtn = wrapper.find("button.tux-search__action");
    expect(actionBtn.exists()).toBe(true);
    expect(actionBtn.text()).toContain("Search Corpus");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders block variant with heading and lede", async () => {
    const wrapper = await mountSuspended(TuxSearch, {
      props: {
        variant: "block",
        heading: "Corridor Knowledge Hub",
        lede: "Search over 12,000 technical papers, datasets, and telemetry reports.",
      },
    });

    expect(wrapper.classes()).toContain("tux-search--block");
    expect(wrapper.attributes("role")).toBe("search");
    expect(wrapper.find(".tux-search__heading").text()).toBe("Corridor Knowledge Hub");
    expect(wrapper.find(".tux-search__lede").text()).toContain("Search over 12,000 technical papers");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
