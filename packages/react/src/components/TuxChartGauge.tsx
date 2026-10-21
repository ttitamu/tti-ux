/**
 * TuxChartGauge — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartGaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  variant?: "arc" | "progress";
  bands?: string;
  centerLabel?: string;
  centerValue?: string;
  units?: string;
  format?: string;
  decimals?: number;
  ariaSummary?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartGauge: React.FC<TuxChartGaugeProps> = ({
  value, min = 0, max = 100, size = 240, variant = "arc", bands, centerLabel, centerValue, units, format, decimals = 1, ariaSummary, children, className = '', style
}) => {
  return (
    <figure className={`tux-chart-gauge ${className}`.trim()} data-variant={variant} data-size={size} style={style}>
      {value !== undefined && String(value) !== "" && <div className="tux-chart-gauge__value" style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "var(--brand-primary, #500000)" }}>{String(value)}</div>}
      {children}
    </figure>
  );
};

export default TuxChartGauge;
