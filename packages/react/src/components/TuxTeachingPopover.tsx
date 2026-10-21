/**
 * TuxTeachingPopover — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTeachingPopoverProps {
  modelValue?: boolean;
  step?: number;
  totalSteps?: number;
  title?: string;
  onBrand?: boolean;
  noDismiss?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  noSecondary?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxTeachingPopover: React.FC<TuxTeachingPopoverProps> = ({
  modelValue = false, step = 1, totalSteps = 1, title, onBrand = false, noDismiss = false, primaryLabel, secondaryLabel = "Skip", noSecondary = false, children, className = '', style
}) => {
  return (
    <div className={`tux-teaching-popover ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-teaching-popover__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxTeachingPopover;
