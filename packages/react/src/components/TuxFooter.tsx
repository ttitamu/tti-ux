/**
 * TuxFooter — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFooterProps {
  name?: string;
  address?: string;
  phone?: string;
  logo?: string;
  logoSize?: number;
  brandLockup?: string;
  brandLockupAlt?: string;
  social?: string;
  columns?: string;
  tagline?: string;
  year?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TuxFooter: React.FC<TuxFooterProps> = ({
  name, address, phone, logo = "/logo.svg", logoSize = 80, brandLockup = "/TTI_white.png", brandLockupAlt, social, columns, tagline, year, children, className = ''
}) => {
  return (
    <footer className={`tux-footer ${className}`.trim()}>
      {children}
    </footer>
  );
};

export default TuxFooter;
