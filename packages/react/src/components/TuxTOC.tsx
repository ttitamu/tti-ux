/**
 * TuxTOC — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTOCProps {
  items?: string;
  target?: string;
  levels?: string;
  title?: string;
  noTitle?: boolean;
  variant?: "comm" | "classic";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxTOC: React.FC<TuxTOCProps> = ({
  items, target = "article", levels, title = "On this page", noTitle = false, variant = "comm", children, className = '', style
}) => {
  return (
    <nav className={`tux-toc ${className}`.trim()} data-variant={variant} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-toc__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </nav>
  );
};

export default TuxTOC;
