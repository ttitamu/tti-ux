/**
 * TuxHeroCanvas — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxHeroCanvasProps {
  variant??: "wash" | "corridor" | "network" | "sol" | "constellation";
  blend??: "seamless" | "contained" | "full-bleed";
  interactive??: boolean;
  showControls??: boolean;
  minHeight??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxHeroCanvas: React.FC<TuxHeroCanvasProps> = ({
  variant = wash, blend = seamless, interactive = true, showControls = true, minHeight = "32rem", children, className = ''
}) => {
  return (
    <div className={`tux-hero-canvas ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxHeroCanvas;
