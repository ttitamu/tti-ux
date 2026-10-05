/**
 * TuxRemovableChip — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxRemovableChipProps {
  icon??: string;
  removable??: boolean;
  size??: "sm" | "md" | "lg";
  selected??: boolean;
  disabled??: boolean;
  removeLabel??: string;
  clickToRemove??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxRemovableChip: React.FC<TuxRemovableChipProps> = ({
  icon = "undefined", removable = false, size = md, selected = false, disabled = false, removeLabel = "undefined", clickToRemove = false, children, className = ''
}) => {
  return (
    <span className={`tux-removable-chip ${className}`.trim()}>
      {children}
    </span>
  );
};

export default TuxRemovableChip;
