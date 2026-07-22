<script setup lang="ts">
/**
 * TuxBetaRibbon — environment / lifecycle label that signals
 * "this isn't the production deploy". Use for preview environments,
 * non-production deployments, beta features, sandboxes, demos.
 *
 * Three variants — pick by host context, not aesthetic preference:
 *
 *   1. `variant="corner"` — diagonal ribbon in the page corner
 *      (top-right by default). Eye-catching, hard to miss.
 *      Right reach for: full-deploy preview environments
 *      (preview.tti.tamu.edu), staging, demo seats.
 *
 *   2. `variant="stripe"` — top-of-page horizontal stripe, full-width.
 *      Right reach for: production-shaped deploys with non-prod data
 *      (a real-feeling demo with seeded fixtures), or lifecycle
 *      labels on the canonical product (a public beta).
 *
 *   3. `variant="pill"` — inline pill, flows in normal page chrome.
 *      Right reach for: feature-level beta tags ("This dashboard is
 *      in beta"), per-page indicators, headers and breadcrumbs.
 *
 * Tones:
 *   - `preview` (default · gold) — preview / staging.
 *   - `beta` (navy) — public beta / new feature.
 *   - `dev` (warning red) — non-production / sandbox.
 *
 * For maintenance windows, prefer `TuxAnnouncementBanner tone="urgent"` —
 * that's a content notice, not a chrome label.
 */
type Variant = "corner" | "stripe" | "pill";
type Tone = "preview" | "beta" | "dev";
type Corner = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface Props {
  variant?: Variant;
  tone?: Tone;
  /** Custom label text. Defaults vary by tone. */
  label?: string;
  /** Where the corner ribbon sits. Only applies to `variant="corner"`. */
  corner?: Corner;
  /** Stripe message. Only applies to `variant="stripe"`. */
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "corner",
  tone: "preview",
  label: undefined,
  corner: "top-right",
  message: undefined,
});

const defaultLabel: Record<Tone, string> = {
  preview: "preview",
  beta:    "beta",
  dev:     "dev",
};

const defaultMessage: Record<Tone, string> = {
  preview: "Preview environment — data may differ from production.",
  beta:    "This is a public beta. Feedback welcome at support@tti.tamu.edu.",
  dev:     "Non-production environment. Do not enter real research data.",
};

const resolvedLabel = computed(() => props.label ?? defaultLabel[props.tone]);
const resolvedMessage = computed(() => props.message ?? defaultMessage[props.tone]);
</script>

<template>
  <!-- Corner ribbon -->
  <div
    v-if="variant === 'corner'"
    class="tux-beta-corner"
    :class="[`tux-beta-corner--${corner}`, `tux-beta--${tone}`]"
    role="note"
    :aria-label="`Environment: ${resolvedLabel}`"
  >
    <span class="tux-beta-corner__band">{{ resolvedLabel }}</span>
  </div>

  <!-- Top stripe -->
  <aside
    v-else-if="variant === 'stripe'"
    class="tux-beta-stripe"
    :class="`tux-beta--${tone}`"
    role="note"
    :aria-label="`Environment: ${resolvedLabel}`"
  >
    <span class="tux-beta-stripe__pill">{{ resolvedLabel }}</span>
    <span class="tux-beta-stripe__message">
      <slot>{{ resolvedMessage }}</slot>
    </span>
  </aside>

  <!-- Inline pill -->
  <span
    v-else
    class="tux-beta-pill"
    :class="`tux-beta--${tone}`"
    role="note"
    :aria-label="`Status: ${resolvedLabel}`"
  >
    <UIcon
      v-if="tone === 'dev'"
      name="lucide:siren"
      class="tux-beta-pill__icon"
      aria-hidden="true"
    />
    <span class="tux-beta-pill__dot" aria-hidden="true" />
    {{ resolvedLabel }}
  </span>
</template>

<style scoped>
/* ── Tone palette (shared across variants) ──────────────────── */
.tux-beta--preview {
  --tux-beta-bg:    var(--brand-accent);
  --tux-beta-fg:    #1f1c1c;
  --tux-beta-tint:  color-mix(in srgb, var(--brand-accent) 22%, transparent);
}

.tux-beta--beta {
  --tux-beta-bg:    var(--brand-secondary);
  --tux-beta-fg:    #ffffff;
  --tux-beta-tint:  color-mix(in srgb, var(--brand-secondary) 18%, transparent);
}

.tux-beta--dev {
  --tux-beta-bg:    var(--color-error);
  --tux-beta-fg:    #ffffff;
  --tux-beta-tint:  color-mix(in srgb, var(--color-error) 18%, transparent);
}

/* ── Corner ribbon ──────────────────────────────────────────── */
.tux-beta-corner {
  position: fixed;
  z-index: 50;
  width: 8.5rem;
  height: 8.5rem;
  overflow: hidden;
  pointer-events: none;
}

.tux-beta-corner--top-right    { top: 0; right: 0; }
.tux-beta-corner--top-left     { top: 0; left: 0; }
.tux-beta-corner--bottom-right { bottom: 0; right: 0; }
.tux-beta-corner--bottom-left  { bottom: 0; left: 0; }

.tux-beta-corner__band {
  position: absolute;
  display: block;
  width: 12rem;
  padding: 0.4375rem 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--tux-beta-bg);
  color: var(--tux-beta-fg);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}

.tux-beta-corner--top-right .tux-beta-corner__band {
  top: 1.875rem;
  right: -3rem;
  transform: rotate(45deg);
}

.tux-beta-corner--top-left .tux-beta-corner__band {
  top: 1.875rem;
  left: -3rem;
  transform: rotate(-45deg);
}

.tux-beta-corner--bottom-right .tux-beta-corner__band {
  bottom: 1.875rem;
  right: -3rem;
  transform: rotate(-45deg);
}

.tux-beta-corner--bottom-left .tux-beta-corner__band {
  bottom: 1.875rem;
  left: -3rem;
  transform: rotate(45deg);
}

/* ── Top stripe ─────────────────────────────────────────────── */
.tux-beta-stripe {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4375rem 1rem;
  background: var(--tux-beta-tint);
  border-bottom: 1px solid color-mix(in srgb, var(--tux-beta-bg) 35%, transparent);
  font-size: 0.8125rem;
  color: var(--text-primary);
}

.tux-beta-stripe__pill {
  display: inline-flex;
  align-items: center;
  padding: 0.0625rem 0.4375rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--tux-beta-bg);
  color: var(--tux-beta-fg);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.tux-beta-stripe__message {
  flex: 1;
  min-width: 0;
}

/* ── Inline pill ────────────────────────────────────────────── */
.tux-beta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--tux-beta-tint);
  color: var(--text-primary);
  border: 1px solid color-mix(in srgb, var(--tux-beta-bg) 40%, transparent);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  vertical-align: middle;
}

.tux-beta-pill__dot {
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: var(--tux-beta-bg);
}

.tux-beta-pill__icon {
  width: 0.8125rem;
  height: 0.8125rem;
  color: var(--tux-beta-bg);
}
</style>
