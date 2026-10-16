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
}

export const TuxConfirmDialog: React.FC<TuxConfirmDialogProps> = ({
  open = false, title, eyebrow, confirmLabel, cancelLabel = "Cancel", variant = "destructive", confirmDisabled = false, loading = false, size = "sm", children, className = ''
}) => {
  return (
    <div className={`tux-confirm-dialog ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxConfirmDialog;
