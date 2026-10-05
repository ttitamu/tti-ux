/**
 * TuxMapMarker — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMapMarkerProps {
  kind?: string;
  number??: "number" | "string";
  toneIndex??: number;
  size??: "sm" | "md" | "lg";
  title??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxMapMarker: React.FC<TuxMapMarkerProps> = ({
  kind, number = undefined, toneIndex = undefined, size = md, title = "undefined", children, className = ''
}) => {
  return (
    <svg className={`tux-map-marker ${className}`.trim()}>
      {children}
    </svg>
  );
};

export default TuxMapMarker;
