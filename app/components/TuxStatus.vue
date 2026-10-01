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
}

const props = withDefaults(defineProps<Props>(), {
  kind: "chip",
  acked: false,
  label: undefined,
});

const text = computed(() => props.label ?? LABELS[props.state]);
</script>

<template>
  <span
    class="tux-status"
    :class="[
      `tux-status--${state}`,
      kind !== 'chip' ? `tux-status--${kind}` : null,
      acked ? 'tux-status--acked' : null,
    ]"
    :role="kind === 'dot' ? 'status' : undefined"
    :aria-label="kind === 'dot' ? text : undefined"
  >
    <template v-if="kind !== 'dot'">{{ text }}</template>
  </span>
</template>
