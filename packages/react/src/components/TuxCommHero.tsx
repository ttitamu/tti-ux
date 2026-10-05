/**
 * TuxCommHero — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCommHeroProps {
  eyebrow??: string;
  title?: string;
  accentTitle??: string;
  lead??: string;
  primaryActionText??: string;
  primaryActionTo??: string;
  primaryActionHref??: string;
  secondaryActionText??: string;
  secondaryActionTo??: string;
  secondaryActionHref??: string;
  imageSrc??: string;
  imageAlt??: string;
  imageBadge??: string;
  chamfer??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxCommHero: React.FC<TuxCommHeroProps> = ({
  eyebrow = "TEXAS", title, accentTitle, lead, primaryActionText, primaryActionTo, primaryActionHref, secondaryActionText, secondaryActionTo, secondaryActionHref, imageSrc, imageAlt = "TTI", imageBadge, chamfer = true, children, className = ''
}) => {
  return (
    <section className={`tux-comm-hero ${className}`.trim()}>
      {children}
    </section>
  );
};

export default TuxCommHero;
