/**
 * TuxResourceMeter — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxResourceMeterProps {
  title: string;
  subtitle?: string;
  poolStatus?: string;
  channels: string;
  wasteThresholdRatio?: number;
  saturationThresholdRatio?: number;
  reclaimLabel?: string;
  showReclaimAction?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxResourceMeter: React.FC<TuxResourceMeterProps> = ({
  title, subtitle, poolStatus = "ok", channels, wasteThresholdRatio = 0.35, saturationThresholdRatio = 0.85, reclaimLabel = "Reclaim Idle", showReclaimAction = true, children, className = '', style
}) => {
  return (
    <div className={`tux-resource-meter ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-resource-meter__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-resource-meter__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </div>
  );
};

export default TuxResourceMeter;
