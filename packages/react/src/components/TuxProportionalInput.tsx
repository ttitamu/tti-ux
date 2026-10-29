/**
 * TuxProportionalInput — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxProportionalInputProps {
  modelValue: string;
  targetTotal?: number;
  unit?: string;
  decimals?: number;
  step?: number;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxProportionalInput: React.FC<TuxProportionalInputProps> = ({
  modelValue, targetTotal = 100, unit = "%", decimals = 1, step = 1, title, children, className = '', style
}) => {
  return (
    <div className={`tux-proportional-input ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-proportional-input__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxProportionalInput;
