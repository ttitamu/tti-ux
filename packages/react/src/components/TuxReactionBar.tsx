/**
 * TuxReactionBar — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxReactionBarProps {
  modelValue?: string;
  reactions?: string;
  counts?: string;
  size?: "sm" | "md";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxReactionBar: React.FC<TuxReactionBarProps> = ({
  modelValue, reactions, counts, size = "md", children, className = '', style
}) => {
  return (
    <div className={`tux-reaction-bar ${className}`.trim()} data-size={size} style={style}>
      {children}
    </div>
  );
};

export default TuxReactionBar;
