/**
 * TuxLab — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxLabProps {
  name: string;
  summary?: string;
  logo?: string;
  projectsCount?: number;
  peopleCount?: number;
  location?: string;
  leaders?: string;
  focus?: string;
  to?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxLab: React.FC<TuxLabProps> = ({
  name, summary, logo, projectsCount, peopleCount, location, leaders, focus, to, children, className = '', style
}) => {
  return (
    <article className={`tux-lab ${className}`.trim()} style={style}>
      {name !== undefined && String(name) !== "" && <div className="tux-lab__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(name)}</div>}
      {summary !== undefined && String(summary) !== "" && <div className="tux-lab__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(summary)}</div>}
      {children}
    </article>
  );
};

export default TuxLab;
