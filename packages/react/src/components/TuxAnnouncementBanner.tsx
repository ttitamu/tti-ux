/**
 * TuxAnnouncementBanner — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxAnnouncementBannerProps {
  id?: string;
  tone?: string;
  icon?: string;
  eyebrow?: string;
  message?: string;
  action?: string;
  dismissable?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxAnnouncementBanner: React.FC<TuxAnnouncementBannerProps> = ({
  id, tone = "info", icon, eyebrow, message, action, dismissable = true, children, className = ''
}) => {
  return (
    <div className={`tux-announcement-banner ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxAnnouncementBanner;
