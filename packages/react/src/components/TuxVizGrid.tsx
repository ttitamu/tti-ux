/**
 * TuxVizGrid — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxVizGridProps {
  cols?: string;
  eyebrow?: string;
  title?: string;
  dek?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxVizGrid: React.FC<TuxVizGridProps> = ({
  cols = "2", eyebrow, title, dek, children, className = '', style
}) => {
  return (
    <section className={`tux-viz-grid ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-viz-grid__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-viz-grid__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxVizGrid;
