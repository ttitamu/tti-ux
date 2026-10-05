/**
 * TuxCenterBadge — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCenterBadgeProps {
  center??: "CenterKey" | "custom";
  label??: string;
  icon??: string;
  toneIndex??: number;
  short??: boolean;
  size??: "sm" | "md";
  layout??: "chip" | "stacked";
  children?: React.ReactNode;
  className?: string;
}

export const TuxCenterBadge: React.FC<TuxCenterBadgeProps> = ({
  center = undefined, label = "undefined", icon = "undefined", toneIndex = 2, short = false, size = md, layout = chip, children, className = ''
}) => {
  return (
    <span className={`tux-center-badge ${className}`.trim()}>
      {children}
    </span>
  );
};

export default TuxCenterBadge;
