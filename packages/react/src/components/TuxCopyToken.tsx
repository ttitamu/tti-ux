/**
 * TuxCopyToken — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCopyTokenProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCopyToken: React.FC<TuxCopyTokenProps> = ({
  children, className = '', style
}) => {
  return (
    <span className={`tux-copy-token ${className}`.trim()} style={style}>
      {children}
    </span>
  );
};

export default TuxCopyToken;
