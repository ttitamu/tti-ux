/**
 * TuxChartDonut — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartDonutProps {
  slices?: string;
  size?: number;
  palette?: 'brand' | 'cvd';
  patterns?: boolean;
  thickness?: number;
  sliceLabels?: boolean;
  legend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  minSlice?: number;
  format?: string;
  decimals?: number;
  ariaSummary?: string;
  units?: string;
  tooltip?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartDonut: React.FC<TuxChartDonutProps> = ({
  slices,
  size = 280,
  palette = 'brand',
  patterns = true,
  thickness = 0.5,
  sliceLabels = true,
  legend = false,
  centerLabel,
  centerValue,
  minSlice = 3,
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
      className={`tux-chart-donut ${cvdClass} ${className}`.trim()}
      data-chart-palette={palette}
    >
      {children}
    </figure>
  );
};

export default TuxChartDonut;
