/**
 * TuxDocsSidebar — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxDocsSidebarProps {
  tree: string;
  title?: string;
  search?: boolean;
  searchPlaceholder?: string;
  storageKey?: string;
  exclusiveTopLevel?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxDocsSidebar: React.FC<TuxDocsSidebarProps> = ({
  tree, title = "Docs", search = true, searchPlaceholder, storageKey = "tux-docs-sidebar", exclusiveTopLevel = false, children, className = ''
}) => {
  return (
    <nav className={`tux-docs-sidebar ${className}`.trim()}>
      {children}
    </nav>
  );
};

export default TuxDocsSidebar;
