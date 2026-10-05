/**
 * TuxCommentThread — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCommentThreadProps {
  modelValue?: string;
  authors?: string;
  currentUser?: string;
  hideResolved??: boolean;
  size??: "sm" | "md";
  children?: React.ReactNode;
  className?: string;
}

export const TuxCommentThread: React.FC<TuxCommentThreadProps> = ({
  modelValue, authors, currentUser, hideResolved = true, size = md, children, className = ''
}) => {
  return (
    <div className={`tux-comment-thread ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxCommentThread;
