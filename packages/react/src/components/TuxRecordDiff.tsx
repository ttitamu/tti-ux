/**
 * TuxRecordDiff — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxRecordDiffProps {
  fields: string;
  beforeLabel?: string;
  afterLabel?: string;
  changesOnlyDefault?: boolean;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxRecordDiff: React.FC<TuxRecordDiffProps> = ({
  fields, beforeLabel = "Baseline", afterLabel = "Current", changesOnlyDefault = false, title, children, className = '', style
}) => {
  return (
    <div className={`tux-record-diff ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-record-diff__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxRecordDiff;
