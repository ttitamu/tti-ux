/**
 * TuxSlideover — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSlideoverProps {
  side?: "left" | "right" | "bottom";
  size?: string;
  title?: string;
  eyebrow?: string;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSlideover: React.FC<TuxSlideoverProps> = ({
  side = "right", size, title, eyebrow, showClose = true, closeOnBackdrop = true, children, className = '', style
}) => {
  return (
    <dialog className={`tux-slideover ${className}`.trim()} data-size={size} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-slideover__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-slideover__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </dialog>
  );
};

export default TuxSlideover;
