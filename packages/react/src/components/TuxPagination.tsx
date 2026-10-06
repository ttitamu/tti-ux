/**
 * TuxPagination — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPaginationProps {
  total?: number;
  modelValue?: number;
  pageSize??: number;
  siblingCount??: number;
  boundaryCount??: number;
  showStatus??: boolean;
  noun??: string;
  pluralNoun??: string;
  ariaLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxPagination: React.FC<TuxPaginationProps> = ({
  total, modelValue, pageSize = 20, siblingCount = 1, boundaryCount = 1, showStatus = false, noun = "result", pluralNoun = "undefined", ariaLabel = "Pagination", children, className = ''
}) => {
  return (
    <nav className={`tux-pagination ${className}`.trim()}>
      {children}
    </nav>
  );
};

export default TuxPagination;
