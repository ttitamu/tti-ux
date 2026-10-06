/**
 * TuxInlineCitation — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxInlineCitationProps {
  n?: number;
  title?: string;
  href??: string;
  excerpt??: string;
  score??: "string" | "number";
  label??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxInlineCitation: React.FC<TuxInlineCitationProps> = ({
  n, title, href = "undefined", excerpt = "undefined", score = undefined, label = "undefined", children, className = ''
}) => {
  return (
    <UPopover className={`tux-inline-citation ${className}`.trim()}>
      {children}
    </UPopover>
  );
};

export default TuxInlineCitation;
