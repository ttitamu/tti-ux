/**
 * TuxChartSunburst — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartSunburstProps {
  data?: string;
  size??: number;
  centerLabel??: string;
  formatTotal??: string;
  formatValue??: string;
  showLegend??: boolean;
  palette??: string;
  tooltip??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChartSunburst: React.FC<TuxChartSunburstProps> = ({
  data, size = 320, centerLabel = "Total", formatTotal = "undefined", formatValue = "undefined", showLegend = true, palette = "undefined", tooltip = true, children, className = ''
}) => {
  return (
    <div className={`tux-chart-sunburst ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxChartSunburst;
