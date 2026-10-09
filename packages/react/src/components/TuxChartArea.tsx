/**
 * TuxChartArea — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartAreaProps {
  labels?: string;
  series?: string;
  width?: number;
  height?: number;
  palette?: 'brand' | 'cvd';
  patterns?: boolean;
  variant?: "overlay" | "stacked";
  markers?: boolean;
  endLabels?: boolean;
  legend?: boolean;
  gridlines?: boolean;
  ticks?: number;
  format?: string;
  decimals?: number;
  ariaSummary?: string;
  units?: string;
  tooltip?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartArea: React.FC<TuxChartAreaProps> = ({
  labels,
  series,
  width = 640,
  height = 280,
  palette = 'brand',
  patterns = true,
  variant = 'overlay',
  markers = false,
  endLabels = true,
  legend = false,
  gridlines = true,
  ticks = 5,
  format = '(n:',
  decimals = 1,
  ariaSummary,
  units,
  tooltip = true,
  children,
  className = ''
}) => {
  const cvdClass = palette === 'cvd' ? 'tux-chart--cvd' : '';
  return (
    <figure
      className={`tux-chart-area ${cvdClass} ${className}`.trim()}
      data-chart-palette={palette}
    >
      {children}
    </figure>
  );
};

export default TuxChartArea;
