/**
 * TuxPaperMeta — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPaperMetaProps {
  doi??: string;
  license??: string;
  funders??: string;
  published??: string;
  version??: string;
  type??: string;
  pages??: string;
  venue??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxPaperMeta: React.FC<TuxPaperMetaProps> = ({
  doi = "undefined", license = "undefined", funders = "undefined", published = "undefined", version = "undefined", type = "undefined", pages = "undefined", venue = "undefined", children, className = ''
}) => {
  return (
    <dl className={`tux-paper-meta ${className}`.trim()}>
      {children}
    </dl>
  );
};

export default TuxPaperMeta;
