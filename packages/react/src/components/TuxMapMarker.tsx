/**
 * TuxMapMarker — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMapMarkerProps {
  kind: string;
  number?: string;
  toneIndex?: number;
  size?: "sm" | "md" | "lg";
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxMapMarker: React.FC<TuxMapMarkerProps> = ({
  kind, number, toneIndex, size = "md", title, children, className = '', style
}) => {
  return (
    <svg className={`tux-map-marker ${className}`.trim()} data-size={size} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-map-marker__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </svg>
  );
};

export default TuxMapMarker;
