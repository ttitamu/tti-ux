/**
 * TuxDiagram — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxDiagramProps {
  code: string;
  caption?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxDiagram: React.FC<TuxDiagramProps> = ({
  code, caption, eyebrow, children, className = '', style
}) => {
  return (
    <figure className={`tux-diagram ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-diagram__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {caption !== undefined && String(caption) !== "" && <div className="tux-diagram__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(caption)}</div>}
      {children}
    </figure>
  );
};

export default TuxDiagram;
