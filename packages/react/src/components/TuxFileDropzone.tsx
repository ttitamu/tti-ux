/**
 * TuxFileDropzone — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFileDropzoneProps {
  modelValue?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  label?: string;
  hint?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxFileDropzone: React.FC<TuxFileDropzoneProps> = ({
  modelValue, accept, multiple = false, maxSize = 50, maxFiles = 10, disabled = false, label, hint, children, className = '', style
}) => {
  return (
    <div className={`tux-file-dropzone ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-file-dropzone__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxFileDropzone;
