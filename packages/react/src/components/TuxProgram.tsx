/**
 * TuxProgram — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxProgramProps {
  name: string;
  eyebrow?: string;
  summary?: string;
  hero?: string;
  leads?: string;
  funders?: string;
  metrics?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxProgram: React.FC<TuxProgramProps> = ({
  name, eyebrow, summary, hero, leads, funders, metrics, children, className = '', style
}) => {
  return (
    <article className={`tux-program ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-program__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {name !== undefined && String(name) !== "" && <div className="tux-program__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(name)}</div>}
      {summary !== undefined && String(summary) !== "" && <div className="tux-program__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(summary)}</div>}
      {children}
    </article>
  );
};

export default TuxProgram;
