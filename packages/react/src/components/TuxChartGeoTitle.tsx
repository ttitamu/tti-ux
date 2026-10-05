/**
 * TuxChartGeoTitle — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGeoTitleProps {
  title?: string;
  x?: number;
  y?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartGeoTitle: React.FC<TuxChartGeoTitleProps> = ({
  title, x, y, children, className = ''
}) => {
  return (
    <text className={`tux-chart-geo-title ${className}`.trim()}>
      {children}
    </text>
  );
};

export default TuxChartGeoTitle;
