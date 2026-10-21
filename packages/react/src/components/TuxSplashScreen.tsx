/**
 * TuxSplashScreen — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSplashScreenProps {
  loaded?: boolean;
  status?: string;
  hidden?: boolean;
  fadeDelay?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSplashScreen: React.FC<TuxSplashScreenProps> = ({
  loaded = false, status = "Loading…", hidden = false, fadeDelay = 300, children, className = '', style
}) => {
  return (
    <div className={`tux-splash-screen ${className}`.trim()} data-status={status} style={style}>
      {children}
    </div>
  );
};

export default TuxSplashScreen;
