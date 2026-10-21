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
  style?: React.CSSProperties;
}

export const TuxCorridorStrip: React.FC<TuxCorridorStripProps> = ({
  name, fromMile, toMile, segments, events, values, valuesLabel, direction, width = 800, height = 140, tickEvery = 5, tickFormat = "mile", syncChannel, activeMile, interactiveScrub = false, children, className = '', style
}) => {
  return (
    <figure className={`tux-corridor-strip ${className}`.trim()} style={style}>
      {name !== undefined && String(name) !== "" && <div className="tux-corridor-strip__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(name)}</div>}
      {children}
    </figure>
  );
};

export default TuxCorridorStrip;
