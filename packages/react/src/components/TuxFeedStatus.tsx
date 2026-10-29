/**
 * TuxFeedStatus — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFeedStatusProps {
  feeds: string;
  title?: string;
  layout?: "list" | "grid";
  syncable?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxFeedStatus: React.FC<TuxFeedStatusProps> = ({
  feeds, title, layout = "list", syncable = true, children, className = '', style
}) => {
  return (
    <div className={`tux-feed-status ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-feed-status__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxFeedStatus;
