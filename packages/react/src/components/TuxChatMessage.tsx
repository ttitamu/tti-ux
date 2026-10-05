/**
 * TuxChatMessage — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChatMessageProps {
  role??: string;
  author?: string;
  timestamp??: string;
  meta??: string;
  initials??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChatMessage: React.FC<TuxChatMessageProps> = ({
  role = "user", author, timestamp = "undefined", meta = "undefined", initials = "undefined", children, className = ''
}) => {
  return (
    <article className={`tux-chat-message ${className}`.trim()}>
      {children}
    </article>
  );
};

export default TuxChatMessage;
