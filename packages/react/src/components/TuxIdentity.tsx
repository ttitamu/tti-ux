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
}

export const TuxIdentity: React.FC<TuxIdentityProps> = ({
  name, superhead, level = "institution", orientation = "horizontal", kind = "lockup", href, logoSize = 0, children, className = ''
}) => {
  return (
    <div className={`tux-identity ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxIdentity;
