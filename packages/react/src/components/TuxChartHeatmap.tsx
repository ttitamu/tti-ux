/**
 * TuxChartHeatmap — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartHeatmapProps {
  rows: string;
  cols: string;
  values: string;
  width?: number;
  height?: number;
  ramp?: "maroon" | "slate";
  bins?: number;
  valueLabels?: boolean;
  legend?: boolean;
  colLabelEvery?: number;
  format?: string;
  decimals?: number;
  ariaSummary?: string;
  units?: string;
  tooltip?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartHeatmap: React.FC<TuxChartHeatmapProps> = ({
  rows, cols, values, width = 640, height = 280, ramp = "maroon", bins = 5, valueLabels = false, legend = true, colLabelEvery = 0, format, decimals = 1, ariaSummary, units, tooltip = true, children, className = '', style
}) => {
  return (
    <figure className={`tux-chart-heatmap ${className}`.trim()} style={style}>
      {children}
    </figure>
  );
};

export default TuxChartHeatmap;
