/**
 * TuxSparkline — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSparklineProps {
  data?: string;
  width??: number;
  height??: number;
  tone??: string;
  strokeWidth??: number;
  showArea??: boolean;
  showLastPoint??: boolean;
  showDelta??: boolean;
  deltaFormat??: "percent" | "absolute";
  ariaSummary??: string;
  units??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxSparkline: React.FC<TuxSparklineProps> = ({
  data, width = 120, height = 32, tone = "brand", strokeWidth = 1.5, showArea = false, showLastPoint = true, showDelta = false, deltaFormat = percent, ariaSummary = "undefined", units = "undefined", children, className = ''
}) => {
  return (
    <span className={`tux-sparkline ${className}`.trim()}>
      {children}
    </span>
  );
};

export default TuxSparkline;
