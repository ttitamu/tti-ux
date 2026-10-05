/**
 * TuxSlideover — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSlideoverProps {
  side??: "left" | "right" | "bottom";
  size??: string;
  title??: string;
  eyebrow??: string;
  showClose??: boolean;
  closeOnBackdrop??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxSlideover: React.FC<TuxSlideoverProps> = ({
  side = right, size = "undefined", title = "undefined", eyebrow = "undefined", showClose = true, closeOnBackdrop = true, children, className = ''
}) => {
  return (
    <dialog className={`tux-slideover ${className}`.trim()}>
      {children}
    </dialog>
  );
};

export default TuxSlideover;
