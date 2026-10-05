/**
 * TuxProgram — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxProgramProps {
  name?: string;
  eyebrow??: string;
  summary??: string;
  hero??: string;
  leads??: string;
  funders??: string;
  metrics??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxProgram: React.FC<TuxProgramProps> = ({
  name, eyebrow = "undefined", summary = "undefined", hero = "undefined", leads = "undefined", funders = "undefined", metrics = "undefined", children, className = ''
}) => {
  return (
    <article className={`tux-program ${className}`.trim()}>
      {children}
    </article>
  );
};

export default TuxProgram;
