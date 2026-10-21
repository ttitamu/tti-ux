/**
 * TuxConversationList — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxConversationListProps {
  groups: string;
  activeId?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxConversationList: React.FC<TuxConversationListProps> = ({
  groups, activeId, children, className = '', style
}) => {
  return (
    <nav className={`tux-conversation-list ${className}`.trim()} style={style}>
      {children}
    </nav>
  );
};

export default TuxConversationList;
