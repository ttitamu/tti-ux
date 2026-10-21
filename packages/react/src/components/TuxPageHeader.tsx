/**
 * TuxPageHeader — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPageHeaderProps {
  eyebrow?: string;
  title: string;
  level?: number;
  tone?: "plain" | "neutral" | "maroon";
  rhythm?: "compact" | "hero";
  variant?: "default" | "bold" | "elegant";
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxPageHeader: React.FC<TuxPageHeaderProps> = ({
  eyebrow, title, level = 1, tone = "plain", rhythm = "compact", variant = "default", division, children, className = '', style
}) => {
  return (
    <header className={`tux-page-header ${className}`.trim()} data-variant={variant} data-tone={tone} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-page-header__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-page-header__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </header>
  );
};

export default TuxPageHeader;
