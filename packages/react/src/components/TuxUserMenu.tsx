/**
 * TuxUserMenu — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxUserMenuProps {
  state: "loading" | "signed-out" | "signed-in" | "local-only" | "error";
  identity?: string;
  signInHref?: string;
  signInLabel?: string;
  items?: string;
  prefs?: string;
  showSignOut?: boolean;
  placement?: "cluster" | "rail-footer";
  statusLine?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxUserMenu: React.FC<TuxUserMenuProps> = ({
  state, identity, signInHref, signInLabel = "Sign in", items, prefs, showSignOut = true, placement = "cluster", statusLine, children, className = '', style
}) => {
  return (
    <div className={`tux-user-menu ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxUserMenu;
