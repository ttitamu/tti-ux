/**
 * TuxMapEmbed — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMapEmbedProps {
  src??: string;
  eyebrow??: string;
  title??: string;
  subtitle??: string;
  source??: string;
  aspect??: "16/9" | "4/3" | "21/9" | "1/1" | "auto";
  height??: number;
  iframeTitle??: string;
  attribution??: boolean;
  skeleton??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxMapEmbed: React.FC<TuxMapEmbedProps> = ({
  src = "undefined", eyebrow = "undefined", title = "undefined", subtitle = "undefined", source = "undefined", aspect = 16/9, height = undefined, iframeTitle = "undefined", attribution = true, skeleton = true, children, className = ''
}) => {
  return (
    <figure className={`tux-map-embed ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxMapEmbed;
