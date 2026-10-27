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
        { label: "TUX Desk CMS", href: "https://ux.tti.tamu.edu/desk", description: "Editorial publishing system" },
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
    expect(wrapper.text()).toContain("TUX Desk CMS");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  // The audits above run with the panel closed (display:none), which axe
  // skips. Open, the old role="menu" panel around headed <ul>s of
  // <li role="none"><a role="menuitem"> failed aria-required-children,
  // aria-required-parent and list.
  it("passes axe with the panel open (disclosure pattern, no menu roles)", async () => {
    const wrapper = await mountSuspended(TuxMegaMenu, {
      props: {
        label: "Research Areas",
        columns: sampleColumns,
        featured: { title: "Texas Triangle Freight Network", to: "/initiatives/freight" },
      },
    });

    const trigger = wrapper.find("button.tux-mega-menu__trigger");
    await trigger.trigger("click");
    const panel = wrapper.find(".tux-mega-menu__panel");
    expect(panel.isVisible()).toBe(true);

    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("aria-haspopup")).toBeUndefined();
    expect(panel.attributes("id")).toBeTruthy();
    expect(trigger.attributes("aria-controls")).toBe(panel.attributes("id"));
    expect(wrapper.findAll("[role='menu'], [role='menuitem'], [role='none']")).toHaveLength(0);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("leads each link with its icon in every column once any link has one", async () => {
    const wrapper = await mountSuspended(TuxMegaMenu, {
      props: {
        label: "Operations",
        columns: [
          {
            heading: "Scans",
            items: [
              { label: "Scan jobs", to: "/scans", description: "Queued and running", icon: "lucide:scan-line" },
              { label: "Fleet", to: "/fleet", icon: "lucide:server" },
            ],
          },
          { heading: "Help", items: [{ label: "Docs", to: "/docs" }] },
        ],
      },
    });

    const links = wrapper.findAll(".tux-mega-menu__link");
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.classes()).toContain("tux-mega-menu__link--with-icon");
      const first = link.element.firstElementChild;
      expect(first?.classList.contains("tux-mega-menu__link-icon")).toBe(true);
      expect(first?.getAttribute("aria-hidden")).toBe("true");
    }
    expect(links[2]!.find(".tux-mega-menu__link-icon").classes()).toContain("tux-mega-menu__link-icon--empty");

    await wrapper.find("button.tux-mega-menu__trigger").trigger("click");
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("keeps today's layout when no link has an icon", async () => {
    const wrapper = await mountSuspended(TuxMegaMenu, {
      props: { label: "Explore", columns: sampleColumns },
    });

    expect(wrapper.findAll(".tux-mega-menu__link-icon")).toHaveLength(0);
    for (const link of wrapper.findAll(".tux-mega-menu__link")) {
      expect(link.classes()).not.toContain("tux-mega-menu__link--with-icon");
    }
  });
});
