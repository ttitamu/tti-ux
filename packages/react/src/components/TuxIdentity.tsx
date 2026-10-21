/**
 * TuxIdentity — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxIdentityProps {
  name: string;
  superhead?: string;
  level?: "institution" | "center" | "department";
  orientation?: "horizontal" | "stacked";
  kind?: "lockup" | "text";
  href?: string;
  logoSize?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxIdentity: React.FC<TuxIdentityProps> = ({
  name, superhead, level = "institution", orientation = "horizontal", kind = "lockup", href, logoSize = 0, children, className = '', style
}) => {
  return (
    <div className={`tux-identity ${className}`.trim()} style={style}>
      {name !== undefined && String(name) !== "" && <div className="tux-identity__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(name)}</div>}
      {children}
    </div>
  );
};

export default TuxIdentity;
