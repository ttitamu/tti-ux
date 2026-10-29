/**
 * TuxSegmentedInput — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSegmentedInputProps {
  modelValue: string;
  segments: string;
  separator?: string;
  label?: string;
  helpText?: string;
  uppercase?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSegmentedInput: React.FC<TuxSegmentedInputProps> = ({
  modelValue, segments, separator = "-", label, helpText, uppercase = true, disabled = false, children, className = '', style
}) => {
  return (
    <div className={`tux-segmented-input ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-segmented-input__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxSegmentedInput;
