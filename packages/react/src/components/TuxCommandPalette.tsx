/**
 * TuxCommandPalette — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCommandPaletteProps {
  groups?: string;
  placeholder??: string;
  disableHotkey??: boolean;
  hotkey??: string;
  showTabs??: boolean;
  defaultTab??: string;
  children?: React.ReactNode;
  className?: string;
}

export const TuxCommandPalette: React.FC<TuxCommandPaletteProps> = ({
  groups, placeholder = "Type", disableHotkey = false, hotkey = "k", showTabs = true, defaultTab = "all", children, className = ''
}) => {
  return (
    <dialog className={`tux-command-palette ${className}`.trim()}>
      {children}
    </dialog>
  );
};

export default TuxCommandPalette;
