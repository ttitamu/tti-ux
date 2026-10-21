/**
 * TuxContactCard — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxContactCardProps {
  name: string;
  role?: string;
  affiliation?: string;
  credentials?: string;
  image?: string;
  initial?: string;
  tone?: "maroon" | "gold" | "navy";
  contacts?: string;
  layout?: "vertical" | "horizontal";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxContactCard: React.FC<TuxContactCardProps> = ({
  name, role, affiliation, credentials, image, initial, tone = "maroon", contacts, layout = "vertical", children, className = '', style
}) => {
  return (
    <article className={`tux-contact-card ${className}`.trim()} data-tone={tone} style={style}>
      {name !== undefined && String(name) !== "" && <div className="tux-contact-card__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(name)}</div>}
      {children}
    </article>
  );
};

export default TuxContactCard;
