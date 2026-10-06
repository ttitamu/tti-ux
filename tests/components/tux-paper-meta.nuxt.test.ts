import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxPaperMeta from "../../app/components/TuxPaperMeta.vue";

describe("TuxPaperMeta Component", () => {
  it("renders publication metadata definition list and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxPaperMeta, {
      props: {
        type: "Peer-Reviewed Journal Article",
        venue: "Transportation Research Record",
        published: "2026-04-15",
        doi: "10.1177/0361198126123456",
        license: "CC-BY-4.0",
        funders: ["Federal Highway Administration", "TxDOT"],
      },
    });

    expect(wrapper.find("dl.tux-paper-meta").exists()).toBe(true);
    expect(wrapper.text()).toContain("Peer-Reviewed Journal Article");
    expect(wrapper.text()).toContain("Transportation Research Record");
    expect(wrapper.text()).toContain("2026-04-15");
    expect(wrapper.text()).toContain("CC-BY-4.0");
    expect(wrapper.text()).toContain("Federal Highway Administration");
    expect(wrapper.text()).toContain("TxDOT");

    const doiLink = wrapper.find("a[href='https://doi.org/10.1177/0361198126123456']");
    expect(doiLink.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders publication time tag with datetime attribute", async () => {
    const wrapper = await mountSuspended(TuxPaperMeta, {
      props: {
        published: "2026-09-01",
      },
    });

    const timeTag = wrapper.find("time");
    expect(timeTag.exists()).toBe(true);
    expect(timeTag.attributes("datetime")).toBe("2026-09-01");
  });
});
