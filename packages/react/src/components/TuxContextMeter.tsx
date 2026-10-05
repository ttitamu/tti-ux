/**
 * TuxContextMeter — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxContextMeterProps {
  used?: number;
  max?: number;
  breakdown??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxContextMeter: React.FC<TuxContextMeterProps> = ({
  used, max, breakdown = "undefined", children, className = ''
}) => {
  return (
    <UPopover className={`tux-context-meter ${className}`.trim()}>
      {children}
    </UPopover>
  );
};

export default TuxContextMeter;
