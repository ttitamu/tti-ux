/**
 * TuxVisionPreferencesModal — Comprehensive accessibility settings modal
 * offering color vision deficiency (CVD) modes, real-time SVG filter simulation,
 * multi-channel chart redundancy controls, and anti-halation astigmatism comfort.
 *
 * React port of app/components/TuxVisionPreferencesModal.vue.
 */
import React, { useEffect, useState, type ReactElement } from "react";

export type TuxCvdMode = "brand" | "okabe-ito" | "deutan-protan" | "tritan" | "monochrome";
export type TuxCvdSimulation = "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";

export interface TuxVisionPreferences {
  cvdMode: TuxCvdMode;
  cvdSimulation: TuxCvdSimulation;
  patterns: boolean;
  distinctMarkers: boolean;
  directLabels: boolean;
  softDark: boolean;
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

export interface TuxVisionPreferencesModalProps {
  /** Controls whether the preferences dialog is open. */
  open?: boolean;
  /** Callback fired when the modal requests to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Optional controlled vision preferences state. */
  preferences?: TuxVisionPreferences;
  /** Callback fired whenever any vision preference is updated. */
  onPreferencesChange?: (preferences: TuxVisionPreferences) => void;
  /** Optional className applied to the modal container. */
  className?: string;
}

const CVD_MODES: ReadonlyArray<{
  id: TuxCvdMode;
  label: string;
  badge?: string;
  description: string;
  swatches: readonly string[];
}> = [
  {
    id: "okabe-ito",
    label: "Universal CVD (Okabe-Ito)",
    badge: "Recommended",
    description:
      "Deep Blue (#0072B2) and Warm Orange (#E69F00) binary polarity. 100% immune to Protan, Deutan, and Tritan confusion lines.",
    swatches: ["#0072B2", "#E69F00", "#009E73", "#F0E442", "#56B4E9", "#D55E00", "#CC79A7", "#222222"],
  },
  {
    id: "brand",
    label: "TTI Institutional Standard",
    description: "Classic Aggie Maroon and Slate telemetry palette.",
    swatches: ["#500000", "#3F5A6F", "#C7973C", "#6B8E5A", "#8C5A3C", "#5C7080", "#A33A3A", "#3C5A87"],
  },
  {
    id: "deutan-protan",
    label: "Deutan / Protan Optimized",
    badge: "Red-Green Safe",
    description:
      "Replaces conflicting red/green frequencies with sky blue, vermilion, and high-contrast amber.",
    swatches: ["#0072B2", "#E69F00", "#56B4E9", "#D55E00", "#F0E442", "#009E73", "#CC79A7", "#111111"],
  },
  {
    id: "tritan",
    label: "Tritanopia Safe",
    badge: "Blue-Yellow Safe",
    description: "High-contrast magenta, deep teal, and graphite steps avoiding blue-yellow confusion.",
    swatches: ["#CC79A7", "#009E73", "#D55E00", "#500000", "#0072B2", "#3F5A6F", "#8C5A3C", "#111111"],
  },
  {
    id: "monochrome",
    label: "Achromatopsia & High-Luminance Mono",
    badge: "Monochrome Safe",
    description: "Evenly spaced grayscale steps requiring distinct stroke patterns and geometric markers.",
    swatches: ["#111111", "#444444", "#777777", "#999999", "#bbbbbb", "#dddddd", "#555555", "#000000"],
  },
];

const SIMULATIONS: ReadonlyArray<{ value: TuxCvdSimulation; label: string }> = [
  { value: "none", label: "Normal Vision (Simulation Disabled)" },
  { value: "deuteranopia", label: "Simulate Deuteranopia (Green-Blind, 6% of males)" },
  { value: "protanopia", label: "Simulate Protanopia (Red-Blind, 2% of males)" },
  { value: "tritanopia", label: "Simulate Tritanopia (Blue-Blind, <1% of population)" },
  { value: "achromatopsia", label: "Simulate Achromatopsia (Complete Colorblindness)" },
];

export function TuxVisionPreferencesModal({
  open = false,
  onOpenChange,
  preferences: controlledPrefs,
  onPreferencesChange,
  className = "",
}: TuxVisionPreferencesModalProps): ReactElement | null {
  const [internalPrefs, setInternalPrefs] = useState<TuxVisionPreferences>(DEFAULT_VISION_PREFERENCES);
  const prefs = controlledPrefs ?? internalPrefs;

  function updatePrefs(patch: Partial<TuxVisionPreferences>) {
    const next = { ...prefs, ...patch };
    if (!controlledPrefs) {
      setInternalPrefs(next);
    }
    onPreferencesChange?.(next);
  }

  function handleReset() {
    const next = { ...DEFAULT_VISION_PREFERENCES };
    if (!controlledPrefs) {
      setInternalPrefs(next);
    }
    onPreferencesChange?.(next);
  }

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange?.(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tux-vision-prefs-title"
      className={["tux-vision-preferences-modal", className].filter(Boolean).join(" ")}
    >
      <div className="tux-vision-preferences-modal__header">
        <p className="tux-vision-preferences-modal__eyebrow">
          Clinical Accessibility &amp; Display Comfort
        </p>
        <h2 id="tux-vision-prefs-title" className="tux-vision-preferences-modal__title">
          Vision &amp; Accessibility Preferences
        </h2>
      </div>

      <div className="space-y-6 text-text-primary">
        {/* Section 1: Color Vision Deficiency Mode */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-text-secondary">
              1. Categorical Color Vision Palette
            </h3>
            <span className="text-xs text-text-muted">Affects charts, heatmaps &amp; telemetry</span>
          </div>

          <div className="space-y-2">
            {CVD_MODES.map((mode) => (
              <label
                key={mode.id}
                className={[
                  "flex flex-col p-3 border rounded cursor-pointer transition-colors",
                  prefs.cvdMode === mode.id
                    ? "border-brand-primary bg-surface-sunken ring-1 ring-brand-primary"
                    : "border-surface-border bg-surface-raised hover:bg-surface-sunken",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tux-cvd-mode"
                      value={mode.id}
                      checked={prefs.cvdMode === mode.id}
                      onChange={() => updatePrefs({ cvdMode: mode.id })}
                      className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="font-semibold text-sm">{mode.label}</span>
                    {mode.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
                        {mode.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {mode.swatches.slice(0, 5).map((swatch, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-text-muted pl-6">{mode.description}</p>
              </label>
            ))}
          </div>
        </section>

        {/* Section 2: Live Vision Simulation Filter */}
        <section className="space-y-2 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <label
              htmlFor="tux-cvd-sim-select"
              className="font-bold text-sm uppercase tracking-wider text-text-secondary"
            >
              2. Live Colorblindness Simulation Filter
            </label>
            <span className="text-xs text-brand-primary font-medium">Design &amp; Audit Tool</span>
          </div>
          <p className="text-xs text-text-muted">
            Simulates retinal cone deficiency across the entire viewport using clinical SVG color matrices.
          </p>
          <select
            id="tux-cvd-sim-select"
            value={prefs.cvdSimulation}
            onChange={(e) => updatePrefs({ cvdSimulation: e.target.value as TuxCvdSimulation })}
            className="w-full min-h-[44px] px-3 py-2 bg-surface-raised border border-surface-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {SIMULATIONS.map((sim) => (
              <option key={sim.value} value={sim.value}>
                {sim.label}
              </option>
            ))}
          </select>
        </section>

        {/* Section 3: Multi-Channel Redundancy */}
        <section className="space-y-3 pt-2 border-t border-surface-border">
          <h3 className="font-bold text-sm uppercase tracking-wider text-text-secondary">
            3. Multi-Channel Redundancy (Non-Color Encodings)
          </h3>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
              <input
                type="checkbox"
                checked={prefs.patterns}
                onChange={(e) => updatePrefs({ patterns: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
              />
              <div>
                <span className="text-sm font-semibold block">Distinct Line Dash Patterns</span>
                <span className="text-xs text-text-muted">
                  Cycles solid, dashed, and dotted stroke styles across series so lines are distinguishable in grayscale and monochrome printouts.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
              <input
                type="checkbox"
                checked={prefs.distinctMarkers}
                onChange={(e) => updatePrefs({ distinctMarkers: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
              />
              <div>
                <span className="text-sm font-semibold block">Geometric Point Markers</span>
                <span className="text-xs text-text-muted">
                  Renders distinct geometric shapes (circles ●, squares ■, triangles ▲, diamonds ◆) on data points for triple-redundant identification.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
              <input
                type="checkbox"
                checked={prefs.directLabels}
                onChange={(e) => updatePrefs({ directLabels: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
              />
              <div>
                <span className="text-sm font-semibold block">Direct Value Labels</span>
                <span className="text-xs text-text-muted">
                  Annotates end-of-series data values directly on curves to eliminate back-and-forth legend eye tracking.
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* Section 4: Astigmatism & Low-Vision Comfort */}
        <section className="space-y-3 pt-2 border-t border-surface-border">
          <h3 className="font-bold text-sm uppercase tracking-wider text-text-secondary">
            4. Astigmatism &amp; Low-Vision Comfort
          </h3>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
              <input
                type="checkbox"
                checked={prefs.softDark}
                onChange={(e) => updatePrefs({ softDark: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
              />
              <div>
                <span className="text-sm font-semibold block">Anti-Halation Soft Dark Mode</span>
                <span className="text-xs text-text-muted">
                  Replaces pitch-black wells with deep slate-charcoal (#161A22) and softens pure white text to eliminate optical haloing and diffraction in astigmatic eyes.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
              <input
                type="checkbox"
                checked={prefs.heavyStrokes}
                onChange={(e) => updatePrefs({ heavyStrokes: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
              />
              <div>
                <span className="text-sm font-semibold block">Enhanced Stroke Widths (+1px)</span>
                <span className="text-xs text-text-muted">
                  Bumps chart lines to 3px/3.5px and scales markers for improved visibility and edge discrimination.
                </span>
              </div>
            </label>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between w-full mt-6">
        <button
          type="button"
          className="min-h-[44px] px-3 py-1.5 text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
          onClick={handleReset}
        >
          Reset Defaults
        </button>
        <button
          type="button"
          className="min-h-[44px] px-4 py-2 bg-brand-primary text-text-on-brand font-semibold text-sm rounded shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-primary inline-flex items-center gap-1.5"
          onClick={() => onOpenChange?.(false)}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default TuxVisionPreferencesModal;
