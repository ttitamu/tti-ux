/**
 * TuxBlockquote — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxBlockquoteProps {
  quote: string;
  attribution?: string;
  role?: string;
  layout?: "centered" | "drop-cap";
  variant?: "default" | "bold" | "elegant";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxBlockquote: React.FC<TuxBlockquoteProps> = ({
  quote, attribution, role, layout = "centered", variant = "default", children, className = '', style
}) => {
  return (
    <figure className={`tux-blockquote ${className}`.trim()} data-variant={variant} style={style}>
      {children}
    </figure>
  );
};

export default TuxBlockquote;
