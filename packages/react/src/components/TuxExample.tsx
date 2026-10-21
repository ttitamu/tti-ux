/**
 * TuxExample — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxExampleProps {
  vue?: string;
  react?: string;
  wc?: string;
  razor?: string;
  python?: string;
  php?: string;
  swift?: string;
  kotlin?: string;
  source?: string;
  css?: string;
  powerbi?: string;
  title?: string;
  previewPadding?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxExample: React.FC<TuxExampleProps> = ({
  vue, react, wc, razor, python, php, swift, kotlin, source, css, powerbi, title, previewPadding = "p-6", children, className = '', style
}) => {
  return (
    <div className={`tux-example ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-example__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxExample;
