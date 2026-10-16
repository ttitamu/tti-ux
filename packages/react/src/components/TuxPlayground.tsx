/**
 * TuxPlayground — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxPlaygroundProps {
  tag?: string;
  componentName?: string;
  controls: string;
  presets?: string;
  title?: string;
  eyebrow?: string;
  slotProp?: string;
  defaultSlotText?: string;
  selfClosing?: boolean;
  codeTemplate?: string;
  source?: string;
  powerbi?: string;
  previewPadding?: string;
  enableDeepLinking?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxPlayground: React.FC<TuxPlaygroundProps> = ({
  tag, componentName, controls, presets, title, eyebrow, slotProp, defaultSlotText, selfClosing = false, codeTemplate, source, powerbi, previewPadding = "p-8", enableDeepLinking = true, children, className = ''
}) => {
  return (
    <div className={`tux-playground ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TuxPlayground;
