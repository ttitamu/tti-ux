/**
 * TuxDataTable — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxDataTableProps {
  columns: string;
  rows?: string;
  groups?: string;
  rowKey?: string;
  tableNumber?: string;
  caption?: string;
  description?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  sticky?: boolean;
  maxHeight?: string;
  density?: "comfortable" | "compact";
  banded?: boolean;
  footnotes?: string;
  source?: string;
  totals?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxDataTable: React.FC<TuxDataTableProps> = ({
  columns, rows, groups, rowKey = "id", tableNumber = "", caption = "", description = "", sortKey, sortDir, sticky = false, maxHeight = "20rem", density = "comfortable", banded = true, footnotes, source = "", totals, children, className = '', style
}) => {
  return (
    <figure className={`tux-data-table ${className}`.trim()} style={style}>
      {description !== undefined && String(description) !== "" && <div className="tux-data-table__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(description)}</div>}
      {children}
    </figure>
  );
};

export default TuxDataTable;
