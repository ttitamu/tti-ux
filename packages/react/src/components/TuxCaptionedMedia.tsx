/**
 * TuxCaptionedMedia — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCaptionedMediaProps {
  src?: string;
  alt?: string;
  caption?: string;
  credit?: string;
  eyebrow?: string;
  aspect?: "16/9" | "4/3" | "1/1" | "3/4";
  align?: "full" | "wide" | "right";
  tone?: "maroon" | "gold" | "charcoal";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCaptionedMedia: React.FC<TuxCaptionedMediaProps> = ({
  src, alt, caption, credit, eyebrow, aspect = "16/9", align = "full", tone = "maroon", children, className = '', style
}) => {
  return (
    <figure className={`tux-captioned-media ${className}`.trim()} data-tone={tone} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-captioned-media__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {caption !== undefined && String(caption) !== "" && <div className="tux-captioned-media__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(caption)}</div>}
      {children}
    </figure>
  );
};

export default TuxCaptionedMedia;
