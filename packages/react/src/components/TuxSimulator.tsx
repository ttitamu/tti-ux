/**
 * TuxSimulator — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSimulatorProps {
  title?: string;
  subtitle?: string;
  parameters: string;
  presets?: string;
  primaryLabel?: string;
  comparisonLabel?: string;
  budgetLimit?: number;
  currencySymbol?: string;
  showComparison?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSimulator: React.FC<TuxSimulatorProps> = ({
  title = "Workload & Cost Simulator", subtitle, parameters, presets, primaryLabel = "Proposed Pool", comparisonLabel = "Baseline Pool", budgetLimit = 0, currencySymbol = "$", showComparison = true, children, className = '', style
}) => {
  return (
    <section className={`tux-simulator ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-simulator__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-simulator__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </section>
  );
};

export default TuxSimulator;
