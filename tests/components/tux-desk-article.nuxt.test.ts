// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxDeskArticle from "../../app/components/desk/TuxDeskArticle.vue";

describe("TuxDeskArticle Component", () => {
  it("renders article title, mixed prose, and module blocks", async () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Prose paragraph explaining the corridor deployment." }],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "important",
              title: "Institutional Requirement",
              body: "Comply with TxDOT manual section 4B.",
            },
          },
        },
      ],
    };

    const wrapper = await mountSuspended(TuxDeskArticle, {
      props: {
        title: "Smart Corridors Architecture",
        kicker: "Operations Manual",
        bodyJson: doc,
        pageId: "smart-corridors",
      },
    });

    expect(wrapper.find("[data-testid='tux-desk-article']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Smart Corridors Architecture");
    expect(wrapper.text()).toContain("Operations Manual");
    expect(wrapper.text()).toContain("Prose paragraph explaining the corridor deployment.");
    expect(wrapper.text()).toContain("Institutional Requirement");
    expect(wrapper.find("[data-testid='tux-feedback']").exists()).toBe(true);
  });
});
