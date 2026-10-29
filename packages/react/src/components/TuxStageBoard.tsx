/**
 * TuxStageBoard — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxStageBoardProps {
  stages: string;
  items: string;
  metricPrefix?: string;
  metricSuffix?: string;
  decimals?: number;
  movable?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxStageBoard: React.FC<TuxStageBoardProps> = ({
  stages, items, metricPrefix = "", metricSuffix = "", decimals = 0, movable = true, children, className = '', style
}) => {
  return (
    <div className={`tux-stage-board ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxStageBoard;
