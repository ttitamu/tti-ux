/**
 * TuxEntityPicker — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxEntityPickerProps {
  modelValue: string;
  options: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxEntityPicker: React.FC<TuxEntityPickerProps> = ({
  modelValue, options, label, placeholder = "Search by code, title, or owner…", clearable = true, children, className = '', style
}) => {
  return (
    <div className={`tux-entity-picker ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-entity-picker__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxEntityPicker;
