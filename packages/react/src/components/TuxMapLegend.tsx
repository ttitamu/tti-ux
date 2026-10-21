/**
 * TuxMapLegend — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMapLegendProps {
  title?: string;
  eyebrow?: string;
  entries?: string;
  layout?: "stacked" | "inline" | "gradient";
  gradient?: string;
  minLabel: string;
  maxLabel: string;
  css?: string;
  stops?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxMapLegend: React.FC<TuxMapLegendProps> = ({
  title, eyebrow, entries, layout = "stacked", gradient, minLabel, maxLabel, css, stops, children, className = '', style
}) => {
  return (
    <div className={`tux-map-legend ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-map-legend__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-map-legend__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxMapLegend;
