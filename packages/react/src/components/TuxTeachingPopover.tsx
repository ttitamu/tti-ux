/**
 * TuxTeachingPopover — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTeachingPopoverProps {
  modelValue??: boolean;
  step??: number;
  totalSteps??: number;
  title??: string;
  onBrand??: boolean;
  noDismiss??: boolean;
  primaryLabel??: string;
  secondaryLabel??: string;
  noSecondary??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxTeachingPopover: React.FC<TuxTeachingPopoverProps> = ({
  modelValue = false, step = 1, totalSteps = 1, title = "undefined", onBrand = false, noDismiss = false, primaryLabel = "undefined", secondaryLabel = "Skip", noSecondary = false, children, className = ''
}) => {
  return (
    <Teleport className={`tux-teaching-popover ${className}`.trim()}>
      {children}
    </Teleport>
  );
};

export default TuxTeachingPopover;
