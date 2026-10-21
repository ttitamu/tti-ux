/**
 * TuxCitationExport — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCitationExportProps {
  citation: string;
  label?: string;
  variant?: "ghost" | "outline" | "solid";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCitationExport: React.FC<TuxCitationExportProps> = ({
  citation, label = "Cite", variant = "outline", children, className = '', style
}) => {
  return (
    <div className={`tux-citation-export ${className}`.trim()} data-variant={variant} style={style}>
      {label !== undefined && String(label) !== "" && <div className="tux-citation-export__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(label)}</div>}
      {children}
    </div>
  );
};

export default TuxCitationExport;
