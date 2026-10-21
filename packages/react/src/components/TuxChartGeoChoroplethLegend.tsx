/**
 * TuxChartGeoChoroplethLegend — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGeoChoroplethLegendProps {
  ramp: string;
  label: string;
  stops: string;
  x: number;
  y: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartGeoChoroplethLegend: React.FC<TuxChartGeoChoroplethLegendProps> = ({
  ramp, label, stops, x, y, children, className = '', style
}) => {
  return (
    <g className={`tux-chart-geo-choropleth-legend ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-chart-geo-choropleth-legend__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </g>
  );
};

export default TuxChartGeoChoroplethLegend;
