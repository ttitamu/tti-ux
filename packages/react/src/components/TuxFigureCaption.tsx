/**
 * TuxFigureCaption — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFigureCaptionProps {
  label?: string;
  number: string;
  caption?: string;
  source?: string;
  placement?: "above" | "below";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxFigureCaption: React.FC<TuxFigureCaptionProps> = ({
  label = "Figure", number, caption, source, placement = "below", children, className = '', style
}) => {
  return (
    <figure className={`tux-figure-caption ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-figure-caption__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {caption !== undefined && String(caption) !== "" && <div className="tux-figure-caption__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(caption)}</div>}
      {children}
    </figure>
  );
};

export default TuxFigureCaption;
