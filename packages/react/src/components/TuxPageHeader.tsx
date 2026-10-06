/**
 * TuxPageHeader — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPageHeaderProps {
  eyebrow??: string;
  title?: string;
  level??: "1" | "2";
  tone??: "plain" | "neutral" | "maroon";
  rhythm??: "compact" | "hero";
  variant??: "default" | "bold" | "elegant";
  children?: React.ReactNode;
  className?: string;
}

export const TuxPageHeader: React.FC<TuxPageHeaderProps> = ({
  eyebrow = "undefined", title, level = 1, tone = plain, rhythm = compact, variant = default, children, className = ''
}) => {
  return (
    <header className={`tux-page-header ${className}`.trim()}>
      {children}
    </header>
  );
};

export default TuxPageHeader;
