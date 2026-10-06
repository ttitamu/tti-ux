/**
 * TuxInfoLabel — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxInfoLabelProps {
  for??: string;
  required??: boolean;
  trigger??: "hover" | "click";
  infoAriaLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxInfoLabel: React.FC<TuxInfoLabelProps> = ({
  for = "undefined", required = false, trigger = hover, infoAriaLabel = "More", children, className = ''
}) => {
  return (
    <label className={`tux-info-label ${className}`.trim()}>
      {children}
    </label>
  );
};

export default TuxInfoLabel;
