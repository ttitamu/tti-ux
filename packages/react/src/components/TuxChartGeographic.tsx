/**
 * TuxChartGeographic — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGeographicProps {
  kind: string;
  palette?: string;
  title?: string;
  legendLabel?: string;
  legendStops?: string;
  showLegend?: boolean;
  counties?: string;
  districts?: string;
  states?: string;
  highlight?: string;
  dots?: number;
  dotLegend?: string;
  flows?: string;
  flowLegend?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartGeographic: React.FC<TuxChartGeographicProps> = ({
  kind, palette = "maroon", title = "", legendLabel = "Value", legendStops, showLegend = true, counties, districts, states, highlight = "TX", dots = 600, dotLegend = "1 dot = 100 incidents", flows, flowLegend = "Daily trips (thousands)", children, className = '', style
}) => {
  return (
    <div className={`tux-chart-geographic ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-chart-geographic__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxChartGeographic;
