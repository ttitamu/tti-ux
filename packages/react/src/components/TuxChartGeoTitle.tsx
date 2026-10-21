/**
 * TuxChartGeoTitle — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGeoTitleProps {
  title: string;
  x: number;
  y: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartGeoTitle: React.FC<TuxChartGeoTitleProps> = ({
  title, x, y, children, className = '', style
}) => {
  return (
    <div className={`tux-chart-geo-title ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-chart-geo-title__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxChartGeoTitle;
