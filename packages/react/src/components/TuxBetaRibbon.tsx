/**
 * TuxBetaRibbon — environment / lifecycle label that signals
 * "this isn't the production deploy".
 * React port of app/components/TuxBetaRibbon.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-beta-ribbon.css";

export type TuxBetaRibbonVariant = "corner" | "stripe" | "pill";
export type TuxBetaRibbonKind = "preview" | "beta" | "dev";
export type TuxBetaRibbonCorner = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface TuxBetaRibbonProps extends HTMLAttributes<HTMLElement> {
  variant?: TuxBetaRibbonVariant;
  kind?: TuxBetaRibbonKind;
  /** Custom label text. Defaults vary by kind. */
  label?: string;
  /** Where the corner ribbon sits. Only applies to variant="corner". */
  corner?: TuxBetaRibbonCorner;
  /** Stripe message. Only applies to variant="stripe". */
  message?: string;
  children?: ReactNode;
}

const defaultLabel: Record<TuxBetaRibbonKind, string> = {
  preview: "preview",
  beta: "beta",
  dev: "dev",
};

const defaultMessage: Record<TuxBetaRibbonKind, string> = {
  preview: "Preview environment — data may differ from production.",
  beta: "This is a public beta. Feedback welcome at support@tti.tamu.edu.",
  dev: "Non-production environment. Do not enter real research data.",
};

export const TuxBetaRibbon = forwardRef<HTMLElement, TuxBetaRibbonProps>(
  function TuxBetaRibbon(
    {
      variant = "corner",
      kind = "preview",
      label,
      corner = "top-right",
      message,
      children,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const resolvedLabel = label ?? defaultLabel[kind];
    const resolvedMessage = message ?? defaultMessage[kind];

    if (variant === "corner") {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={`tux-beta-corner tux-beta-corner--${corner} tux-beta--${kind} ${className}`.trim()}
          role="note"
          aria-label={`Environment: ${resolvedLabel}`}
          {...(restProps as HTMLAttributes<HTMLDivElement>)}
        >
          <span className="tux-beta-corner__band">{resolvedLabel}</span>
        </div>
      );
    }

    if (variant === "stripe") {
      return (
        <aside
          ref={ref as React.Ref<HTMLElement>}
          className={`tux-beta-stripe tux-beta--${kind} ${className}`.trim()}
          role="note"
          aria-label={`Environment: ${resolvedLabel}`}
          {...(restProps as HTMLAttributes<HTMLElement>)}
        >
          <span className="tux-beta-stripe__pill">{resolvedLabel}</span>
          <span className="tux-beta-stripe__message">
            {children || resolvedMessage}
          </span>
        </aside>
      );
    }

    // variant === "pill"
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={`tux-beta-pill tux-beta--${kind} ${className}`.trim()}
        role="note"
        aria-label={`Status: ${resolvedLabel}`}
        {...(restProps as HTMLAttributes<HTMLSpanElement>)}
      >
        {kind === "dev" && (
          <svg
            className="tux-beta-pill__icon"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
            <path d="M5 21h14" />
            <path d="M21 12h1" />
            <path d="M18.5 4.5 19 4" />
            <path d="M2 12h1" />
            <path d="M12 2v1" />
            <path d="m4.929 4.929.707.707" />
            <path d="M12 12v6" />
          </svg>
        )}
        <span className="tux-beta-pill__dot" aria-hidden="true" />
        {resolvedLabel}
      </span>
    );
  },
);
