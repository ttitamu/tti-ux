/**
 * TuxVizRPlot — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxVizRPlotProps {
  src: string;
  kind?: string;
  title: string;
  eyebrow?: string;
  ratio?: string;
  alt?: string;
  src2x?: string;
  source?: string;
  level?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxVizRPlot: React.FC<TuxVizRPlotProps> = ({
  src, kind = "image", title, eyebrow, ratio = "16/10", alt, src2x, source, level = 3, children, className = '', style
}) => {
  return (
    <figure className={`tux-viz-rplot ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-viz-rplot__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-viz-rplot__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </figure>
  );
};

export default TuxVizRPlot;
