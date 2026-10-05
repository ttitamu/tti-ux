/**
 * TuxCookieConsent — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCookieConsentProps {
  storageKey??: string;
  position??: string;
  message??: string;
  privacyHref??: string;
  initiallyExpanded??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxCookieConsent: React.FC<TuxCookieConsentProps> = ({
  storageKey = "tux-cookie-consent", position = "bottom-right", message = "We", privacyHref = "/privacy", initiallyExpanded = false, children, className = ''
}) => {
  return (
    <Teleport className={`tux-cookie-consent ${className}`.trim()}>
      {children}
    </Teleport>
  );
};

export default TuxCookieConsent;
