/**
 * TuxReportPrintSheet — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxReportPrintSheetProps {
  size?: "letter" | "a4";
  margin?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxReportPrintSheet: React.FC<TuxReportPrintSheetProps> = ({
  size = "letter", margin = "0.6in", children, className = '', style
}) => {
  return (
    <span className={`tux-report-print-sheet ${className}`.trim()} data-size={size} style={style}>
      {children}
    </span>
  );
};

export default TuxReportPrintSheet;
