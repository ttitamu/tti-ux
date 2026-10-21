/**
 * TuxContextMeter — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxContextMeterProps {
  used: number;
  max: number;
  breakdown?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxContextMeter: React.FC<TuxContextMeterProps> = ({
  used, max, breakdown, children, className = '', style
}) => {
  return (
    <div className={`tux-context-meter ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxContextMeter;
