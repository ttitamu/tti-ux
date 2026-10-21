/**
 * TuxRichDataGrid — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxRichDataGridProps {
  columns: string;
  rows: string;
  rowKey?: string;
  title?: string;
  meta?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showColumns?: boolean;
  showExport?: boolean;
  filters?: string;
  selected?: string;
  selectionDisabled?: boolean;
  bulkActions?: string;
  expanded?: string;
  expansionDisabled?: boolean;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  maxHeight?: string;
  virtualized?: boolean;
  virtualRowHeight?: number;
  density?: "comfortable" | "compact";
  paginationLabel?: string;
  paginationTokens?: string;
  projectNumber?: string;
  doi?: string;
  citation?: string;
  showUnitToggle?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxRichDataGrid: React.FC<TuxRichDataGridProps> = ({
  columns, rows, rowKey = "id", title, meta, searchPlaceholder = "Search…", showSearch = true, showFilter = true, showColumns = true, showExport = true, filters, selected, selectionDisabled = false, bulkActions, expanded, expansionDisabled = false, sortKey, sortDir, maxHeight = "440px", virtualized = false, virtualRowHeight = 44, density = "comfortable", paginationLabel = "", paginationTokens, projectNumber, doi, citation, showUnitToggle = false, children, className = '', style
}) => {
  return (
    <div className={`tux-rich-data-grid ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-rich-data-grid__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxRichDataGrid;
