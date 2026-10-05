/**
 * TuxChartGauge — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGaugeProps {
  value?: number;
  min??: number;
  max??: number;
  size??: number;
  variant??: "arc" | "progress";
  bands??: string;
  centerLabel??: string;
  centerValue??: "string" | "number";
  units??: string;
  format??: string;
  decimals??: number;
  ariaSummary??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartGauge: React.FC<TuxChartGaugeProps> = ({
  value, min = 0, max = 100, size = 240, variant = arc, bands = "()", centerLabel = "undefined", centerValue = undefined, units = "undefined", format = "(n:", decimals = 1, ariaSummary = "undefined", children, className = ''
}) => {
  return (
    <figure className={`tux-chart-gauge ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxChartGauge;
