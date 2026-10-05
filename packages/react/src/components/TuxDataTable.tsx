/**
 * TuxDataTable — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxDataTableProps {
  columns?: string;
  rows??: string;
  groups??: string;
  rowKey??: string;
  tableNumber??: string;
  caption??: string;
  description??: string;
  sortKey??: string;
  sortDir??: "asc" | "desc";
  sticky??: boolean;
  maxHeight??: string;
  density??: "comfortable" | "compact";
  banded??: boolean;
  footnotes??: string;
  source??: string;
  totals??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxDataTable: React.FC<TuxDataTableProps> = ({
  columns, rows = "()", groups = "()", rowKey = "id", tableNumber, caption, description, sortKey = "undefined", sortDir = undefined, sticky = false, maxHeight = "20rem", density = comfortable, banded = true, footnotes = "()", source, totals = "undefined", children, className = ''
}) => {
  return (
    <figure className={`tux-data-table ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxDataTable;
