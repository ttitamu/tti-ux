import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMegaMenu from "~/components/TuxMegaMenu.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMegaMenu Component", () => {
  const sampleColumns = [
    {
      heading: "Programs",
      items: [
        { label: "Connected Corridors", to: "/programs/connected", description: "Statewide CAV pilot" },
        { label: "Safety Analytics", to: "/programs/safety", description: "Vision Zero predictive crash models" },
      ],
    },
    {
      heading: "Platforms",
      items: [
        { label: "Landscape CMS", href: "https://landscape.tti.tamu.edu", description: "Editorial publishing system" },
        { label: "TTI AI Studio", to: "/studio", description: "Generative telemetry and RAG pipelines" },
      ],
    },
  ];

  it("renders trigger and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMegaMenu, {
      props: {
        label: "Research Areas",
        columns: sampleColumns,
        featured: {
          eyebrow: "Featured Initiative",
          title: "Texas Triangle Freight Network",
          description: "Evaluating autonomous truck corridors along I-35 and I-45.",
          to: "/initiatives/freight",
        },
      },
    });

    expect(wrapper.text()).toContain("Research Areas");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders columns and featured panel when open", async () => {
    const wrapper = await mountSuspended(TuxMegaMenu, {
      props: {
        label: "Explore",
        columns: sampleColumns,
        to: "/explore",
      },
    });

    expect(wrapper.text()).toContain("Explore");
    expect(wrapper.text()).toContain("Programs");
    expect(wrapper.text()).toContain("Connected Corridors");
    expect(wrapper.text()).toContain("Platforms");
    expect(wrapper.text()).toContain("Landscape CMS");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
