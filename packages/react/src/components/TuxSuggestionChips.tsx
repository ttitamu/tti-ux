/**
 * TuxSuggestionChips — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSuggestionChipsProps {
  items: string;
  label?: string;
  ariaLabel?: string;
  noArrow?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSuggestionChips: React.FC<TuxSuggestionChipsProps> = ({
  items, label, ariaLabel, noArrow = false, children, className = '', style
}) => {
  return (
    <section className={`tux-suggestion-chips ${className}`.trim()} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-suggestion-chips__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </section>
  );
};

export default TuxSuggestionChips;
