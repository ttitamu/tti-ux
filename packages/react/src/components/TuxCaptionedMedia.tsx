/**
 * TuxCaptionedMedia — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCaptionedMediaProps {
  src??: string;
  alt??: string;
  caption??: string;
  credit??: string;
  eyebrow??: string;
  aspect??: "16/9" | "4/3" | "1/1" | "3/4";
  align??: "full" | "wide" | "right";
  tone??: "maroon" | "gold" | "charcoal";
  children?: React.ReactNode;
  className?: string;
}

export const TuxCaptionedMedia: React.FC<TuxCaptionedMediaProps> = ({
  src = "undefined", alt, caption = "undefined", credit = "undefined", eyebrow = "undefined", aspect = 16/9, align = full, tone = maroon, children, className = ''
}) => {
  return (
    <figure className={`tux-captioned-media ${className}`.trim()}>
      {children}
    </figure>
  );
};

export default TuxCaptionedMedia;
