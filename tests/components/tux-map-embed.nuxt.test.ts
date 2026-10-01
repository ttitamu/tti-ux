import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMapEmbed from "~/components/TuxMapEmbed.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMapEmbed Component", () => {
  it("renders map embed with iframe, title, eyebrow, subtitle, source citation, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMapEmbed, {
      props: {
        src: "https://maps.example.com/embed?corridor=i35",
        eyebrow: "Interactive GIS Exhibit",
        title: "I-35 Central Corridor Sensor Density",
        subtitle: "Spatial distribution of radar detection nodes and connected vehicle roadside units.",
        source: "Source: TxDOT GIS Open Data Portal (2026)",
        iframeTitle: "I-35 Corridor Map",
      },
    });

    expect(wrapper.find(".tux-map-embed").exists()).toBe(true);
    expect(wrapper.find("iframe.tux-map-embed__iframe").exists()).toBe(true);
    expect(wrapper.find("iframe").attributes("title")).toBe("I-35 Corridor Map");
    expect(wrapper.text()).toContain("Interactive GIS Exhibit");
    expect(wrapper.text()).toContain("I-35 Central Corridor Sensor Density");
    expect(wrapper.text()).toContain("Source: TxDOT GIS Open Data Portal (2026)");
    expect(wrapper.find("figcaption.tux-map-embed__caption").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom map slots, aspect ratios, legend and control slots", async () => {
    const wrapper = await mountSuspended(TuxMapEmbed, {
      props: {
        title: "District 14 Maintenance Zones",
        aspect: "4/3",
        skeleton: false,
      },
      slots: {
        default: () => "<div id=\"leaflet-container\">Leaflet Interactive Canvas</div>",
        legend: () => "<div class=\"map-legend-overlay\"><p>Legend: High Priority</p></div>",
        controls: () => "<div class=\"map-controls-overlay\"><button type=\"button\">Reset</button></div>",
        source: () => "<p class=\"custom-source\">TxDOT Enterprise GIS</p>",
      },
    });

    expect(wrapper.text()).toContain("Leaflet Interactive Canvas");
    expect(wrapper.text()).toContain("Legend: High Priority");
    expect(wrapper.text()).toContain("Reset");
    expect(wrapper.text()).toContain("TxDOT Enterprise GIS");
    expect(wrapper.find(".tux-map-embed__surface").attributes("style")).toContain("aspect-ratio: 4/3");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
