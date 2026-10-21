/**
 * TuxReportFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxReportFrameProps {
  size?: string;
  density?: string;
  breakAfter?: boolean;
  title?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxReportFrame: React.FC<TuxReportFrameProps> = ({
  size = "letter", density = "editorial", breakAfter = false, title, eyebrow, children, className = '', style
}) => {
  return (
    <article className={`tux-report-frame ${className}`.trim()} data-size={size} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-report-frame__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-report-frame__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </article>
  );
};

export default TuxReportFrame;
