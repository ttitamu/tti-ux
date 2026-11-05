/**
 * TuxAnomalyCard — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxAnomalyCardProps {
  id?: string;
  title: string;
  metricLabel: string;
  currentValue: string;
  baselineLabel: string;
  deltaLabel: string;
  projectionLabel?: string;
  severity?: string;
  state?: string;
  ruleSummary?: string;
  series?: string;
  targetEntity?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxAnomalyCard: React.FC<TuxAnomalyCardProps> = ({
  id = "anomaly-card", title, metricLabel, currentValue, baselineLabel, deltaLabel, projectionLabel, severity = "critical", state = "open", ruleSummary, series, targetEntity, children, className = '', style
}) => {
  return (
    <article className={`tux-anomaly-card ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-anomaly-card__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </article>
  );
};

export default TuxAnomalyCard;
