/**
 * TuxReportPrintSheet — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxReportPrintSheetProps {
  size??: "letter" | "a4";
  margin??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxReportPrintSheet: React.FC<TuxReportPrintSheetProps> = ({
  size = letter, margin = "0.6in", children, className = ''
}) => {
  return (
    <span className={`tux-report-print-sheet ${className}`.trim()}>
      {children}
    </span>
  );
};

export default TuxReportPrintSheet;
