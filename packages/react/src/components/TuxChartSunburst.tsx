/**
 * TuxChartSunburst — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChartSunburstProps {
  data: string;
  size?: number;
  centerLabel?: string;
  formatTotal?: string;
  formatValue?: string;
  showLegend?: boolean;
  palette?: string;
  tooltip?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChartSunburst: React.FC<TuxChartSunburstProps> = ({
  data, size = 320, centerLabel = "Total", formatTotal, formatValue, showLegend = true, palette, tooltip = true, children, className = '', style
}) => {
  return (
    <div className={`tux-chart-sunburst ${className}`.trim()} data-size={size} style={style}>
      {children}
    </div>
  );
};

export default TuxChartSunburst;
