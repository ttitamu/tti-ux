/**
 * TuxMcpEmbed — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMcpEmbedProps {
  appName?: string;
  appIcon??: string;
  appIconUrl??: string;
  source??: string;
  loading??: boolean;
  collapsible??: boolean;
  expandable??: boolean;
  closable??: boolean;
  collapsed??: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxMcpEmbed: React.FC<TuxMcpEmbedProps> = ({
  appName, appIcon = "lucide:plug", appIconUrl = "undefined", source = "undefined", loading = false, collapsible = true, expandable = true, closable = true, collapsed = false, children, className = ''
}) => {
  return (
    <section className={`tux-mcp-embed ${className}`.trim()}>
      {children}
    </section>
  );
};

export default TuxMcpEmbed;
