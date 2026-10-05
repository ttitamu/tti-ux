/**
 * TuxShortcutsHelp — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxShortcutsHelpProps {
  groups?: string;
  sequenceSeparator??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxShortcutsHelp: React.FC<TuxShortcutsHelpProps> = ({
  groups, sequenceSeparator = "then", children, className = ''
}) => {
  return (
    <dialog className={`tux-shortcuts-help ${className}`.trim()}>
      {children}
    </dialog>
  );
};

export default TuxShortcutsHelp;
