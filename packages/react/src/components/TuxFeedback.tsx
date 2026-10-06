/**
 * TuxFeedback — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFeedbackProps {
  pageId??: string;
  title??: string;
  endpoint??: string;
  allowDetails??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxFeedback: React.FC<TuxFeedbackProps> = ({
  pageId, title = "Was", endpoint = "/api/feedback", allowDetails = true, children, className = ''
}) => {
  return (
    <section className={`tux-feedback ${className}`.trim()}>
      {children}
    </section>
  );
};

export default TuxFeedback;
