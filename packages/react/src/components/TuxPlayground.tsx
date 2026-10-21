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
  style?: React.CSSProperties;
}

export const TuxPlayground: React.FC<TuxPlaygroundProps> = ({
  tag, componentName, controls, presets, title, eyebrow, slotProp, defaultSlotText, selfClosing = false, codeTemplate, source, powerbi, previewPadding = "p-8", enableDeepLinking = true, children, className = '', style
}) => {
  return (
    <div className={`tux-playground ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-playground__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-playground__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </div>
  );
};

export default TuxPlayground;
