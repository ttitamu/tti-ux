/**
 * useTuxVisionPrefs — Composable for managing institutional Vision &
 * Accessibility Preferences (CVD mode, live CVD simulation, stroke
 * dash patterns, distinct markers, astigmatism anti-halation, and heavy keylines).
 *
 * Persisted in localStorage ("tux-vision-prefs") and automatically synchronized
 * to document.documentElement attributes and SVG simulation filters.
 */
import { onMounted, watch } from "vue";
import { useTuxPersistedRef } from "./useTuxPersistedRef";

export interface TuxVisionPreferences {
  /** Color Vision Deficiency categorical mode */
  cvdMode: "brand" | "okabe-ito" | "deutan-protan" | "tritan" | "monochrome";
  /** Live SVG Color Vision Simulation filter (for review / testing / presentations) */
  cvdSimulation: "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";
  /** Enforce distinct line dash patterns across all charts */
  patterns: boolean;
  /** Enforce distinct geometric data point markers (circle, square, triangle, etc.) */
  distinctMarkers: boolean;
  /** Direct end-of-line value annotations */
  directLabels: boolean;
  /** Anti-halation soft dark theme for astigmatism & photophobia */
  softDark: boolean;
  /** Heavy keylines & stroke widths (+1px) for low-vision clarity */
  heavyStrokes: boolean;
}

export const DEFAULT_VISION_PREFERENCES: TuxVisionPreferences = {
  cvdMode: "brand",
  cvdSimulation: "none",
  patterns: true,
  distinctMarkers: true,
  directLabels: true,
  softDark: false,
  heavyStrokes: false,
};

export function applyVisionPreferences(prefs: TuxVisionPreferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // 1. CVD Mode
  root.setAttribute("data-cvd-mode", prefs.cvdMode);

  // 2. CVD Simulation
  if (prefs.cvdSimulation && prefs.cvdSimulation !== "none") {
    root.setAttribute("data-cvd-simulation", prefs.cvdSimulation);
  } else {
    root.removeAttribute("data-cvd-simulation");
  }

  // 3. Multi-channel options
  root.setAttribute("data-cvd-patterns", String(prefs.patterns));
  root.setAttribute("data-cvd-markers", String(prefs.distinctMarkers));
  root.setAttribute("data-cvd-labels", String(prefs.directLabels));

  // 4. Astigmatism Soft Dark
  if (prefs.softDark) {
    root.setAttribute("data-theme-variant", "soft");
    root.setAttribute("data-vision-comfort", "anti-halation");
  } else {
    if (root.getAttribute("data-theme-variant") === "soft") {
      root.removeAttribute("data-theme-variant");
    }
    if (root.getAttribute("data-vision-comfort") === "anti-halation") {
      root.removeAttribute("data-vision-comfort");
    }
  }

  // 5. Heavy strokes
  if (prefs.heavyStrokes) {
    root.setAttribute("data-vision-stroke", "heavy");
  } else {
    root.removeAttribute("data-vision-stroke");
  }
}

export function useTuxVisionPrefs() {
  const prefs = useTuxPersistedRef<TuxVisionPreferences>(
    () => "tux-vision-prefs",
    DEFAULT_VISION_PREFERENCES,
  );

  function reset() {
    prefs.value = { ...DEFAULT_VISION_PREFERENCES };
    applyVisionPreferences(prefs.value);
  }

  watch(
    prefs,
    (newVal) => {
      applyVisionPreferences(newVal);
    },
    { deep: true },
  );

  onMounted(() => {
    applyVisionPreferences(prefs.value);
  });

  return {
    prefs,
    reset,
    apply: () => applyVisionPreferences(prefs.value),
  };
}
