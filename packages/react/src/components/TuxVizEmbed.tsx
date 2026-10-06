/**
 * TuxVizEmbed — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxVizEmbedProps {
  src?: string;
  provider??: string;
  title?: string;
  eyebrow??: string;
  ratio??: string;
  sandbox??: string;
  referrerpolicy??: string;
  openInNew??: boolean;
  posterSrc??: string;
  posterAlt??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxVizEmbed: React.FC<TuxVizEmbedProps> = ({
  src, provider = "generic", title, eyebrow = "undefined", ratio = "16/9", sandbox = "undefined", referrerpolicy = "strict-origin-when-cross-origin", openInNew = true, posterSrc = "undefined", posterAlt, children, className = ''
}) => {
  return (
    <figure className={`tux-viz-embed ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxVizEmbed;
