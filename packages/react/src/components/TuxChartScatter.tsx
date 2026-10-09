/**
 * TuxChartScatter — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartScatterProps {
  series?: string;
  xLabel?: string;
  yLabel?: string;
  width?: number;
  height?: number;
  palette?: 'brand' | 'cvd';
  distinctMarkers?: boolean;
  trendline?: boolean;
  legend?: boolean;
  gridlines?: boolean;
  xTicks?: number;
  yTicks?: number;
  format?: string;
  decimals?: number;
  ariaSummary?: string;
  units?: string;
  tooltip?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartScatter: React.FC<TuxChartScatterProps> = ({
  series,
  xLabel = 'x',
  yLabel = 'y',
  width = 640,
  height = 320,
  palette = 'brand',
  distinctMarkers = true,
  trendline = false,
  legend = true,
  gridlines = true,
  xTicks = 6,
  yTicks = 5,
  format = '(n:',
  decimals = 2,
  ariaSummary,
  units,
  tooltip = true,
  children,
  className = ''
}) => {
  const cvdClass = palette === 'cvd' ? 'tux-chart--cvd' : '';
  return (
    <figure
      className={`tux-chart-scatter ${cvdClass} ${className}`.trim()}
      data-chart-palette={palette}
    >
      {children}
    </figure>
  );
};

export default TuxChartScatter;
