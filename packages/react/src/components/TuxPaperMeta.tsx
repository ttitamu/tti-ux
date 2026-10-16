/**
 * TuxPaperMeta — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPaperMetaProps {
  doi?: string;
  license?: string;
  funders?: string;
  published?: string;
  version?: string;
  type?: string;
  pages?: string;
  venue?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxPaperMeta: React.FC<TuxPaperMetaProps> = ({
  doi, license, funders, published, version, type, pages, venue, children, className = ''
}) => {
  return (
    <dl className={`tux-paper-meta ${className}`.trim()}>
      {children}
    </dl>
  );
};

export default TuxPaperMeta;
