/**
 * TuxMediaSlab — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMediaSlabProps {
  src??: string;
  alt??: string;
  eyebrow??: string;
  title?: string;
  dek??: string;
  layout??: "overlay" | "split";
  imageSide??: "left" | "right";
  height??: "tall" | "standard" | "short";
  tone??: "maroon" | "gold" | "charcoal";
  children?: React.ReactNode;
  className?: string;
}

export const TuxMediaSlab: React.FC<TuxMediaSlabProps> = ({
  src = "undefined", alt, eyebrow = "undefined", title, dek = "undefined", layout = overlay, imageSide = right, height = standard, tone = maroon, children, className = ''
}) => {
  return (
    <section className={`tux-media-slab ${className}`.trim()}>
      {children}
    </section>
  );
};

export default TuxMediaSlab;
