/**
 * TuxThresholdBar — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxThresholdBarProps {
  title?: string;
  segments: string;
  limit: number;
  unit?: string;
  unitPosition?: "prefix" | "suffix";
  decimals?: number;
  warningRatio?: number;
  showLegend?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxThresholdBar: React.FC<TuxThresholdBarProps> = ({
  title, segments, limit, unit = "", unitPosition = "suffix", decimals = 1, warningRatio = 0.85, showLegend = true, children, className = '', style
}) => {
  return (
    <div className={`tux-threshold-bar ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-threshold-bar__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxThresholdBar;
