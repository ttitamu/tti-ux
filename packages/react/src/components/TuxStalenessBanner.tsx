/**
 * TuxStalenessBanner — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxStalenessBannerProps {
  stale??: boolean;
  verifiedUntil??: "Date" | "string" | "null";
  lastVerified??: "Date" | "string" | "null";
  reviewCadenceDays??: number;
  owner??: string;
  pageId??: string;
  dismissable??: boolean;
  showVerifiedBadge??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxStalenessBanner: React.FC<TuxStalenessBannerProps> = ({
  stale = false, verifiedUntil = undefined, lastVerified = undefined, reviewCadenceDays = 90, owner = "undefined", pageId = "undefined", dismissable = true, showVerifiedBadge = false, children, className = ''
}) => {
  return (
    <div className={`tux-staleness-banner ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxStalenessBanner;
