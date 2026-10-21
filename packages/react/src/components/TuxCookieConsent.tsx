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
}

export const TuxCookieConsent: React.FC<TuxCookieConsentProps> = ({
  storageKey = "tux-cookie-consent", position = "bottom-right", message = "We use cookies to keep you signed in, remember your preferences, and understand how the site is used. Necessary cookies are always on.", privacyHref = "/privacy", initiallyExpanded = false, children, className = ''
}) => {
  return (
    <div className={`tux-cookie-consent ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxCookieConsent;
