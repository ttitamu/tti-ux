/**
 * TuxVizEmbed — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxVizEmbedProps {
  src: string;
  provider?: string;
  title: string;
  eyebrow?: string;
  ratio?: string;
  sandbox?: string;
  referrerpolicy?: string;
  openInNew?: boolean;
  posterSrc?: string;
  posterAlt?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxVizEmbed: React.FC<TuxVizEmbedProps> = ({
  src, provider = "generic", title, eyebrow, ratio = "16/9", sandbox, referrerpolicy = "strict-origin-when-cross-origin", openInNew = true, posterSrc, posterAlt, children, className = '', style
}) => {
  return (
    <figure className={`tux-viz-embed ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-viz-embed__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-viz-embed__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </figure>
  );
};

export default TuxVizEmbed;
