/**
 * TuxSplitPane — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSplitPaneProps {
  modelValue??: "string" | "number" | "null";
  initialListWidth??: string;
  minListWidth??: number;
  maxListWidth??: number;
  id??: string;
  initialBottomHeight??: string;
  showBottom??: boolean;
  listLabel??: string;
  detailLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxSplitPane: React.FC<TuxSplitPaneProps> = ({
  modelValue = null, initialListWidth = "320px", minListWidth = 220, maxListWidth = 560, id = "undefined", initialBottomHeight = "160px", showBottom = false, listLabel = "Records", detailLabel = "Detail", children, className = ''
}) => {
  return (
    <div className={`tux-split-pane ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxSplitPane;
