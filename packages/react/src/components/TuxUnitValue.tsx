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
}

export const TuxUnitValue: React.FC<TuxUnitValueProps> = ({
  value, unit, ci, decimals, label = "", station = "", variant = "inline", interactive = false, system, division, children, className = ''
}) => {
  return (
    <span className={`tux-unit-value ${className}`.trim()}>
      {children}
    </span>
  );
};

export default TuxUnitValue;
