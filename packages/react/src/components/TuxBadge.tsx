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
        {dot && <span className="tux-badge__dot" aria-hidden="true" />}
        {icon && <span className="tux-badge__icon" aria-hidden="true">{icon}</span>}
        <span className="tux-badge__content">{displayText}</span>
      </span>
    );
  },
);
