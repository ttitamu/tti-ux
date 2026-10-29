/**
 * TuxLedgerTable — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxLedgerTableProps {
  caption: string;
  groups: string;
  valuePrefix?: string;
  valueSuffix?: string;
  decimals?: number;
  showQuantityRate?: boolean;
  exportable?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxLedgerTable: React.FC<TuxLedgerTableProps> = ({
  caption, groups, valuePrefix = "", valueSuffix = "", decimals = 2, showQuantityRate = true, exportable = true, children, className = '', style
}) => {
  return (
    <div className={`tux-ledger-table ${className}`.trim()} style={style}>
      {caption !== undefined && String(caption) !== "" && <div className="tux-ledger-table__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(caption)}</div>}
      {children}
    </div>
  );
};

export default TuxLedgerTable;
