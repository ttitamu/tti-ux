/**
 * TuxChatBubble — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxChatBubbleProps {
  mode?: "bubble" | "trigger";
  role?: "assistant" | "user" | "system";
  title?: string;
  subtitle?: string;
  state?: "idle" | "thinking" | "attention";
  teaser?: string;
  tail?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "none";
  dismissible?: boolean;
  open?: boolean;
  suggestions?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxChatBubble: React.FC<TuxChatBubbleProps> = ({
  mode = "bubble", role = "assistant", title = "Assistant", subtitle = "Institutional Assistant", state = "idle", teaser, tail = "none", dismissible = false, open = true, suggestions, children, className = '', style
}) => {
  return (
    <div className={`tux-chat-bubble ${className}`.trim()} data-mode={mode} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-chat-bubble__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-chat-bubble__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </div>
  );
};

export default TuxChatBubble;
