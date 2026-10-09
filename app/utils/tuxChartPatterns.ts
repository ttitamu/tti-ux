/**
 * tuxChartPatterns — Shared SVG pattern & texture hatching definitions for
 * the native chart family (TuxChartBar, TuxChartDonut, TuxChartArea, etc.).
 *
 * Provides multi-channel visual redundancy for colorblindness (CVD),
 * achromatopsia, and monochrome/grayscale printing where color fills
 * cannot be relied upon alone.
 */

export type TuxChartPatternKind =
  | "none"
  | "diag-right"
  | "diag-left"
  | "dots"
  | "crosshatch"
  | "horizontal"
  | "vertical"
  | "diamonds";

export interface TuxChartPatternDef {
  id: TuxChartPatternKind;
  label: string;
  description: string;
}

export const TUX_CHART_PATTERNS: readonly TuxChartPatternDef[] = [
  { id: "none", label: "Solid", description: "Solid uniform color fill" },
  { id: "diag-right", label: "Diagonal Right", description: "45-degree forward diagonal stripes (///)" },
  { id: "diag-left", label: "Diagonal Left", description: "135-degree counter diagonal stripes (\\\\\\)" },
  { id: "dots", label: "Stipple Dots", description: "Grid of stipple circular dots (:::)" },
  { id: "crosshatch", label: "Crosshatch", description: "Orthogonal grid crosshatch (###)" },
  { id: "horizontal", label: "Horizontal", description: "Horizontal stripes (===)" },
  { id: "vertical", label: "Vertical", description: "Vertical stripes (|||)" },
  { id: "diamonds", label: "Diamonds", description: "Diagonal diamond mesh (<><>)" },
] as const;

/**
 * Returns the canonical pattern kind for a given series/category index.
 * Index 0 defaults to 'none' (or 'diag-right' if all must have pattern).
 */
export function tuxSeriesPattern(index: number, fallbackNone = false): TuxChartPatternKind {
  if (fallbackNone && index === 0) return "none";
  const patternsWithoutNone: TuxChartPatternKind[] = [
    "diag-right",
    "diag-left",
    "dots",
    "crosshatch",
    "horizontal",
    "vertical",
    "diamonds",
  ];
  return patternsWithoutNone[index % patternsWithoutNone.length]!;
}
