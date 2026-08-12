/**
 * tuxChartGeo — shared logic for the TuxChartGeographic per-kind child
 * components (TuxChartGeoCounty / Districts / UsContext / DotDensity /
 * Flow). Lives in utils (not the parent SFC) so each async child chunk
 * pulls only these few hundred bytes plus its OWN geo data module —
 * the whole point of the per-kind split is that a consumer rendering
 * `kind="districts"` never downloads county or US-state geometry.
 */

export type TuxGeoPalette = "maroon" | "slate";

/** Five-step sequential ramp, themed via the map tokens. */
export function tuxGeoRamp(palette: TuxGeoPalette): string[] {
  if (palette === "slate") {
    return [
      "var(--map-seq-slate-1)",
      "var(--map-seq-slate-2)",
      "var(--map-seq-slate-3)",
      "var(--map-seq-slate-4)",
      "var(--map-seq-slate-5)",
    ];
  }
  return [
    "var(--map-seq-maroon-1)",
    "var(--map-seq-maroon-2)",
    "var(--map-seq-maroon-3)",
    "var(--map-seq-maroon-4)",
    "var(--map-seq-maroon-5)",
  ];
}

/** Quantize a 0..1 value onto the 5-step ramp. */
export function tuxGeoBucket(v: number): number {
  return Math.min(4, Math.max(0, Math.floor(v * 5)));
}

/**
 * Deterministic 0..1 demo value derived from a string identifier so the
 * showcase renders without consumer-passed data (djb2 hash, SSR-stable).
 */
export function tuxGeoDemoValue(seed: string | number): number {
  const s = String(seed);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

/** Visual props every kind child shares; defaults resolve in the parent. */
export interface TuxGeoSharedProps {
  palette: TuxGeoPalette;
  title: string;
  showLegend: boolean;
}
