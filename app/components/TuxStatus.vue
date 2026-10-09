<script setup lang="ts">
import type { TuxOpsKind, TuxOpsState } from "../utils/tux-ops";

/**
 * TuxStatus — operational state chip (ADR-0013 / ADR-0014).
 *
 * This is NOT TuxBadge `status` (queued / running / completed — job
 * lifecycle, semantic palette). This is system health: ok → warning →
 * unknown → critical, plus pending and maintenance.
 *
 * The class API lives in kit/css/tux-ops.css so a CGI overlay and a
 * Vue app paint the same pixels. TuxExample's CSS tab on /components/status
 * is that file.
 *
 *   <tux-status state="critical" />
 *   <tux-status state="ok" kind="text" />
 *   <tux-status state="warning" kind="dot" />
 *   <tux-status state="critical" acked />
 */

const LABELS: Record<TuxOpsState, string> = {
  ok: "OK",
  warning: "WARNING",
  unknown: "UNKNOWN",
  critical: "CRITICAL",
  pending: "PENDING",
  maintenance: "MAINT",
};

interface Props {
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

const props = withDefaults(defineProps<Props>(), {
  kind: "chip",
  acked: false,
  label: undefined,
  glyph: undefined,
});

const text = computed(() => props.label ?? LABELS[props.state]);

const showGlyph = computed(() => {
  if (props.glyph !== undefined) return props.glyph;
  return props.kind === "dot";
});
</script>

<template>
  <span
    class="tux-status"
    :class="[
      `tux-status--${state}`,
      kind !== 'chip' ? `tux-status--${kind}` : null,
      acked ? 'tux-status--acked' : null,
      showGlyph ? 'tux-status--has-glyph' : null,
    ]"
    :role="kind === 'dot' ? 'status' : undefined"
    :aria-label="kind === 'dot' ? text : undefined"
  >
    <!-- Multi-channel accessible shape glyph -->
    <svg
      v-if="showGlyph"
      class="tux-status__glyph"
      :class="[
        kind === 'dot' ? 'tux-status__glyph--dot' : 'tux-status__glyph--inline',
      ]"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <!-- OK: Circle with Checkmark -->
      <template v-if="state === 'ok'">
        <circle cx="8" cy="8" r="7" class="tux-status__shape-bg" />
        <path
          d="M4.75 8.25 L6.75 10.25 L11.25 5.75"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-status__shape-fg"
        />
      </template>

      <!-- WARNING: Upright Equilateral Triangle with Exclamation -->
      <template v-else-if="state === 'warning'">
        <path
          d="M8 1.75 L15 14.25 H1 Z"
          class="tux-status__shape-bg"
        />
        <path
          d="M8 5.75 V9.5 M8 12 V12.5"
          stroke-width="1.75"
          stroke-linecap="round"
          class="tux-status__shape-fg tux-status__shape-fg--dark"
        />
      </template>

      <!-- CRITICAL: Octagon (Stop Sign) with X / Cross -->
      <template v-else-if="state === 'critical'">
        <polygon
          points="5.25 1 10.75 1 15 5.25 15 10.75 10.75 15 5.25 15 1 10.75 1 5.25"
          class="tux-status__shape-bg"
        />
        <path
          d="M5.5 5.5 L10.5 10.5 M10.5 5.5 L5.5 10.5"
          stroke-width="2"
          stroke-linecap="round"
          class="tux-status__shape-fg"
        />
      </template>

      <!-- MAINTENANCE: Rounded Square with Horizontal Tool Bar -->
      <template v-else-if="state === 'maintenance'">
        <rect
          x="1.5"
          y="1.5"
          width="13"
          height="13"
          rx="2.5"
          class="tux-status__shape-bg"
        />
        <path
          d="M4.5 8 H11.5"
          stroke-width="2"
          stroke-linecap="round"
          class="tux-status__shape-fg"
        />
      </template>

      <!-- PENDING: Clock Ring with Hands -->
      <template v-else-if="state === 'pending'">
        <circle cx="8" cy="8" r="7" class="tux-status__shape-bg" />
        <path
          d="M8 4.5 V8 H11"
          fill="none"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-status__shape-fg"
        />
      </template>

      <!-- UNKNOWN: Rotated Diamond with Question Mark -->
      <template v-else-if="state === 'unknown'">
        <polygon
          points="8 1.5 14.5 8 8 14.5 1.5 8"
          class="tux-status__shape-bg"
        />
        <path
          d="M6.5 6 C6.5 5 7.2 4.5 8 4.5 C8.8 4.5 9.5 5 9.5 5.8 C9.5 6.6 8.8 7.2 8 7.7 V9 M8 11.25 V11.75"
          fill="none"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-status__shape-fg"
        />
      </template>
    </svg>

    <template v-if="kind !== 'dot'">{{ text }}</template>
  </span>
</template>
