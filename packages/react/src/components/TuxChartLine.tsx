/**
 * TuxChartLine — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartLineProps {
  labels: string;
  series: string;
  width?: number;
  height?: number;
  markers?: boolean;
  distinctMarkers?: boolean;
  markerRadius?: number;
  palette?: "brand" | "cvd";
  strokeWidth?: number;
  patterns?: boolean;
  endLabels?: boolean;
  legend?: boolean;
  gridlines?: boolean;
  yTicks?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartLine: React.FC<TuxChartLineProps> = ({
  labels, series, width = 640, height = 280, markers = false, distinctMarkers = true, markerRadius = 3.5, palette = "brand", strokeWidth = 2, patterns = false, endLabels = true, legend = false, gridlines = true, yTicks = 5, children, className = '', style
}) => {
  return (
    <figure className={`tux-chart-line ${className}`.trim()} style={style}>
      {children}
    </figure>
  );
};

export default TuxChartLine;
