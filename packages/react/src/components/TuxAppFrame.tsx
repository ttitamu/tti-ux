/**
 * TuxAppFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxAppFrameProps {
  title?: string;
  eyebrow?: string;
  useSystemAccent?: boolean;
  unifiedToolbar?: boolean;
  forceChrome?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxAppFrame: React.FC<TuxAppFrameProps> = ({
  title, eyebrow, useSystemAccent = false, unifiedToolbar = true, forceChrome = false, children, className = '', style
}) => {
  return (
    <header className={`tux-app-frame ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-app-frame__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-app-frame__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </header>
  );
};

export default TuxAppFrame;
