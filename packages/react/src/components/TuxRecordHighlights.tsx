/**
 * TuxRecordHighlights — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxRecordHighlightsProps {
  title: string;
  eyebrow?: string;
  icon?: string;
  items?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxRecordHighlights: React.FC<TuxRecordHighlightsProps> = ({
  title, eyebrow, icon, items, children, className = '', style
}) => {
  return (
    <div className={`tux-record-highlights ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-record-highlights__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-record-highlights__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxRecordHighlights;
