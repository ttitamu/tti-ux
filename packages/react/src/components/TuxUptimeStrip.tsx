/**
 * TuxUptimeStrip — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxUptimeStripProps {
  serviceName: string;
  serviceGroup?: string;
  buckets: string;
  windowLabel?: string;
  slaTargetPct?: number;
  currentLatencyMs?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxUptimeStrip: React.FC<TuxUptimeStripProps> = ({
  serviceName, serviceGroup, buckets, windowLabel = "Last 30 days", slaTargetPct = 99.9, currentLatencyMs, children, className = '', style
}) => {
  return (
    <div className={`tux-uptime-strip ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxUptimeStrip;
