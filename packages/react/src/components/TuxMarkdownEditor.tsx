/**
 * TuxMarkdownEditor — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxMarkdownEditorProps {
  modelValue?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  preview?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxMarkdownEditor: React.FC<TuxMarkdownEditorProps> = ({
  modelValue = "", rows = 12, minLength, maxLength, placeholder = "Write in markdown — ⌘B bold, ⌘I italic, ⌘K link", preview = true, disabled = false, ariaLabel = "Markdown editor", children, className = '', style
}) => {
  return (
    <div className={`tux-markdown-editor ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxMarkdownEditor;
