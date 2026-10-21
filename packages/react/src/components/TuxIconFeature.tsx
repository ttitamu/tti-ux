/**
 * TuxIconFeature — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxIconFeatureProps {
  items: string;
  layout?: "grid" | "list";
  columns?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxIconFeature: React.FC<TuxIconFeatureProps> = ({
  items, layout = "grid", columns = 3, children, className = '', style
}) => {
  return (
    <ul className={`tux-icon-feature ${className}`.trim()} style={style}>
      {children}
    </ul>
  );
};

export default TuxIconFeature;
