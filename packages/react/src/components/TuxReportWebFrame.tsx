/**
 * TuxReportWebFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxReportWebFrameProps {
  eyebrow?: string;
  title?: string;
  lede?: string;
  byline?: string;
  date?: string;
  readingTime?: string;
  toc?: string;
  width?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxReportWebFrame: React.FC<TuxReportWebFrameProps> = ({
  eyebrow, title, lede, byline, date, readingTime, toc, width = "default", children, className = '', style
}) => {
  return (
    <article className={`tux-report-web-frame ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-report-web-frame__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-report-web-frame__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </article>
  );
};

export default TuxReportWebFrame;
