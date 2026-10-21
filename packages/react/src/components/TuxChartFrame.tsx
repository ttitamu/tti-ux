/**
 * TuxChartFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartFrameProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  source?: string;
  notes?: string;
  bare?: boolean;
  labels?: string;
  series?: string;
  sonify?: boolean;
  showDataTable?: boolean;
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
  doi?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartFrame: React.FC<TuxChartFrameProps> = ({
  eyebrow, title, subtitle, source, notes, bare = false, labels, series, sonify = true, showDataTable = true, division, doi, children, className = '', style
}) => {
  return (
    <figure className={`tux-chart-frame ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-chart-frame__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-chart-frame__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-chart-frame__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </figure>
  );
};

export default TuxChartFrame;
