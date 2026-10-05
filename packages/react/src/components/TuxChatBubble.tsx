/**
 * TuxChatBubble — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChatBubbleProps {
  mode??: "bubble" | "trigger";
  role??: "assistant" | "user" | "system";
  title??: string;
  subtitle??: string;
  state??: "idle" | "thinking" | "attention";
  teaser??: string;
  tail??: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "none";
  dismissible??: boolean;
  open??: boolean;
  suggestions??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxChatBubble: React.FC<TuxChatBubbleProps> = ({
  mode = bubble, role = assistant, title = "Assistant", subtitle = "Institutional", state = idle, teaser = "undefined", tail = none, dismissible = false, open = true, suggestions = "()", children, className = ''
}) => {
  return (
    <div className={`tux-chat-bubble ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxChatBubble;
