/**
 * TuxSplashScreen — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSplashScreenProps {
  loaded??: boolean;
  status??: string;
  hidden??: boolean;
  fadeDelay??: number;
  children?: React.ReactNode;
  className?: string;
}

export const TuxSplashScreen: React.FC<TuxSplashScreenProps> = ({
  loaded = false, status = "Loading…", hidden = false, fadeDelay = 300, children, className = ''
}) => {
  return (
    <Transition className={`tux-splash-screen ${className}`.trim()}>
      {children}
    </Transition>
  );
};

export default TuxSplashScreen;
