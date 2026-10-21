/**
 * TuxCodeMaroon — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCodeMaroonProps {
  active?: boolean;
  tone?: "error" | "warning" | "info";
  title?: string;
  message?: string;
  detailsUrl?: string;
  detailsLabel?: string;
  dismissible?: boolean;
  modelValue?: boolean;
  sticky?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCodeMaroon: React.FC<TuxCodeMaroonProps> = ({
  active = false, tone = "error", title, message, detailsUrl = "https://tti.tamu.edu/emergency/", detailsLabel, dismissible = false, modelValue = false, sticky = false, children, className = '', style
}) => {
  return (
    <div className={`tux-code-maroon ${className}`.trim()} data-tone={tone} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-code-maroon__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {message !== undefined && String(message) !== "" && <div className="tux-code-maroon__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(message)}</div>}
      {children}
    </div>
  );
};

export default TuxCodeMaroon;
