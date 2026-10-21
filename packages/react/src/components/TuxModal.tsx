/**
 * TuxModal — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxModalProps {
  open?: boolean;
  title?: string;
  eyebrow?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  variant?: "standard" | "sheet" | "auto";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxModal: React.FC<TuxModalProps> = ({
  open = false, title, eyebrow, size, variant = "standard", children, className = '', style
}) => {
  return (
    <div className={`tux-modal ${className}`.trim()} data-variant={variant} data-size={size} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-modal__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-modal__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxModal;
