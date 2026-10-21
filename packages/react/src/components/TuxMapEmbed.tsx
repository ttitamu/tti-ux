/**
 * TuxMapEmbed — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMapEmbedProps {
  src?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  source?: string;
  aspect?: "16/9" | "4/3" | "21/9" | "1/1" | "auto";
  height?: number;
  iframeTitle?: string;
  attribution?: boolean;
  skeleton?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxMapEmbed: React.FC<TuxMapEmbedProps> = ({
  src, eyebrow, title, subtitle, source, aspect = "16/9", height, iframeTitle, attribution = true, skeleton = true, children, className = '', style
}) => {
  return (
    <figure className={`tux-map-embed ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-map-embed__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-map-embed__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-map-embed__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </figure>
  );
};

export default TuxMapEmbed;
