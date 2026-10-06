/**
 * TuxMetroInset — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMetroInsetProps {
  name?: string;
  highwayLabel??: string;
  height??: number;
  palette??: string;
  seed??: string;
  cols??: number;
  rows??: number;
  children?: React.ReactNode;
  className?: string;
}

export const TuxMetroInset: React.FC<TuxMetroInsetProps> = ({
  name, highwayLabel, height = 220, palette = "maroon", seed, cols = 8, rows = 6, children, className = ''
}) => {
  return (
    <div className={`tux-metro-inset ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxMetroInset;
