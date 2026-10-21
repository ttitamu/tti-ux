/**
 * TuxCardSlab — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCardSlabProps {
  cards: string;
  columns?: number;
  aspect?: "3/4" | "1/1" | "4/5";
  heading?: string;
  eyebrow?: string;
  inset?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCardSlab: React.FC<TuxCardSlabProps> = ({
  cards, columns = 3, aspect = "4/5", heading, eyebrow, inset = false, children, className = '', style
}) => {
  return (
    <section className={`tux-card-slab ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-card-slab__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {heading !== undefined && String(heading) !== "" && <div className="tux-card-slab__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(heading)}</div>}
      {children}
    </section>
  );
};

export default TuxCardSlab;
