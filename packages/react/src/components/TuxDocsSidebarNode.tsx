/**
 * TuxDocsSidebarNode — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxDocsSidebarNodeProps {
  section: string;
  path: string;
  query: string;
  openMap: string;
  isOpen: string;
  isActive: string;
  onToggle: string;
  depth: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxDocsSidebarNode: React.FC<TuxDocsSidebarNodeProps> = ({
  section, path, query, openMap, isOpen, isActive, onToggle, depth, children, className = '', style
}) => {
  return (
    <li className={`tux-docs-sidebar-node ${className}`.trim()} style={style}>
      {children}
    </li>
  );
};

export default TuxDocsSidebarNode;
