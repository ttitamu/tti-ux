/**
 * TuxTooltip — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTooltipProps {
  text: string;
  title?: string;
  kbds?: string;
  side?: "top" | "right" | "bottom" | "left";
  arrow?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxTooltip: React.FC<TuxTooltipProps> = ({
  text, title, kbds, side = "top", arrow = true, disabled = false, children, className = ''
}) => {
  return (
    <div className={`tux-tooltip ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxTooltip;
