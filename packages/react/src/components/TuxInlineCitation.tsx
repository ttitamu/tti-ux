/**
 * TuxInlineCitation — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxInlineCitationProps {
  n: number;
  title: string;
  href?: string;
  excerpt?: string;
  score?: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxInlineCitation: React.FC<TuxInlineCitationProps> = ({
  n, title, href, excerpt, score, label, children, className = ''
}) => {
  return (
    <div className={`tux-inline-citation ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxInlineCitation;
