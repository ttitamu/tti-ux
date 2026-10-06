import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDeskOutline from "../../app/components/desk/TuxDeskOutline.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskOutline Component", () => {
  const sampleDoc = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Introduction to Corridor Operations" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Detailed narrative text." }],
      },
      {
        type: "deskModule",
        attrs: {
          kind: "callout",
          payload: { title: "Advisory" },
        },
      },
    ],
  };

  it("renders outline navigation tree and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDeskOutline, {
      props: {
        doc: sampleDoc,
        selectedIndex: 0,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Outline Navigator");
    expect(wrapper.text()).toContain("3 blocks");
    expect(wrapper.text()).toContain("Heading 2");
    expect(wrapper.text()).toContain("Introduction to Corridor Operations");
    expect(wrapper.text()).toContain("Paragraph");
    expect(wrapper.text()).toContain("Callout Alert");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits select event when a block row is clicked", async () => {
    const wrapper = await mountSuspended(TuxDeskOutline, {
      props: {
        doc: sampleDoc,
      },
    });

    const items = wrapper.findAll(".cursor-pointer");
    expect(items.length).toBe(3);

    await items[1].trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]).toEqual([1]);
  });

  it("emits move-up, move-down, duplicate, and delete events", async () => {
    const wrapper = await mountSuspended(TuxDeskOutline, {
      props: {
        doc: sampleDoc,
        selectedIndex: 1,
      },
    });

    const moveUpBtns = wrapper.findAll("button[title='Move block up']");
    expect(moveUpBtns.length).toBeGreaterThan(1);
    await moveUpBtns[1].trigger("click");
    expect(wrapper.emitted("move-up")?.[0]).toEqual([1]);

    const moveDownBtns = wrapper.findAll("button[title='Move block down']");
    await moveDownBtns[1].trigger("click");
    expect(wrapper.emitted("move-down")?.[0]).toEqual([1]);

    const dupBtns = wrapper.findAll("button[title='Duplicate block']");
    await dupBtns[1].trigger("click");
    expect(wrapper.emitted("duplicate")?.[0]).toEqual([1]);

    const delBtns = wrapper.findAll("button[title='Delete block']");
    await delBtns[1].trigger("click");
    expect(wrapper.emitted("delete")?.[0]).toEqual([1]);

    const closeBtn = wrapper.find("button[title='Close Navigator']");
    await closeBtn.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
