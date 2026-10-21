/**
 * TuxErrorPage — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxErrorPageProps {
  code?: string;
  title?: string;
  lede?: string;
  actions?: string;
  inline?: boolean;
  icon?: string;
  details?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxErrorPage: React.FC<TuxErrorPageProps> = ({
  code = "404", title, lede, actions, inline = false, icon, details, children, className = '', style
}) => {
  return (
    <section className={`tux-error-page ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-error-page__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxErrorPage;
