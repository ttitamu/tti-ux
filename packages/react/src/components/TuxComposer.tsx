/**
 * TuxComposer — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxComposerProps {
  modelValue?: string;
  placeholder?: string;
  models?: string;
  modelId?: string;
  maxLength?: number;
  hint?: string;
  hideAttach?: boolean;
  attachLabel?: string;
  attachIcon?: string;
  cancelable?: boolean;
  cancelLabel?: string;
  rows?: string;
  variant?: "default" | "floating" | "compact";
  autofocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxComposer: React.FC<TuxComposerProps> = ({
  modelValue = "", placeholder = "Ask about any ingested corpus…", models, modelId, maxLength = 32000, hint = "⌘↵ send · / corpus to switch context · shift↵ newline", hideAttach = false, attachLabel = "Attach corpus", attachIcon = "lucide:plus", cancelable = false, cancelLabel = "Cancel", rows = "2", variant = "default", autofocus = false, children, className = '', style
}) => {
  return (
    <div className={`tux-composer ${className}`.trim()} data-variant={variant} style={style}>
      {children}
    </div>
  );
};

export default TuxComposer;
