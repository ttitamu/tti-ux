/**
 * TuxResearcher — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxResearcherProps {
  name: string;
  role: string;
  portrait?: string;
  center?: string;
  orcid?: string;
  email?: string;
  bio?: string;
  projects?: string;
  metrics?: string;
  layout?: "default" | "horizontal" | "inline";
  to?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxResearcher: React.FC<TuxResearcherProps> = ({
  name, role, portrait, center, orcid, email, bio, projects, metrics, layout = "default", to, children, className = '', style
}) => {
  return (
    <article className={`tux-researcher ${className}`.trim()} style={style}>
      {name !== undefined && String(name) !== "" && <div className="tux-researcher__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(name)}</div>}
      {children}
    </article>
  );
};

export default TuxResearcher;
