/**
 * TuxStalenessBanner — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxStalenessBannerProps {
  stale?: boolean;
  verifiedUntil?: string;
  lastVerified?: string;
  reviewCadenceDays?: number;
  owner?: string;
  pageId?: string;
  dismissable?: boolean;
  showVerifiedBadge?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxStalenessBanner: React.FC<TuxStalenessBannerProps> = ({
  stale = false, verifiedUntil, lastVerified, reviewCadenceDays = 90, owner, pageId, dismissable = true, showVerifiedBadge = false, children, className = ''
}) => {
  return (
    <div className={`tux-staleness-banner ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxStalenessBanner;
