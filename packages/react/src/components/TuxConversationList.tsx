/**
 * TuxConversationList — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxConversationListProps {
  groups?: string;
  activeId??: "string" | "null";
  children?: React.ReactNode;
  className?: string;
}

export const TuxConversationList: React.FC<TuxConversationListProps> = ({
  groups, activeId = null, children, className = ''
}) => {
  return (
    <nav className={`tux-conversation-list ${className}`.trim()}>
      {children}
    </nav>
  );
};

export default TuxConversationList;
