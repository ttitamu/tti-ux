/**
 * TuxResultCount — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxResultCountProps {
  page?: number;
  pageSize?: number;
  total?: number;
  noun??: string;
  nounPlural??: string;
  pageSizeOptions??: string;
  hideRange??: boolean;
  pageSizeLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxResultCount: React.FC<TuxResultCountProps> = ({
  page, pageSize, total, noun = "undefined", nounPlural = "undefined", pageSizeOptions = "undefined", hideRange = false, pageSizeLabel = "per", children, className = ''
}) => {
  return (
    <div className={`tux-result-count ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxResultCount;
