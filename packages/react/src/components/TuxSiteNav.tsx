/**
 * TuxSiteNav — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSiteNavProps {
  identity: string;
  primaryNav?: string;
  utilityNav?: string;
  search?: boolean;
  sticky?: boolean;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSiteNav: React.FC<TuxSiteNavProps> = ({
  identity, primaryNav, utilityNav, search = false, sticky = false, ariaLabel = "Primary navigation", children, className = '', style
}) => {
  return (
    <header className={`tux-site-nav ${className}`.trim()} style={style}>
      {children}
    </header>
  );
};

export default TuxSiteNav;
