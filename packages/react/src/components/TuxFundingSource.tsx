/**
 * TuxFundingSource — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFundingSourceProps {
  funder: string;
  abbrev?: string;
  logo?: string;
  grant?: string;
  to?: string;
  size?: "sm" | "md" | "lg";
  layout?: "inline" | "stacked";
  children?: React.ReactNode;
  className?: string;
}

export const TuxFundingSource: React.FC<TuxFundingSourceProps> = ({
  funder, abbrev, logo, grant, to, size = "md", layout = "inline", children, className = ''
}) => {
  return (
    <div className={`tux-funding-source ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxFundingSource;
