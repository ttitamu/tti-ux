/**
 * TuxPeriodPicker — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPeriodPickerProps {
  modelValue: string;
  presets?: string;
  label?: string;
  allowCompare?: boolean;
  stepDays?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxPeriodPicker: React.FC<TuxPeriodPickerProps> = ({
  modelValue, presets, label, allowCompare = true, stepDays, children, className = '', style
}) => {
  return (
    <div className={`tux-period-picker ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-period-picker__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxPeriodPicker;
