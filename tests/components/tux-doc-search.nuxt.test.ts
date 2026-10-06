import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDocSearch from "../../app/components/TuxDocSearch.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDocSearch Component", () => {
  const customItems = [
    { title: "Components Doctrine", to: "/design/components", section: "Design", description: "Standard component census and rules" },
    { title: "Design Tokens", to: "/tokens", section: "Tokens", description: "Interactive CSS tokens catalog" },
    { title: "React Integration", to: "/install/react", section: "Install", description: "Using TUX in React applications" },
  ];

  it("renders search input, combobox accessibility attributes, and passes Axe audit", async () => {
    const wrapper = await mountSuspended(TDocSearchWrapper, {
      props: {
        items: customItems,
      },
    });

    const input = wrapper.find<HTMLInputElement>("input[type='search']");
    expect(input.exists()).toBe(true);
    expect(input.attributes("role")).toBe("combobox");
    expect(input.attributes("aria-label")).toBe("Search documentation");
    expect(input.attributes("aria-autocomplete")).toBe("list");
    expect(input.attributes("aria-expanded")).toBe("false");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("filters search results when query is typed and emits select on click", async () => {
    const wrapper = await mountSuspended(TuxDocSearch, {
      props: {
        items: customItems,
      },
    });

    const input = wrapper.find<HTMLInputElement>("input[type='search']");
    await input.setValue("React");

    expect(wrapper.find("#tux-doc-search-results").exists()).toBe(true);
    expect(wrapper.text()).toContain("React Integration");
    expect(wrapper.text()).not.toContain("Components Doctrine");

    const resultLink = wrapper.find("#tux-doc-search-results a");
    expect(resultLink.exists()).toBe(true);
    await resultLink.trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]).toEqual([customItems[2]]);
  });

  it("displays no results message when query does not match", async () => {
    const wrapper = await mountSuspended(TuxDocSearch, {
      props: {
        items: customItems,
      },
    });

    const input = wrapper.find<HTMLInputElement>("input[type='search']");
    await input.setValue("nonexistent-topic-xyz");

    expect(wrapper.text()).toContain("No matching documentation found");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});

// Helper component to mount TuxDocSearch
import TuxDocSearchComp from "../../app/components/TuxDocSearch.vue";
const TDocSearchWrapper = TuxDocSearchComp;
