/**
 * TuxReportFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxReportFrameProps {
  size??: string;
  density??: string;
  breakAfter??: boolean;
  title??: string;
  eyebrow??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxReportFrame: React.FC<TuxReportFrameProps> = ({
  size = "letter", density = "editorial", breakAfter = false, title = "undefined", eyebrow = "undefined", children, className = ''
}) => {
  return (
    <article className={`tux-report-frame ${className}`.trim()}>
      {children}
    </article>
  );
};

export default TuxReportFrame;
