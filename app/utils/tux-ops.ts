/**
 * Operational status ramp (ADR-0013 / ADR-0014).
 *
 * Lives in a TS module, not TuxStatus.vue: `<script setup>` cannot
 * export values, and pages cannot use `as const` (ADR-0010). TuxStatus,
 * the status showcase, and ops-board.demo-data all import from here.
 */

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
