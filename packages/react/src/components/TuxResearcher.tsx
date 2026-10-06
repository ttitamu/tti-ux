/**
 * TuxResearcher — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxResearcherProps {
  name?: string;
  role?: string;
  portrait??: string;
  center??: string;
  orcid??: string;
  email??: string;
  bio??: string;
  projects??: string;
  metrics??: string;
  layout??: "default" | "horizontal" | "inline";
  to??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxResearcher: React.FC<TuxResearcherProps> = ({
  name, role, portrait = "undefined", center = "undefined", orcid = "undefined", email = "undefined", bio = "undefined", projects = "undefined", metrics = "undefined", layout = default, to = "undefined", children, className = ''
}) => {
  return (
    <article className={`tux-researcher ${className}`.trim()}>
      {children}
    </article>
  );
};

export default TuxResearcher;
