/**
 * TuxPhotoGrid — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPhotoGridProps {
  items: string;
  kind?: "photo" | "logo";
  columns?: number;
  aspect?: "4/3" | "1/1" | "16/9" | "3/4";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxPhotoGrid: React.FC<TuxPhotoGridProps> = ({
  items, kind = "photo", columns = 3, aspect, children, className = '', style
}) => {
  return (
    <ul className={`tux-photo-grid ${className}`.trim()} style={style}>
      {children}
    </ul>
  );
};

export default TuxPhotoGrid;
