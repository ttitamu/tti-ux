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
  style?: React.CSSProperties;
}

export const TuxTooltip: React.FC<TuxTooltipProps> = ({
  text, title, kbds, side = "top", arrow = true, disabled = false, children, className = '', style
}) => {
  return (
    <div className={`tux-tooltip ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-tooltip__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxTooltip;
