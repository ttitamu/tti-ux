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
  style?: React.CSSProperties;
}

export const TuxFooter: React.FC<TuxFooterProps> = ({
  name, address, phone, logo = "/logo.svg", logoSize = 80, brandLockup = "/TTI_white.png", brandLockupAlt, social, columns, tagline, year, children, className = '', style
}) => {
  return (
    <footer className={`tux-footer ${className}`.trim()} style={style}>
      {name !== undefined && String(name) !== "" && <div className="tux-footer__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(name)}</div>}
      {children}
    </footer>
  );
};

export default TuxFooter;
