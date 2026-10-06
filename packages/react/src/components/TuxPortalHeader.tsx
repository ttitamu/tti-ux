/**
 * TuxPortalHeader — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPortalHeaderProps {
  mode??: "comm" | "intranet";
  agencyName??: string;
  agencyUrl??: string;
  homeUrl??: string;
  portalTitle??: string;
  portalBadge??: string;
  portalBadgeVariant??: "neutral" | "maroon" | "gold" | "info" | "success";
  utilityLinks??: string;
  showSearch??: boolean;
  showSpectrumRibbon??: boolean;
  intranetApps??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxPortalHeader: React.FC<TuxPortalHeaderProps> = ({
  mode = comm, agencyName = "Texas", agencyUrl = "https://tti.tamu.edu", homeUrl = "/", portalTitle, portalBadge, portalBadgeVariant = gold, utilityLinks = "()", showSearch = true, showSpectrumRibbon = false, intranetApps = "()", children, className = ''
}) => {
  return (
    <header className={`tux-portal-header ${className}`.trim()}>
      {children}
    </header>
  );
};

export default TuxPortalHeader;
