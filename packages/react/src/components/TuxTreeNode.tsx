/**
 * TuxTreeNode — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTreeNodeProps {
  node?: string;
  depth?: number;
  selectedId??: string;
  isExpanded?: string;
  showGuides?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxTreeNode: React.FC<TuxTreeNodeProps> = ({
  node, depth, selectedId, isExpanded, showGuides = false, children, className = ''
}) => {
  return (
    <li className={`tux-tree-node ${className}`.trim()}>
      {children}
    </li>
  );
};

export default TuxTreeNode;
