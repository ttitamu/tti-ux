/**
 * TuxMegaMenu — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMegaMenuProps {
  label: string;
  columns: string;
  featured?: string;
  to?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxMegaMenu: React.FC<TuxMegaMenuProps> = ({
  label, columns, featured, to, children, className = '', style
}) => {
  return (
    <div className={`tux-mega-menu ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-mega-menu__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxMegaMenu;
