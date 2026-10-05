/**
 * TuxContactCard — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxContactCardProps {
  name?: string;
  role??: string;
  affiliation??: string;
  credentials??: string;
  image??: string;
  initial??: string;
  tone??: "maroon" | "gold" | "navy";
  contacts??: string;
  layout??: "vertical" | "horizontal";
  children?: React.ReactNode;
  className?: string;
}

export const TuxContactCard: React.FC<TuxContactCardProps> = ({
  name, role = "undefined", affiliation = "undefined", credentials = "undefined", image = "undefined", initial = "undefined", tone = maroon, contacts = "()", layout = vertical, children, className = ''
}) => {
  return (
    <article className={`tux-contact-card ${className}`.trim()}>
      {children}
    </article>
  );
};

export default TuxContactCard;
