/**
 * TuxChartHeatmap — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartHeatmapProps {
  rows?: string;
  cols?: string;
  values?: "Array<Array<number" | "null>>";
  width??: number;
  height??: number;
  ramp??: "maroon" | "slate";
  bins??: "3" | "4" | "5";
  valueLabels??: boolean;
  legend??: boolean;
  colLabelEvery??: number;
  format??: string;
  decimals??: number;
  ariaSummary??: string;
  units??: string;
  tooltip??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartHeatmap: React.FC<TuxChartHeatmapProps> = ({
  rows, cols, values, width = 640, height = 280, ramp = maroon, bins = 5, valueLabels = false, legend = true, colLabelEvery = 0, format = "(n:", decimals = 1, ariaSummary = "undefined", units = "undefined", tooltip = true, children, className = ''
}) => {
  return (
    <figure className={`tux-chart-heatmap ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxChartHeatmap;
