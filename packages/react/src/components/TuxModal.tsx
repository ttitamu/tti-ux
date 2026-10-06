/**
 * TuxModal — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxModalProps {
  open??: boolean;
  title??: string;
  eyebrow??: string;
  size??: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  variant??: "standard" | "sheet" | "auto";
  children?: React.ReactNode;
  className?: string;
}

export const TuxModal: React.FC<TuxModalProps> = ({
  open = false, title = "undefined", eyebrow = "undefined", size = undefined, variant = standard, children, className = ''
}) => {
  return (
    <UModal className={`tux-modal ${className}`.trim()}>
      {children}
    </UModal>
  );
};

export default TuxModal;
