/**
 * TuxUnitValue — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxUnitValueProps {
  value: number;
  unit: string;
  ci?: number;
  decimals?: number;
  label?: string;
  station?: string;
  variant?: "inline" | "pill" | "card";
  interactive?: boolean;
  system?: string;
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxUnitValue: React.FC<TuxUnitValueProps> = ({
  value, unit, ci, decimals, label = "", station = "", variant = "inline", interactive = false, system, division, children, className = '', style
}) => {
  return (
    <span className={`tux-unit-value ${className}`.trim()} data-variant={variant} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-unit-value__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {value !== undefined && String(value) !== "" && <div className="tux-unit-value__value" style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "var(--brand-primary, #500000)" }}>{String(value)}</div>}
      {children}
    </span>
  );
};

export default TuxUnitValue;
