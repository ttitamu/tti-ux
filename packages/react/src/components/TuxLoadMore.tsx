/**
 * TuxLoadMore — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxLoadMoreProps {
  loaded?: number;
  total?: number;
  loading??: boolean;
  noun??: string;
  nounPlural??: string;
  label??: string;
  terminalLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxLoadMore: React.FC<TuxLoadMoreProps> = ({
  loaded, total, loading = false, noun = "undefined", nounPlural = "undefined", label = "Load", terminalLabel = "All", children, className = ''
}) => {
  return (
    <div className={`tux-load-more ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxLoadMore;
