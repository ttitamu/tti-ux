/**
 * TuxRemovableChip — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxRemovableChipProps {
  icon?: string;
  removable?: boolean;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  disabled?: boolean;
  removeLabel?: string;
  clickToRemove?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxRemovableChip: React.FC<TuxRemovableChipProps> = ({
  icon, removable = false, size = "md", selected = false, disabled = false, removeLabel, clickToRemove = false, children, className = '', style
}) => {
  return (
    <span className={`tux-removable-chip ${className}`.trim()} data-size={size} style={style}>
      {children}
    </span>
  );
};

export default TuxRemovableChip;
