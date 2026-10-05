/**
 * TuxChartBar — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartBarProps {
  labels?: string;
  series?: string;
  width??: number;
  height??: number;
  orientation??: "vertical" | "horizontal";
  variant??: "grouped" | "stacked";
  valueLabels??: boolean;
  inBarLabels??: boolean;
  gridlines??: boolean;
  legend??: boolean;
  ticks??: number;
  format??: string;
  decimals??: number;
  ariaSummary??: string;
  units??: string;
  tooltip??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartBar: React.FC<TuxChartBarProps> = ({
  labels, series, width = 640, height = 280, orientation = vertical, variant = grouped, valueLabels = true, inBarLabels = false, gridlines = true, legend = false, ticks = 5, format = "(n:", decimals = 1, ariaSummary = "undefined", units = "undefined", tooltip = true, children, className = ''
}) => {
  return (
    <figure className={`tux-chart-bar ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxChartBar;
