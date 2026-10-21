/**
 * TuxInfoLabel — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxInfoLabelProps {
  for?: string;
  required?: boolean;
  trigger?: "hover" | "click";
  infoAriaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxInfoLabel: React.FC<TuxInfoLabelProps> = ({
  required = false, trigger = "hover", infoAriaLabel = "More information", children, className = '', style
}) => {
  return (
    <label className={`tux-info-label ${className}`.trim()} style={style}>
      {children}
    </label>
  );
};

export default TuxInfoLabel;
