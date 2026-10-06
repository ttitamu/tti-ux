/**
 * TuxChartLine — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartLineProps {
  labels?: string;
  series?: string;
  width??: number;
  height??: number;
  markers??: boolean;
  endLabels??: boolean;
  legend??: boolean;
  gridlines??: boolean;
  yTicks??: number;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartLine: React.FC<TuxChartLineProps> = ({
  labels, series, width = 640, height = 280, markers = false, endLabels = true, legend = false, gridlines = true, yTicks = 5, children, className = ''
}) => {
  return (
    <figure className={`tux-chart-line ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxChartLine;
