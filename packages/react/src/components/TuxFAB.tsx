/**
 * TuxFAB — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFABProps {
  icon: string;
  extended?: boolean;
  size?: "sm" | "md";
  side?: "left" | "right";
  ariaLabel?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxFAB: React.FC<TuxFABProps> = ({
  icon, extended = false, size = "md", side = "right", ariaLabel, disabled = false, children, className = '', style
}) => {
  return (
    <button className={`tux-fab ${className}`.trim()} data-size={size} style={style}>
      {children}
    </button>
  );
};

export default TuxFAB;
