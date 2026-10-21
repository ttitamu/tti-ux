/**
 * TuxECharts — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxEChartsProps {
  options: string;
  height?: string;
  width?: string;
  ariaTitle?: string;
  ariaSummary?: string;
  extensions?: string;
  maps?: string;
  loading?: boolean;
  notMerge?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxECharts: React.FC<TuxEChartsProps> = ({
  options, height = "380px", width = "100%", ariaTitle, ariaSummary, extensions, maps, loading = false, notMerge = false, children, className = '', style
}) => {
  return (
    <div className={`tux-echarts ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxECharts;
