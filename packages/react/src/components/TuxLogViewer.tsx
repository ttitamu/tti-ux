/**
 * TuxLogViewer — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxLogViewerProps {
  title?: string;
  lines: string;
  initialLevel?: string;
  wrapLines?: boolean;
  showLineNumbers?: boolean;
  maxHeight?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxLogViewer: React.FC<TuxLogViewerProps> = ({
  title = "Operational Job & Telemetry Logs", lines, initialLevel = "all", wrapLines = true, showLineNumbers = true, maxHeight = "24rem", children, className = '', style
}) => {
  return (
    <div className={`tux-log-viewer ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-log-viewer__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxLogViewer;
