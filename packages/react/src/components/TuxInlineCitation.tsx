/**
 * TuxInlineCitation — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxInlineCitationProps {
  n: number;
  title: string;
  href?: string;
  excerpt?: string;
  score?: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxInlineCitation: React.FC<TuxInlineCitationProps> = ({
  n, title, href, excerpt, score, label, children, className = '', style
}) => {
  return (
    <div className={`tux-inline-citation ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-inline-citation__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxInlineCitation;
