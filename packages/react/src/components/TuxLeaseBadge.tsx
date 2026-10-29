/**
 * TuxLeaseBadge — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxLeaseBadgeProps {
  label?: string;
  remainingHours?: number;
  expiresLabel?: string;
  warningHours?: number;
  extendable?: boolean;
  releasable?: boolean;
  extendLabel?: string;
  releaseLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxLeaseBadge: React.FC<TuxLeaseBadgeProps> = ({
  label, remainingHours, expiresLabel, warningHours = 72, extendable = false, releasable = false, extendLabel = "Extend", releaseLabel = "Release", children, className = '', style
}) => {
  return (
    <div className={`tux-lease-badge ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-lease-badge__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxLeaseBadge;
