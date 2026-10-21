/**
 * TuxConfirmDialog — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxConfirmDialogProps {
  open?: boolean;
  title: string;
  eyebrow?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary" | "warning";
  confirmDisabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxConfirmDialog: React.FC<TuxConfirmDialogProps> = ({
  open = false, title, eyebrow, confirmLabel, cancelLabel = "Cancel", variant = "destructive", confirmDisabled = false, loading = false, size = "sm", children, className = '', style
}) => {
  return (
    <div className={`tux-confirm-dialog ${className}`.trim()} data-variant={variant} data-size={size} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-confirm-dialog__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-confirm-dialog__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxConfirmDialog;
