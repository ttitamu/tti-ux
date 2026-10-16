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
}

export const TuxCenterBadge: React.FC<TuxCenterBadgeProps> = ({
  center, label, icon, toneIndex = 2, short = false, size = "md", layout = "chip", children, className = ''
}) => {
  return (
    <span className={`tux-center-badge ${className}`.trim()}>
      {children}
    </span>
  );
};

export default TuxCenterBadge;
