/**
 * TuxFigureCaption — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFigureCaptionProps {
  label??: string;
  number?: "number" | "string";
  caption??: string;
  source??: string;
  placement??: "above" | "below";
  children?: React.ReactNode;
  className?: string;
}

export const TuxFigureCaption: React.FC<TuxFigureCaptionProps> = ({
  label = "Figure", number, caption = "undefined", source = "undefined", placement = below, children, className = ''
}) => {
  return (
    <figure className={`tux-figure-caption ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxFigureCaption;
