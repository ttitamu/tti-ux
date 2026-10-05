/**
 * TuxScrollTop — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxScrollTopProps {
  threshold??: number;
  position??: "bottom-right" | "bottom-right-stacked" | "bottom-left";
  ariaLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxScrollTop: React.FC<TuxScrollTopProps> = ({
  threshold = 160, position = bottom-right, ariaLabel = "Scroll", children, className = ''
}) => {
  return (
    <button className={`tux-scroll-top ${className}`.trim()}>
      {children}
    </button>
  );
};

export default TuxScrollTop;
