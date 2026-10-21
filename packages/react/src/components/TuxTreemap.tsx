/**
 * TuxTreemap — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTreemapProps {
  data: string;
  width?: number;
  height?: number;
  maxDepth?: number;
  colorBy?: "size" | "depth";
  unit?: "bytes" | "count" | "percent";
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxTreemap: React.FC<TuxTreemapProps> = ({
  data, width = 720, height = 460, maxDepth = 2, colorBy = "size", unit = "bytes", ariaLabel, children, className = '', style
}) => {
  return (
    <div className={`tux-treemap ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxTreemap;
