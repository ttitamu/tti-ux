/**
 * TuxStepper — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxStepperProps {
  steps: string;
  currentIndex?: number;
  orientation?: "horizontal" | "vertical";
  showDescriptions?: boolean;
  ariaLabel?: string;
  stationFormat?: "number" | "station" | "rm";
  division?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxStepper: React.FC<TuxStepperProps> = ({
  steps, currentIndex = 0, orientation = "horizontal", showDescriptions = true, ariaLabel = "Progress", stationFormat = "number", division, children, className = '', style
}) => {
  return (
    <nav className={`tux-stepper ${className}`.trim()} style={style}>
      {children}
    </nav>
  );
};

export default TuxStepper;
