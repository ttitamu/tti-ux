/**
 * TuxDiagram — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxDiagramProps {
  code?: string;
  caption??: string;
  eyebrow??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxDiagram: React.FC<TuxDiagramProps> = ({
  code, caption = "undefined", eyebrow = "undefined", children, className = ''
}) => {
  return (
    <figure className={`tux-diagram ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxDiagram;
