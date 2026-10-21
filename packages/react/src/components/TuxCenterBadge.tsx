/**
 * TuxCenterBadge — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCenterBadgeProps {
  center?: string;
  label?: string;
  icon?: string;
  toneIndex?: number;
  short?: boolean;
  size?: "sm" | "md";
  layout?: "chip" | "stacked";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCenterBadge: React.FC<TuxCenterBadgeProps> = ({
  center, label, icon, toneIndex = 2, short = false, size = "md", layout = "chip", children, className = '', style
}) => {
  return (
    <span className={`tux-center-badge ${className}`.trim()} data-size={size} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-center-badge__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </span>
  );
};

export default TuxCenterBadge;
