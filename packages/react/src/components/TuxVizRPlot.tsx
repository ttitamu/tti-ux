/**
 * TuxVizRPlot — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxVizRPlotProps {
  src: string;
  kind?: string;
  title: string;
  eyebrow?: string;
  ratio?: string;
  alt?: string;
  src2x?: string;
  source?: string;
  level?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TuxVizRPlot: React.FC<TuxVizRPlotProps> = ({
  src, kind = "image", title, eyebrow, ratio = "16/10", alt = "", src2x, source, level = 3, children, className = ''
}) => {
  return (
    <figure className={`tux-viz-rplot ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxVizRPlot;
