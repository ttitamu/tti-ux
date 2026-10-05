/**
 * TuxFAB — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFABProps {
  icon?: string;
  extended??: boolean;
  size??: "sm" | "md";
  side??: "left" | "right";
  ariaLabel??: string;
  disabled??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxFAB: React.FC<TuxFABProps> = ({
  icon, extended = false, size = md, side = right, ariaLabel = "undefined", disabled = false, children, className = ''
}) => {
  return (
    <button className={`tux-fab ${className}`.trim()}>
      {children}
    </button>
  );
};

export default TuxFAB;
