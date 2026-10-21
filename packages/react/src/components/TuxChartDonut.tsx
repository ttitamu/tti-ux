/**
 * TuxChartDonut — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartDonutProps {
  slices: string;
  size?: number;
  palette?: "brand" | "cvd";
  patterns?: boolean;
  thickness?: number;
  sliceLabels?: boolean;
  legend?: boolean;
  centerLabel?: string;
  centerValue?: string;
  minSlice?: number;
  format?: string;
  decimals?: number;
  ariaSummary?: string;
  units?: string;
  tooltip?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartDonut: React.FC<TuxChartDonutProps> = ({
  slices, size = 280, palette = "brand", patterns = false, thickness = 0.5, sliceLabels = true, legend = false, centerLabel, centerValue, minSlice = 3, format, decimals = 1, ariaSummary, units, tooltip = true, children, className = '', style
}) => {
  return (
    <figure className={`tux-chart-donut ${className}`.trim()} data-size={size} style={style}>
      {children}
    </figure>
  );
};

export default TuxChartDonut;
