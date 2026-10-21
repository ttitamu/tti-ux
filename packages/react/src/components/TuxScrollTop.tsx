/**
 * TuxScrollTop — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxScrollTopProps {
  threshold?: number;
  position?: "bottom-right" | "bottom-right-stacked" | "bottom-left";
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxScrollTop: React.FC<TuxScrollTopProps> = ({
  threshold = 160, position = "bottom-right", ariaLabel = "Scroll to top of page", children, className = '', style
}) => {
  return (
    <button className={`tux-scroll-top ${className}`.trim()} style={style}>
      {children}
    </button>
  );
};

export default TuxScrollTop;
