/**
 * useTuxVisionPrefs — Composable for managing institutional Vision &
 * Accessibility Preferences (CVD mode, live CVD simulation, stroke
 * dash patterns, distinct markers, astigmatism anti-halation, and heavy keylines).
 *
 * Persisted in localStorage ("tux-vision-prefs") and automatically synchronized
 * to document.documentElement attributes, dynamic CSS custom properties, and SVG simulation filters.
 */
import { onMounted, watch, type Ref } from "vue";
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
  /** RELLIS Field-Sunlight high-glare outdoor mode (21:1 ink, 2px borders, 48px glove targets) */
  fieldSunlight?: boolean;
  /** Heavy keylines & stroke widths (+1px) for low-vision clarity */
  heavyStrokes: boolean;
  /** Institutional typography profile (Editorial Oswald/Open Sans, Kadence WordPress parity, or TMC Ops-Dense) */
  typeProfile?: "editorial" | "kadence-comm" | "ops-dense";
}

export const DEFAULT_VISION_PREFERENCES: TuxVisionPreferences = {
  cvdMode: "brand",
  cvdSimulation: "none",
  patterns: true,
  distinctMarkers: true,
  directLabels: true,
  softDark: false,
  fieldSunlight: false,
  heavyStrokes: false,
  typeProfile: "editorial",
};

/** Categorical Color Vision Deficiency palette ramps (Light mode) */
export const CVD_PALETTES: Record<TuxVisionPreferences["cvdMode"], string[]> = {
  brand: [
    "#500000", "#3F5A6F", "#C7973C", "#6B8E5A",
    "#8C5A3C", "#5C7080", "#A33A3A", "#3C5A87",
  ],
  "okabe-ito": [
    "#0072B2", "#E69F00", "#009E73", "#F0E442",
    "#56B4E9", "#D55E00", "#CC79A7", "#222222",
  ],
  "deutan-protan": [
    "#0072B2", "#E69F00", "#56B4E9", "#D55E00",
    "#F0E442", "#009E73", "#CC79A7", "#111111",
  ],
  tritan: [
    "#CC79A7", "#009E73", "#D55E00", "#500000",
    "#0072B2", "#3F5A6F", "#8C5A3C", "#111111",
  ],
  monochrome: [
    "#111111", "#444444", "#777777", "#999999",
    "#bbbbbb", "#dddddd", "#555555", "#000000",
  ],
};

/** Categorical Color Vision Deficiency palette ramps (Dark & Soft-Dark mode) */
export const CVD_PALETTES_DARK: Record<TuxVisionPreferences["cvdMode"], string[]> = {
  brand: [
    "#c47585", "#6B8DA3", "#E0BC60", "#93B57E",
    "#B58463", "#8AA0B2", "#D67272", "#6E8FBE",
  ],
  "okabe-ito": [
    "#56B4E9", "#F0B030", "#2AC098", "#F5EB68",
    "#7CD0F7", "#E87A28", "#DE91BD", "#E6E6E6",
  ],
  "deutan-protan": [
    "#56B4E9", "#F0B030", "#7CD0F7", "#E87A28",
    "#F5EB68", "#2AC098", "#DE91BD", "#F0F6FC",
  ],
  tritan: [
    "#DE91BD", "#2AC098", "#E87A28", "#C47585",
    "#56B4E9", "#6B8DA3", "#B58463", "#F0F6FC",
  ],
  monochrome: [
    "#F0F6FC", "#D0D7DE", "#AFB8C1", "#8C959F",
    "#6E7781", "#57606A", "#424A53", "#FFFFFF",
  ],
};

