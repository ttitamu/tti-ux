/**
 * TuxECharts — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxEChartsProps {
  options?: string;
  height??: string;
  width??: string;
  ariaTitle??: string;
  ariaSummary??: string;
  extensions??: "("wordcloud" | "liquidfill")[]";
  maps??: "("USA_ALBERS" | "TEXAS_COUNTIES" | "TXDOT_DISTRICTS")[]";
  loading??: boolean;
  notMerge??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxECharts: React.FC<TuxEChartsProps> = ({
  options, height = "380px", width = "100%", ariaTitle = "Interactive", ariaSummary, extensions, maps, loading = false, notMerge = false, children, className = ''
}) => {
  return (
    <div className={`tux-echarts ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxECharts;
