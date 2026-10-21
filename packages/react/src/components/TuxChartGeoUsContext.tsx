/**
 * TuxChartGeoUsContext — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGeoUsContextProps {
  states: string;
  highlight: string;
  legendLabel: string;
  legendStops: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartGeoUsContext: React.FC<TuxChartGeoUsContextProps> = ({
  states, highlight, legendLabel, legendStops, children, className = '', style
}) => {
  return (
    <svg className={`tux-chart-geo-us-context ${className}`.trim()} style={style}>
      {children}
    </svg>
  );
};

export default TuxChartGeoUsContext;
