/**
 * TuxBlockquote — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxBlockquoteProps {
  quote?: string;
  attribution??: "string" | "null";
  role??: "string" | "null";
  layout??: "centered" | "drop-cap";
  variant??: "default" | "bold" | "elegant";
  children?: React.ReactNode;
  className?: string;
}

export const TuxBlockquote: React.FC<TuxBlockquoteProps> = ({
  quote, attribution = null, role = null, layout = centered, variant = default, children, className = ''
}) => {
  return (
    <figure className={`tux-blockquote ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxBlockquote;
