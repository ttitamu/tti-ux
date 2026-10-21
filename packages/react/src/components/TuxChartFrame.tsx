/**
 * TuxChartFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartFrameProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  source?: string;
  notes?: string;
  bare?: boolean;
  labels?: string;
  series?: string;
  sonify?: boolean;
  showDataTable?: boolean;
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
  doi?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartFrame: React.FC<TuxChartFrameProps> = ({
  eyebrow = "", title = "", subtitle = "", source = "", notes = "", bare = false, labels, series, sonify = true, showDataTable = true, division, doi = "", children, className = ''
}) => {
  return (
    <figure className={`tux-chart-frame ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxChartFrame;
