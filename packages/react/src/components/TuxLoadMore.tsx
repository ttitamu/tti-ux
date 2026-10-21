/**
 * TuxLoadMore — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxLoadMoreProps {
  loaded: number;
  total: number;
  loading?: boolean;
  noun?: string;
  nounPlural?: string;
  label?: string;
  terminalLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxLoadMore: React.FC<TuxLoadMoreProps> = ({
  loaded, total, loading = false, noun, nounPlural, label, terminalLabel, children, className = '', style
}) => {
  return (
    <div className={`tux-load-more ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-load-more__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxLoadMore;
