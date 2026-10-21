/**
 * TuxTileGrid — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxTileGridProps {
  title?: string;
  subtitle?: string;
  tiles?: string;
  columns?: number;
  surface?: "eggshell" | "raised";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxTileGrid: React.FC<TuxTileGridProps> = ({
  title, subtitle, tiles, columns = 3, surface = "eggshell", children, className = '', style
}) => {
  return (
    <section className={`tux-tile-grid ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-tile-grid__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-tile-grid__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </section>
  );
};

export default TuxTileGrid;
