/**
 * TuxSpectrumFacts — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSpectrumFactsProps {
  title?: string;
  subtitle?: string;
  items?: string;
  tone?: "dark" | "light";
  showTopRibbon?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSpectrumFacts: React.FC<TuxSpectrumFactsProps> = ({
  title = "QUICK FACTS", subtitle = "", items, tone = "dark", showTopRibbon = true, children, className = '', style
}) => {
  return (
    <section className={`tux-spectrum-facts ${className}`.trim()} data-tone={tone} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-spectrum-facts__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-spectrum-facts__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </section>
  );
};

export default TuxSpectrumFacts;
