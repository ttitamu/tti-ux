/**
 * TuxPivotMatrix — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPivotMatrixProps {
  caption: string;
  rowLabels: string;
  colLabels: string;
  values: string;
  rowHeaderLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  decimals?: number;
  shaded?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxPivotMatrix: React.FC<TuxPivotMatrixProps> = ({
  caption, rowLabels, colLabels, values, rowHeaderLabel = "Category", valuePrefix = "", valueSuffix = "", decimals = 0, shaded = true, children, className = '', style
}) => {
  return (
    <div className={`tux-pivot-matrix ${className}`.trim()} style={style}>
      {caption !== undefined && String(caption) !== "" && <div className="tux-pivot-matrix__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(caption)}</div>}
      {children}
    </div>
  );
};

export default TuxPivotMatrix;
