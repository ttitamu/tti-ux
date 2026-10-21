/**
 * TuxCitations — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCitationsProps {
  items: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCitations: React.FC<TuxCitationsProps> = ({
  items, label = "sources", children, className = '', style
}) => {
  return (
    <section className={`tux-citations ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-citations__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </section>
  );
};

export default TuxCitations;
