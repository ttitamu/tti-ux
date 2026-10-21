/**
 * TuxCapabilityCluster — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCapabilityClusterProps {
  title?: string;
  kicker?: string;
  subtitle?: string;
  capabilities?: string;
  columns?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCapabilityCluster: React.FC<TuxCapabilityClusterProps> = ({
  title, kicker, subtitle, capabilities, columns = 3, children, className = '', style
}) => {
  return (
    <section className={`tux-capability-cluster ${className}`.trim()} style={style}>
      {kicker !== undefined && String(kicker) !== "" && <div className="tux-capability-cluster__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(kicker)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-capability-cluster__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {subtitle !== undefined && String(subtitle) !== "" && <div className="tux-capability-cluster__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(subtitle)}</div>}
      {children}
    </section>
  );
};

export default TuxCapabilityCluster;
