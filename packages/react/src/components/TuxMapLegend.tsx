/**
 * TuxMapLegend — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMapLegendProps {
  title??: string;
  eyebrow??: string;
  entries??: string;
  layout??: "stacked" | "inline" | "gradient";
  gradient??: string;
  minLabel?: string;
  maxLabel?: string;
  css??: string;
  stops??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxMapLegend: React.FC<TuxMapLegendProps> = ({
  title = "undefined", eyebrow = "undefined", entries = "undefined", layout = stacked, gradient = "undefined", minLabel, maxLabel, css, stops, children, className = ''
}) => {
  return (
    <div className={`tux-map-legend ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxMapLegend;