export function applyVisionPreferences(prefs: TuxVisionPreferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const targets: HTMLElement[] = [root];
  const portalShell = document.querySelector<HTMLElement>(".portal-shell");
  if (portalShell) targets.push(portalShell);

  // 1. CVD Mode & Dynamic custom properties site-wide
  for (const el of targets) {
    el.setAttribute("data-cvd-mode", prefs.cvdMode);
  }

  const isDark =
    root.classList.contains("dark") ||
    root.getAttribute("data-theme") === "tti-dark" ||
    prefs.softDark;

  const palette = isDark ? CVD_PALETTES_DARK[prefs.cvdMode] : CVD_PALETTES[prefs.cvdMode];
  if (palette) {
    for (const el of targets) {
      palette.forEach((hex, i) => {
        const idx = i + 1;
        el.style.setProperty(`--chart-${idx}`, hex);
        el.style.setProperty(`--tux-chart-tone--c${idx}`, hex);
        if (prefs.cvdMode === "brand") {
          const okabeHex = isDark ? CVD_PALETTES_DARK["okabe-ito"][i]! : CVD_PALETTES["okabe-ito"][i]!;
          el.style.setProperty(`--chart-cvd-${idx}`, okabeHex);
        } else {
          el.style.setProperty(`--chart-cvd-${idx}`, hex);
        }
      });
    }
  }

  // 2. CVD Simulation
  for (const el of targets) {
    if (prefs.cvdSimulation && prefs.cvdSimulation !== "none") {
      el.setAttribute("data-cvd-simulation", prefs.cvdSimulation);
    } else {
      el.removeAttribute("data-cvd-simulation");
    }

    // 3. Multi-channel options
    el.setAttribute("data-cvd-patterns", String(prefs.patterns));
    el.setAttribute("data-cvd-markers", String(prefs.distinctMarkers));
    el.setAttribute("data-cvd-labels", String(prefs.directLabels));
  }

  // 4. Astigmatism Soft Dark vs. RELLIS Field-Sunlight Mode
  if (prefs.softDark) {
    for (const el of targets) {
      el.setAttribute("data-theme-variant", "soft");
      el.setAttribute("data-vision-comfort", "anti-halation");
      el.classList.add("dark", "tti-dark");
      el.classList.remove("tti", "tti-hc");
      el.setAttribute("data-theme", "tti-dark");
    }
    try {
      window.localStorage.setItem("nuxt-color-mode", "tti-dark");
    } catch {
      // Ignore storage access error
    }
  } else if (prefs.fieldSunlight) {
    for (const el of targets) {
      el.setAttribute("data-theme-variant", "field-sunlight");
      el.setAttribute("data-vision-comfort", "field-sunlight");
      el.classList.remove("dark", "tti-dark", "tti-hc");
      el.classList.add("tti");
      el.setAttribute("data-theme", "tti");
    }
    try {
      window.localStorage.setItem("nuxt-color-mode", "tti");
    } catch {
      // Ignore storage access error
    }
  } else {
    for (const el of targets) {
      const variant = el.getAttribute("data-theme-variant");
      if (variant === "soft" || variant === "field-sunlight") {
        el.removeAttribute("data-theme-variant");
      }
      const comfort = el.getAttribute("data-vision-comfort");
      if (comfort === "anti-halation" || comfort === "field-sunlight") {
        el.removeAttribute("data-vision-comfort");
      }
    }
  }

  // 5. Heavy strokes (enabled explicitly or via field-sunlight)
  for (const el of targets) {
    if (prefs.heavyStrokes || prefs.fieldSunlight) {
      el.setAttribute("data-vision-stroke", "heavy");
    } else {
      el.removeAttribute("data-vision-stroke");
    }

    // 6. Institutional Typography Profile
    const typeProfile = prefs.typeProfile ?? "editorial";
    el.setAttribute("data-type-profile", typeProfile);
  }
}

// Module-level singleton state for instant reactivity across all component instances
let sharedPrefs: Ref<TuxVisionPreferences> | null = null;

export function useTuxVisionPrefs() {
  if (!sharedPrefs) {
    sharedPrefs = useTuxPersistedRef<TuxVisionPreferences>(
      () => "tux-vision-prefs",
      DEFAULT_VISION_PREFERENCES,
    );

    watch(
      sharedPrefs,
      (newVal) => {
        applyVisionPreferences(newVal);
      },
      { deep: true },
    );
  }

  onMounted(() => {
    if (sharedPrefs) {
      applyVisionPreferences(sharedPrefs.value);
    }
  });

  return {
    prefs: sharedPrefs,
    reset: () => {
      if (sharedPrefs) {
        sharedPrefs.value = { ...DEFAULT_VISION_PREFERENCES };
        applyVisionPreferences(sharedPrefs.value);
      }
    },
    apply: () => {
      if (sharedPrefs) {
        applyVisionPreferences(sharedPrefs.value);
      }
    },
  };
}
