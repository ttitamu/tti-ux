/**
 * TuxRecordMatcher — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxRecordMatcherProps {
  items: string;
  allowRuleCreation?: boolean;
  ruleCheckboxLabel?: string;
  acceptLabel?: string;
  dismissLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxRecordMatcher: React.FC<TuxRecordMatcherProps> = ({
  items, allowRuleCreation = true, ruleCheckboxLabel = "Remember this mapping rule for future records", acceptLabel = "Confirm Match", dismissLabel = "Defer", children, className = '', style
}) => {
  return (
    <div className={`tux-record-matcher ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

export default TuxRecordMatcher;
