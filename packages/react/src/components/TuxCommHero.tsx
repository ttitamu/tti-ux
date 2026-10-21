/**
 * TuxCommHero — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCommHeroProps {
  eyebrow?: string;
  title: string;
  accentTitle?: string;
  lead?: string;
  primaryActionText?: string;
  primaryActionTo?: string;
  primaryActionHref?: string;
  secondaryActionText?: string;
  secondaryActionTo?: string;
  secondaryActionHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageBadge?: string;
  chamfer?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCommHero: React.FC<TuxCommHeroProps> = ({
  eyebrow, title, accentTitle, lead, primaryActionText, primaryActionTo, primaryActionHref, secondaryActionText, secondaryActionTo, secondaryActionHref, imageSrc, imageAlt, imageBadge, chamfer = true, children, className = '', style
}) => {
  return (
    <section className={`tux-comm-hero ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-comm-hero__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-comm-hero__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxCommHero;
