/**
 * TuxStatementSheet — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxStatementSheetProps {
  statementId: string;
  title?: string;
  periodLabel: string;
  issueDate: string;
  status?: "draft" | "pending" | "settled" | "void";
  issuer: string;
  recipient: string;
  lines: string;
  adjustments?: string;
  approvals?: string;
  remittanceRef?: string;
  digest?: string;
  currencySymbol?: string;
  showPrintAction?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxStatementSheet: React.FC<TuxStatementSheetProps> = ({
  statementId, title = "Resource Chargeback Statement", periodLabel, issueDate, status = "settled", issuer, recipient, lines, adjustments, approvals, remittanceRef, digest, currencySymbol = "$", showPrintAction = true, children, className = '', style
}) => {
  return (
    <article className={`tux-statement-sheet ${className}`.trim()} data-status={status} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-statement-sheet__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </article>
  );
};

export default TuxStatementSheet;
