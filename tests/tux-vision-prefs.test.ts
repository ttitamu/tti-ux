// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  applyVisionPreferences,
  CVD_PALETTES,
  CVD_PALETTES_DARK,
  DEFAULT_VISION_PREFERENCES,
  type TuxVisionPreferences,
} from "../app/composables/useTuxVisionPrefs";

describe("useTuxVisionPrefs — Institutional Vision & Accessibility Engine", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-cvd-mode");
    document.documentElement.removeAttribute("data-cvd-simulation");
    document.documentElement.removeAttribute("data-cvd-patterns");
    document.documentElement.removeAttribute("data-cvd-markers");
    document.documentElement.removeAttribute("data-cvd-labels");
    document.documentElement.removeAttribute("data-theme-variant");
    document.documentElement.removeAttribute("data-vision-comfort");
    document.documentElement.removeAttribute("data-vision-stroke");
    document.documentElement.removeAttribute("data-theme");
  });

  describe("1. Categorical Color Vision Palettes", () => {
    it("dynamically sets CSS custom properties --chart-1..8 for Okabe-Ito universal palette", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdMode: "okabe-ito",
      });

      const root = document.documentElement;
      expect(root.getAttribute("data-cvd-mode")).toBe("okabe-ito");
      expect(root.style.getPropertyValue("--chart-1")).toBe(CVD_PALETTES["okabe-ito"][0]);
      expect(root.style.getPropertyValue("--chart-2")).toBe(CVD_PALETTES["okabe-ito"][1]);
      expect(root.style.getPropertyValue("--chart-8")).toBe(CVD_PALETTES["okabe-ito"][7]);
      expect(root.style.getPropertyValue("--tux-chart-tone--c1")).toBe(CVD_PALETTES["okabe-ito"][0]);
      expect(root.style.getPropertyValue("--chart-cvd-1")).toBe(CVD_PALETTES["okabe-ito"][0]);
    });

    it("dynamically rebinds --chart-1..8 for Deutan / Protan Safe mode", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdMode: "deutan-protan",
      });

      const root = document.documentElement;
      expect(root.getAttribute("data-cvd-mode")).toBe("deutan-protan");
      expect(root.style.getPropertyValue("--chart-1")).toBe(CVD_PALETTES["deutan-protan"][0]);
      expect(root.style.getPropertyValue("--chart-3")).toBe(CVD_PALETTES["deutan-protan"][2]);
      expect(root.style.getPropertyValue("--tux-chart-tone--c1")).toBe(CVD_PALETTES["deutan-protan"][0]);
    });

    it("dynamically rebinds --chart-1..8 for Tritanopia Safe mode", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdMode: "tritan",
      });

      const root = document.documentElement;
      expect(root.getAttribute("data-cvd-mode")).toBe("tritan");
      expect(root.style.getPropertyValue("--chart-1")).toBe(CVD_PALETTES.tritan[0]);
      expect(root.style.getPropertyValue("--chart-4")).toBe(CVD_PALETTES.tritan[3]);
      expect(root.style.getPropertyValue("--tux-chart-tone--c1")).toBe(CVD_PALETTES.tritan[0]);
    });

    it("dynamically rebinds --chart-1..8 for Monochrome & Achromatopsia mode", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdMode: "monochrome",
      });

      const root = document.documentElement;
      expect(root.getAttribute("data-cvd-mode")).toBe("monochrome");
      expect(root.style.getPropertyValue("--chart-1")).toBe(CVD_PALETTES.monochrome[0]);
      expect(root.style.getPropertyValue("--chart-8")).toBe(CVD_PALETTES.monochrome[7]);
      expect(root.style.getPropertyValue("--tux-chart-tone--c1")).toBe(CVD_PALETTES.monochrome[0]);
    });

    it("uses dark-calibrated palette when dark mode is active", () => {
      document.documentElement.classList.add("dark");
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdMode: "okabe-ito",
      });

      const root = document.documentElement;
      expect(root.style.getPropertyValue("--chart-1")).toBe(CVD_PALETTES_DARK["okabe-ito"][0]);
      expect(root.style.getPropertyValue("--chart-8")).toBe(CVD_PALETTES_DARK["okabe-ito"][7]);
    });
  });

  describe("2. Multi-Channel Redundancy", () => {
    it("sets data-cvd-patterns, data-cvd-markers, and data-cvd-labels", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        patterns: true,
        distinctMarkers: true,
        directLabels: true,
      });

      const root = document.documentElement;
      expect(root.getAttribute("data-cvd-patterns")).toBe("true");
      expect(root.getAttribute("data-cvd-markers")).toBe("true");
      expect(root.getAttribute("data-cvd-labels")).toBe("true");

      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        patterns: false,
        distinctMarkers: false,
        directLabels: false,
      });

      expect(root.getAttribute("data-cvd-patterns")).toBe("false");
      expect(root.getAttribute("data-cvd-markers")).toBe("false");
      expect(root.getAttribute("data-cvd-labels")).toBe("false");
    });
  });

  describe("3. Anti-Halation Soft Dark Mode (Astigmatism Comfort)", () => {
    it("enables dark class, tti-dark data-theme, and soft variant", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        softDark: true,
      });

      const root = document.documentElement;
      expect(root.classList.contains("dark")).toBe(true);
      expect(root.getAttribute("data-theme")).toBe("tti-dark");
      expect(root.getAttribute("data-theme-variant")).toBe("soft");
      expect(root.getAttribute("data-vision-comfort")).toBe("anti-halation");
    });

    it("cleans up anti-halation attributes when toggled off", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        softDark: true,
      });

      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        softDark: false,
      });

      const root = document.documentElement;
      expect(root.getAttribute("data-vision-comfort")).toBeNull();
      expect(root.getAttribute("data-theme-variant")).toBeNull();
    });
  });

  describe("4. Enhanced Stroke Widths", () => {
    it("sets data-vision-stroke attribute when heavy strokes are enabled", () => {
      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        heavyStrokes: true,
      });

      const root = document.documentElement;
      expect(root.getAttribute("data-vision-stroke")).toBe("heavy");

      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        heavyStrokes: false,
      });

      expect(root.getAttribute("data-vision-stroke")).toBeNull();
    });
  });

  describe("5. Live CVD Simulation Filters", () => {
    it("sets data-cvd-simulation attribute for deuteranopia, protanopia, etc.", () => {
      const root = document.documentElement;

      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdSimulation: "deuteranopia",
      });
      expect(root.getAttribute("data-cvd-simulation")).toBe("deuteranopia");

      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdSimulation: "protanopia",
      });
      expect(root.getAttribute("data-cvd-simulation")).toBe("protanopia");

      applyVisionPreferences({
        ...DEFAULT_VISION_PREFERENCES,
        cvdSimulation: "none",
      });
      expect(root.getAttribute("data-cvd-simulation")).toBeNull();
    });
  });
});
