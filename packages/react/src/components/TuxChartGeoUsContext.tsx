/**
 * TuxChartGeoUsContext — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGeoUsContextProps {
  states?: string;
  highlight?: string;
  legendLabel?: string;
  legendStops?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartGeoUsContext: React.FC<TuxChartGeoUsContextProps> = ({
  states, highlight, legendLabel, legendStops, children, className = ''
}) => {
  return (
    <svg className={`tux-chart-geo-us-context ${className}`.trim()}>
      {children}
    </svg>
  );
};

export default TuxChartGeoUsContext;
