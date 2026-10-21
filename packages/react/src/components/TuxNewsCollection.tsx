/**
 * TuxNewsCollection — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxNewsCollectionProps {
  items: string;
  layout?: "stacked" | "grid";
  columns?: number;
  readMore?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxNewsCollection: React.FC<TuxNewsCollectionProps> = ({
  items, layout = "stacked", columns = 3, readMore = "Read more", children, className = ''
}) => {
  return (
    <ul className={`tux-news-collection ${className}`.trim()}>
      {children}
    </ul>
  );
};

export default TuxNewsCollection;
