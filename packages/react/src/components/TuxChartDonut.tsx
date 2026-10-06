/**
 * TuxChartDonut — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartDonutProps {
  slices?: string;
  size??: number;
  thickness??: number;
  sliceLabels??: boolean;
  legend??: boolean;
  centerLabel??: string;
  centerValue??: "string" | "number";
  minSlice??: number;
  format??: string;
  decimals??: number;
  ariaSummary??: string;
  units??: string;
  tooltip??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartDonut: React.FC<TuxChartDonutProps> = ({
  slices, size = 280, thickness = 0.5, sliceLabels = true, legend = false, centerLabel = "undefined", centerValue = undefined, minSlice = 3, format = "(n:", decimals = 1, ariaSummary = "undefined", units = "undefined", tooltip = true, children, className = ''
}) => {
  return (
    <figure className={`tux-chart-donut ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxChartDonut;
