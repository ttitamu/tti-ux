/**
 * TuxChatMessage — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChatMessageProps {
  role?: string;
  author: string;
  timestamp?: string;
  meta?: string;
  initials?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChatMessage: React.FC<TuxChatMessageProps> = ({
  role = "user", author, timestamp, meta, initials, children, className = '', style
}) => {
  return (
    <article className={`tux-chat-message ${className}`.trim()} style={style}>
      {children}
    </article>
  );
};

export default TuxChatMessage;
