/**
 * TuxChartLine — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartLineProps {
  labels?: string;
  series?: string;
  width?: number;
  height?: number;
  palette?: 'brand' | 'cvd';
  patterns?: boolean;
  distinctMarkers?: boolean;
  markerRadius?: number;
  strokeWidth?: number;
  markers?: boolean;
  endLabels?: boolean;
  legend?: boolean;
  gridlines?: boolean;
  yTicks?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartLine: React.FC<TuxChartLineProps> = ({
  labels,
  series,
  width = 640,
  height = 280,
  palette = 'brand',
  patterns = true,
  distinctMarkers = true,
  markerRadius = 3.5,
  strokeWidth = 2,
  markers = false,
  endLabels = true,
  legend = false,
  gridlines = true,
  yTicks = 5,
  children,
  className = ''
}) => {
  const cvdClass = palette === 'cvd' ? 'tux-chart--cvd' : '';
  return (
    <figure
      className={`tux-chart-line ${cvdClass} ${className}`.trim()}
      data-chart-palette={palette}
    >
      {children}
    </figure>
  );
};

export default TuxChartLine;
