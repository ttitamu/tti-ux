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
}

export const TuxStatus = forwardRef<HTMLSpanElement, TuxStatusProps>(
  function TuxStatus(
    {
      state,
      kind = "chip",
      acked = false,
      label,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const text = label ?? LABELS[state];

    const classes = [
      "tux-status",
      `tux-status--${state}`,
      kind !== "chip" ? `tux-status--${kind}` : "",
      acked ? "tux-status--acked" : "",
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
        {kind !== "dot" && text}
      </span>
    );
  },
);
