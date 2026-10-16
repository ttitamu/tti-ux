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
  children?: React.ReactNode;
  className?: string;
}

export const TuxAbstract: React.FC<TuxAbstractProps> = ({
  background, methods, results, conclusion, keywords, variant = "structured", level = 4, children, className = ''
}) => {
  return (
    <section className={`tux-abstract ${className}`.trim()}>
      {children}
    </section>
  );
};

export default TuxAbstract;
