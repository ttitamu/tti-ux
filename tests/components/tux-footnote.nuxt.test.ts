import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxFootnote from "../../app/components/TuxFootnote.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFootnote Component", () => {
  it("renders superscript footnote reference with link attributes", async () => {
    const wrapper = await mountSuspended(TuxFootnote, {
      props: {
        n: 3,
        text: "TxDOT baseline traffic analysis from 2024 Q3.",
        idPrefix: "test-fn",
      },
    });

    const link = wrapper.find("a.tux-footnote");
    expect(link.exists()).toBe(true);
    expect(link.attributes("id")).toBe("test-fn-ref-3");
    expect(link.attributes("href")).toBe("#test-fn-3");
    expect(link.attributes("aria-label")).toContain("Footnote 3: TxDOT baseline traffic analysis");
    expect(link.find("sup").text()).toBe("3");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("uses default idPrefix when omitted", async () => {
    const wrapper = await mountSuspended(TuxFootnote, {
      props: {
        n: 1,
        text: "Sample footnote annotation.",
      },
    });

    const link = wrapper.find("a.tux-footnote");
    expect(link.attributes("id")).toBe("fn-ref-1");
    expect(link.attributes("href")).toBe("#fn-1");
  });
});
