/**
 * TuxStatus — operational state chip (ADR-0013 / ADR-0014).
 * React port of app/components/TuxStatus.vue.
 */

import React, { forwardRef, type HTMLAttributes } from "react";
import "./tux-status.css";

export const TUX_OPS_STATES = [
  "ok",
  "warning",
  "unknown",
  "critical",
  "pending",
  "maintenance",
] as const;

export type TuxOpsState = (typeof TUX_OPS_STATES)[number];
export type TuxOpsKind = "chip" | "text" | "dot";

const LABELS: Record<TuxOpsState, string> = {
  ok: "OK",
  warning: "WARNING",
  unknown: "UNKNOWN",
  critical: "CRITICAL",
  pending: "PENDING",
  maintenance: "MAINT",
};

export interface TuxStatusProps extends HTMLAttributes<HTMLSpanElement> {
  state: TuxOpsState;
  kind?: TuxOpsKind;
  /** Still a problem, but it has an owner — sinks the chip. */
  acked?: boolean;
  /** Override the default uppercase label. Ignored for `dot`. */
  label?: string;
  /**
   * Multi-channel shape encoding (WCAG 2.2 AAA / CVD accessibility).
   * Automatically enabled (`true`) for `kind="dot"`.
   * When enabled on `kind="chip"`, renders leading shape glyph next to text.
   */
  glyph?: boolean;
}

export const TuxStatus = forwardRef<HTMLSpanElement, TuxStatusProps>(
  function TuxStatus(
    {
      state,
      kind = "chip",
      acked = false,
      label,
      glyph,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const text = label ?? LABELS[state];
    const showGlyph = glyph !== undefined ? glyph : kind === "dot";

    const classes = [
      "tux-status",
      `tux-status--${state}`,
      kind !== "chip" ? `tux-status--${kind}` : "",
      acked ? "tux-status--acked" : "",
      showGlyph ? "tux-status--has-glyph" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        role={kind === "dot" ? "status" : undefined}
        aria-label={kind === "dot" ? text : undefined}
        {...restProps}
      >
        {showGlyph && (
          <svg
            className={`tux-status__glyph ${
              kind === "dot" ? "tux-status__glyph--dot" : "tux-status__glyph--inline"
            }`}
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            {state === "ok" && (
              <>
                <circle cx={8} cy={8} r={7} className="tux-status__shape-bg" />
                <path
                  d="M4.75 8.25 L6.75 10.25 L11.25 5.75"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="tux-status__shape-fg"
                />
              </>
            )}
            {state === "warning" && (
              <>
                <path d="M8 1.75 L15 14.25 H1 Z" className="tux-status__shape-bg" />
                <path
                  d="M8 5.75 V9.5 M8 12 V12.5"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  className="tux-status__shape-fg tux-status__shape-fg--dark"
                />
              </>
            )}
            {state === "critical" && (
              <>
                <polygon
                  points="5.25 1 10.75 1 15 5.25 15 10.75 10.75 15 5.25 15 1 10.75 1 5.25"
                  className="tux-status__shape-bg"
                />
                <path
                  d="M5.5 5.5 L10.5 10.5 M10.5 5.5 L5.5 10.5"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="tux-status__shape-fg"
                />
              </>
            )}
            {state === "maintenance" && (
              <>
                <rect
                  x={1.5}
                  y={1.5}
                  width={13}
                  height={13}
                  rx={2.5}
                  className="tux-status__shape-bg"
                />
                <path
                  d="M4.5 8 H11.5"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="tux-status__shape-fg"
                />
              </>
            )}
            {state === "pending" && (
              <>
                <circle cx={8} cy={8} r={7} className="tux-status__shape-bg" />
                <path
                  d="M8 4.5 V8 H11"
                  fill="none"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="tux-status__shape-fg"
                />
              </>
            )}
            {state === "unknown" && (
              <>
                <polygon
                  points="8 1.5 14.5 8 8 14.5 1.5 8"
                  className="tux-status__shape-bg"
                />
                <path
                  d="M6.5 6 C6.5 5 7.2 4.5 8 4.5 C8.8 4.5 9.5 5 9.5 5.8 C9.5 6.6 8.8 7.2 8 7.7 V9 M8 11.25 V11.75"
                  fill="none"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="tux-status__shape-fg"
                />
              </>
            )}
          </svg>
        )}
        {kind !== "dot" && text}
      </span>
    );
  },
);
