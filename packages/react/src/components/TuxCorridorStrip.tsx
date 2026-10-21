/**
 * TuxCorridorStrip — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCorridorStripProps {
  name?: string;
  fromMile: number;
  toMile: number;
  segments?: string;
  events?: string;
  values?: string;
  valuesLabel?: string;
  direction?: string;
  width?: number;
  height?: number;
  tickEvery?: number;
  tickFormat?: "mile" | "rm" | "station";
  syncChannel?: string;
  activeMile?: number;
  interactiveScrub?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxCorridorStrip: React.FC<TuxCorridorStripProps> = ({
  name, fromMile, toMile, segments, events, values, valuesLabel, direction, width = 800, height = 140, tickEvery = 5, tickFormat = "mile", syncChannel, activeMile, interactiveScrub = false, children, className = ''
}) => {
  return (
    <figure className={`tux-corridor-strip ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxCorridorStrip;
