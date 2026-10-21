/**
 * TuxAbstract — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxAbstractProps {
  background?: string;
  methods?: string;
  results?: string;
  conclusion?: string;
  keywords?: string;
  variant?: "structured" | "prose";
  level?: number;
  plainSummary?: string;
  policyTakeaways?: string;
  doi?: string;
  projectNumber?: string;
  citation?: string;
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxAbstract: React.FC<TuxAbstractProps> = ({
  background, methods, results, conclusion, keywords, variant = "structured", level = 4, plainSummary, policyTakeaways, doi, projectNumber, citation, division, children, className = '', style
}) => {
  return (
    <section className={`tux-abstract ${className}`.trim()} data-variant={variant} style={style}>
      {children}
    </section>
  );
};

export default TuxAbstract;
