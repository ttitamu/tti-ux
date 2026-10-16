/**
 * TuxAlphaNav — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxAlphaNavProps {
  letters?: string;
  available?: string;
  mode?: "anchor" | "emit";
  sticky?: boolean;
  showAll?: boolean;
  modelValue?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxAlphaNav: React.FC<TuxAlphaNavProps> = ({
  letters, available, mode = "anchor", sticky = false, showAll = false, modelValue, ariaLabel, children, className = ''
}) => {
  return (
    <nav className={`tux-alpha-nav ${className}`.trim()}>
      {children}
    </nav>
  );
};

export default TuxAlphaNav;
