/**
 * TuxChartGeoFlow — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGeoFlowProps {
  flows: string;
  flowLegend: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartGeoFlow: React.FC<TuxChartGeoFlowProps> = ({
  flows, flowLegend, children, className = '', style
}) => {
  return (
    <svg className={`tux-chart-geo-flow ${className}`.trim()} style={style}>
      {children}
    </svg>
  );
};

export default TuxChartGeoFlow;
