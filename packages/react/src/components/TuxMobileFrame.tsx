/**
 * TuxMobileFrame — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMobileFrameProps {
  platform??: string;
  width??: number;
  color??: "IosColor" | "AndroidColor";
  statusBar??: boolean;
  time??: string;
  notch??: boolean;
  homeIndicator??: boolean;
  navStyle??: string;
  ariaLabel??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxMobileFrame: React.FC<TuxMobileFrameProps> = ({
  platform = "ios", width = 280, color = undefined, statusBar = true, time = "9:41", notch = true, homeIndicator = true, navStyle = "gesture", ariaLabel = "undefined", children, className = ''
}) => {
  return (
    <figure className={`tux-mobile-frame ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxMobileFrame;
