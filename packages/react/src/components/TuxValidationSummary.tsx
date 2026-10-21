/**
 * TuxValidationSummary — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxValidationSummaryProps {
  errors: string;
  title?: string;
  variant?: "error" | "warning";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxValidationSummary: React.FC<TuxValidationSummaryProps> = ({
  errors, title = "Please fix the following before submitting:", variant = "error", children, className = '', style
}) => {
  return (
    <div className={`tux-validation-summary ${className}`.trim()} data-variant={variant} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-validation-summary__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxValidationSummary;
