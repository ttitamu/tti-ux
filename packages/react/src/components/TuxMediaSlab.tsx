/**
 * TuxMediaSlab — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMediaSlabProps {
  src?: string;
  alt?: string;
  eyebrow?: string;
  title: string;
  dek?: string;
  layout?: "overlay" | "split";
  imageSide?: "left" | "right";
  height?: "tall" | "standard" | "short";
  tone?: "maroon" | "gold" | "charcoal";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxMediaSlab: React.FC<TuxMediaSlabProps> = ({
  src, alt = "", eyebrow, title, dek, layout = "overlay", imageSide = "right", height = "standard", tone = "maroon", children, className = '', style
}) => {
  return (
    <section className={`tux-media-slab ${className}`.trim()} data-tone={tone} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-media-slab__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-media-slab__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxMediaSlab;
