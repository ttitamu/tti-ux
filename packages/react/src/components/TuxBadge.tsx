/**
 * TuxBadge — TTI-flavored badge and tag component.
 * React port of app/components/TuxBadge.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-badge.css";

export type TuxBadgeTier = "public" | "internal" | "sensitive" | "restricted";
export type TuxBadgeStatus =
  | "running"
  | "completed"
  | "failed"
  | "queued"
  | "paused"
  | "cancelled"
  | "published"
  | "draft"
  | "expired"
  | "verified";

export type TuxBadgeTone =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "danger"
  | "brand"
  | "neutral"
  | "muted"
  | "custom";

export type TuxBadgeKind = "tag" | "count" | "default";
export type TuxBadgeVariant = "solid" | "soft" | "outline" | "subtle" | "bold";
export type TuxBadgeSize = "xs" | "sm" | "md" | "lg";

export interface TuxBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tier?: TuxBadgeTier;
  status?: TuxBadgeStatus;
  tone?: TuxBadgeTone;
  kind?: TuxBadgeKind;
  variant?: TuxBadgeVariant;
  size?: TuxBadgeSize;
  bold?: boolean;
  dot?: boolean;
  icon?: ReactNode;
  count?: number | string;
  label?: string;
  uppercase?: boolean;
  /**
   * Multi-channel shape encoding (WCAG 2.2 AAA / CVD accessibility).
   * Renders distinct geometric micro-glyphs for colorblind accessibility.
   */
  glyph?: boolean;
}

const TIER_COLOR: Record<TuxBadgeTier, TuxBadgeTone> = {
  public: "info",
  internal: "neutral",
  sensitive: "brand",
  restricted: "brand",
};

const STATUS_COLOR: Record<TuxBadgeStatus, TuxBadgeTone> = {
  completed: "success",
  running: "warning",
  failed: "error",
  queued: "neutral",
  paused: "warning",
  cancelled: "neutral",
  published: "success",
  draft: "neutral",
  expired: "error",
  verified: "brand",
};

export const TuxBadge = forwardRef<HTMLSpanElement, TuxBadgeProps>(
  function TuxBadge(
    {
      tier,
      status,
      tone,
      kind = "default",
      variant = "subtle",
      size = "sm",
      bold = false,
      dot = false,
      glyph = false,
      icon,
      count,
      label,
      uppercase = false,
      className = "",
      children,
      ...restProps
    },
    ref,
  ) {
    // Resolve tone
    let resolvedTone: TuxBadgeTone = "neutral";
    if (tier) resolvedTone = TIER_COLOR[tier];
    else if (status) resolvedTone = STATUS_COLOR[status];
    else if (tone) resolvedTone = tone;
    else if (kind === "count") resolvedTone = "neutral";

    // Resolve displayed text
    const displayText = label ?? children ?? (status || tier || (count !== undefined ? String(count) : ""));

    const isBold = bold || variant === "bold";
    const resolvedVariant = variant === "bold" ? "solid" : variant;

    const classes = [
      "tux-badge",
      `tux-badge--${resolvedTone}`,
      `tux-badge--${resolvedVariant}`,
      `tux-badge--${size}`,
      isBold ? "tux-badge--bold" : "",
      kind === "tag" ? "tux-badge--tag" : "",
      uppercase ? "uppercase" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...restProps}>
        {icon && <span className="tux-badge__icon" aria-hidden="true">{icon}</span>}
        {!icon && glyph && (
          <span className="tux-badge__glyph" aria-hidden="true">
            {resolvedTone === "success" && (
              <svg viewBox="0 0 16 16" width="12" height="12">
                <circle cx={8} cy={8} r={7} fill="currentColor" opacity="0.2" />
                <circle cx={8} cy={8} r={7} fill="none" stroke="currentColor" strokeWidth={1.5} />
                <path d="M4.5 8.2 L6.8 10.5 L11.5 5.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {resolvedTone === "warning" && (
              <svg viewBox="0 0 16 16" width="12" height="12">
                <path d="M8 1.5 L15 14.5 H1 Z" fill="currentColor" opacity="0.2" />
                <path d="M8 1.5 L15 14.5 H1 Z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
                <path d="M8 5.5 V9.5 M8 12 V12.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            )}
            {(resolvedTone === "error" || resolvedTone === "danger") && (
              <svg viewBox="0 0 16 16" width="12" height="12">
                <polygon points="5 1 11 1 15 5 15 11 11 15 5 15 1 11 1 5" fill="currentColor" opacity="0.2" />
                <polygon points="5 1 11 1 15 5 15 11 11 15 5 15 1 11 1 5" fill="none" stroke="currentColor" strokeWidth={1.5} />
                <path d="M5.5 5.5 L10.5 10.5 M10.5 5.5 L5.5 10.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            )}
            {resolvedTone === "info" && (
              <svg viewBox="0 0 16 16" width="12" height="12">
                <circle cx={8} cy={8} r={7} fill="currentColor" opacity="0.2" />
                <circle cx={8} cy={8} r={7} fill="none" stroke="currentColor" strokeWidth={1.5} />
                <path d="M8 4.5 V5 M8 7.5 V11.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            )}
            {resolvedTone === "brand" && (
              <svg viewBox="0 0 16 16" width="12" height="12">
                <polygon points="8 1.5 14.5 8 8 14.5 1.5 8" fill="currentColor" opacity="0.2" />
                <polygon points="8 1.5 14.5 8 8 14.5 1.5 8" fill="none" stroke="currentColor" strokeWidth={1.5} />
                <path d="M8 5.5 V10.5 M5.5 8 H10.5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
              </svg>
            )}
            {(resolvedTone === "neutral" || resolvedTone === "muted" || resolvedTone === "custom") && (
              <svg viewBox="0 0 16 16" width="12" height="12">
                <rect x={2} y={2} width={12} height={12} rx={2} fill="currentColor" opacity="0.2" />
                <rect x={2} y={2} width={12} height={12} rx={2} fill="none" stroke="currentColor" strokeWidth={1.5} />
                <path d="M5 8 H11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            )}
          </span>
        )}
        {!icon && !glyph && dot && <span className="tux-badge__dot" aria-hidden="true" />}
        <span className="tux-badge__content">{displayText}</span>
      </span>
    );
  },
);
