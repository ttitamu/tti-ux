/**
 * TuxSignupFeature — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxSignupFeatureProps {
  title: string;
  eyebrow?: string;
  dek?: string;
  actionLabel?: string;
  placeholder?: string;
  consent?: string;
  modelValue?: string;
  tone?: "neutral" | "maroon" | "gold";
  variant?: "default" | "bold" | "elegant";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxSignupFeature: React.FC<TuxSignupFeatureProps> = ({
  title, eyebrow, dek, actionLabel = "Subscribe", placeholder = "your@email.edu", consent, modelValue, tone = "neutral", variant = "default", children, className = '', style
}) => {
  return (
    <section className={`tux-signup-feature ${className}`.trim()} data-variant={variant} data-tone={tone} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-signup-feature__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-signup-feature__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxSignupFeature;
