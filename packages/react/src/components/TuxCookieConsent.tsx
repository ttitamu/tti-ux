/**
 * TuxCookieConsent — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCookieConsentProps {
  storageKey?: string;
  position?: string;
  message?: string;
  privacyHref?: string;
  initiallyExpanded?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCookieConsent: React.FC<TuxCookieConsentProps> = ({
  storageKey = "tux-cookie-consent", position = "bottom-right", message = "We use cookies to keep you signed in, remember your preferences, and understand how the site is used. Necessary cookies are always on.", privacyHref = "/privacy", initiallyExpanded = false, children, className = '', style
}) => {
  return (
    <div className={`tux-cookie-consent ${className}`.trim()} style={style}>
      {message !== undefined && String(message) !== "" && <div className="tux-cookie-consent__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(message)}</div>}
      {children}
    </div>
  );
};

export default TuxCookieConsent;
