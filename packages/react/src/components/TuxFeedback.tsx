/**
 * TuxFeedback — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFeedbackProps {
  pageId?: string;
  title?: string;
  endpoint?: string;
  allowDetails?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxFeedback: React.FC<TuxFeedbackProps> = ({
  pageId, title, endpoint = "/api/feedback", allowDetails = true, children, className = '', style
}) => {
  return (
    <section className={`tux-feedback ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-feedback__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxFeedback;
