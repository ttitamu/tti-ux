import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxConversationList from "~/components/TuxConversationList.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxConversationList Component", () => {
  const sampleGroups = [
    {
      group: "Today",
      items: [
        { id: "conv-1", title: "Austin Urban Mobility Study", meta: "2h ago" },
        { id: "conv-2", title: "Corridor Freight Modeling", meta: "4h ago" },
      ],
    },
    {
      group: "Yesterday",
      items: [
        { id: "conv-3", title: "Connected Automated Vehicle Fleet Assessment", meta: "Yesterday" },
      ],
    },
  ];

  it("renders conversation groups and items with accessibility compliance", async () => {
    const wrapper = await mountSuspended(TuxConversationList, {
      props: {
        groups: sampleGroups,
        activeId: "conv-1",
      },
    });

    expect(wrapper.text()).toContain("Today");
    expect(wrapper.text()).toContain("Austin Urban Mobility Study");
    expect(wrapper.text()).toContain("Yesterday");
    expect(wrapper.text()).toContain("Connected Automated Vehicle Fleet Assessment");

    const activeItem = wrapper.find(".tux-conversation-list__item--active");
    expect(activeItem.exists()).toBe(true);
    expect(activeItem.attributes("aria-current")).toBe("page");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits select event when an item is clicked", async () => {
    const wrapper = await mountSuspended(TuxConversationList, {
      props: {
        groups: sampleGroups,
      },
    });

    const links = wrapper.findAll(".tux-conversation-list__item");
    expect(links.length).toBe(3);

    await links[1]!.trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")![0]).toEqual(["conv-2"]);
  });

  it("renders item-actions slot when provided", async () => {
    const wrapper = await mountSuspended(TuxConversationList, {
      props: {
        groups: sampleGroups,
      },
      slots: {
        "item-actions": ({ item }: { item: { id: string } }) => `<button type="button" aria-label="Delete ${item.id}">Delete</button>`,
      },
    });

    expect(wrapper.find(".tux-conversation-list__actions").exists()).toBe(true);
    expect(wrapper.text()).toContain("Delete");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
