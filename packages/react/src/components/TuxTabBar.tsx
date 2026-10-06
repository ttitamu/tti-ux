/**
 * TuxTabBar — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTabBarProps {
  items?: string;
  ariaLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxTabBar: React.FC<TuxTabBarProps> = ({
  items, ariaLabel = "Primary", children, className = ''
}) => {
  return (
    <nav className={`tux-tab-bar ${className}`.trim()}>
      {children}
    </nav>
  );
};

export default TuxTabBar;
