/**
 * TuxFootnote — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxFootnoteProps {
  n?: number;
  text?: string;
  idPrefix??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxFootnote: React.FC<TuxFootnoteProps> = ({
  n, text, idPrefix = "fn", children, className = ''
}) => {
  return (
    <UPopover className={`tux-footnote ${className}`.trim()}>
      {children}
    </UPopover>
  );
};

export default TuxFootnote;
