/**
 * TuxChartFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartFrameProps {
  eyebrow??: string;
  title??: string;
  subtitle??: string;
  source??: string;
  notes??: string;
  bare??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartFrame: React.FC<TuxChartFrameProps> = ({
  eyebrow, title, subtitle, source, notes, bare = false, children, className = ''
}) => {
  return (
    <figure className={`tux-chart-frame ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxChartFrame;
