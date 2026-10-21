/**
 * TuxCTA — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCTAProps {
  eyebrow?: string;
  title: string;
  dek?: string;
  tone?: "maroon" | "gold" | "neutral";
  variant?: "default" | "bold" | "elegant";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCTA: React.FC<TuxCTAProps> = ({
  eyebrow, title, dek, tone = "maroon", variant = "default", children, className = '', style
}) => {
  return (
    <section className={`tux-cta ${className}`.trim()} data-variant={variant} data-tone={tone} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-cta__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-cta__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxCTA;
