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
  style?: React.CSSProperties;
}

export const TuxAnnouncementBanner: React.FC<TuxAnnouncementBannerProps> = ({
  id, tone = "info", icon, eyebrow, message, action, dismissable = true, children, className = '', style
}) => {
  return (
    <div className={`tux-announcement-banner ${className}`.trim()} data-tone={tone} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-announcement-banner__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {message !== undefined && String(message) !== "" && <div className="tux-announcement-banner__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(message)}</div>}
      {children}
    </div>
  );
};

export default TuxAnnouncementBanner;
