/**
 * TuxArtifact — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxArtifactProps {
  title: string;
  meta?: string;
  icon?: string;
  actions?: string;
  busy?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxArtifact: React.FC<TuxArtifactProps> = ({
  title, meta, icon = "lucide:file-code", actions, busy = false, children, className = '', style
}) => {
  return (
    <section className={`tux-artifact ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-artifact__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxArtifact;
