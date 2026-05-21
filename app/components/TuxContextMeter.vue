<script setup lang="ts">
/**
 * TuxContextMeter — token-utilization indicator with cost breakdown.
 *
 * Pattern from Vercel's AI SDK Elements (`Context`): show how much of
 * the model's context window the current session is consuming, with a
 * hover/click popover for the input/output/total cost detail.
 *
 * For long research sessions in tti-ai-studio (and any consumer app
 * hitting an LLM), this is the budget-visibility surface — users want
 * to know "am I approaching the context limit?" and "what is this
 * session costing?"
 *
 * Renders as a compact badge: `[31.3%]` (or with a tiny meter ring if
 * `showRing`). Hover/focus reveals the breakdown.
 *
 * Pure presentation. Host app sources `used`, `max`, and the per-side
 * cost figures from whatever model wrapper it uses.
 */

interface SideBreakdown {
  /** Token count for this side (input or output). */
  tokens: number;
  /** Pre-formatted cost string (e.g., "$0.04"). The component does not
   *  do currency math — host formats it per the active provider. */
  cost?: string;
}

interface Breakdown {
  input?: SideBreakdown;
  output?: SideBreakdown;
  /** Pre-formatted total cost (e.g., "$0.12"). */
  totalCost?: string;
}

interface Props {
  /** Tokens used in the current context window. */
  used: number;
  /** Maximum tokens in the window (e.g., 128_000 for Claude 4.7 Opus). */
  max: number;
  /** Input/output/total cost detail surfaced in the popover. */
  breakdown?: Breakdown;
  /** Override the pill label. Default is `{percent}%`. */
  label?: string;
  /** Model name shown as an eyebrow at the top of the popover. */
  modelLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  breakdown: undefined,
  label: undefined,
  modelLabel: undefined,
});

const percentRaw = computed(() => {
  if (!props.max) return 0;
  return Math.min(100, (props.used / props.max) * 100);
});

const percentDisplay = computed(() => {
  const p = percentRaw.value;
  // Show one decimal under 100; the trailing precision aligns with
  // Vercel's reference ("31.3%") and is the right granularity at the
  // 100k-context-window scale.
  return `${p.toFixed(1)}%`;
});

// Threshold color cues — green under 60%, amber 60–85%, red over 85%.
// Maps to TUX semantic CSS vars rather than hex so themes (TTI / TTI-HC)
// take over cleanly.
const tone = computed<"ok" | "warn" | "alert">(() => {
  const p = percentRaw.value;
  if (p >= 85) return "alert";
  if (p >= 60) return "warn";
  return "ok";
});

function fmtTokens(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k >= 100 ? `${Math.round(k)}K` : `${k.toFixed(1)}K`;
  }
  return n.toString();
}
</script>

<template>
  <UPopover mode="hover" :open-delay="120" :close-delay="160">
    <button
      type="button"
      class="tux-context-meter__trigger"
      :class="`tux-context-meter__trigger--${tone}`"
      :aria-label="`Context window: ${percentDisplay} used`"
    >
      <span
        class="tux-context-meter__ring"
        :style="{ '--p': percentRaw }"
        aria-hidden="true"
      />
      <span class="tux-context-meter__pct">
        {{ label ?? percentDisplay }}
      </span>
    </button>

    <template #content>
      <article class="tux-context-meter__panel">
        <p v-if="modelLabel" class="eyebrow tux-context-meter__panel-model">{{ modelLabel }}</p>
        <div class="tux-context-meter__panel-headline">
          <span class="tux-context-meter__panel-pct">{{ percentDisplay }}</span>
          <span class="tux-context-meter__panel-tokens">
            {{ fmtTokens(used) }} / {{ fmtTokens(max) }}
          </span>
        </div>
        <div
          class="tux-context-meter__panel-bar"
          role="progressbar"
          :aria-valuenow="Math.round(percentRaw)"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span
            class="tux-context-meter__panel-bar-fill"
            :class="`tux-context-meter__panel-bar-fill--${tone}`"
            :style="{ width: `${percentRaw}%` }"
          />
        </div>
        <dl v-if="breakdown" class="tux-context-meter__panel-breakdown">
          <template v-if="breakdown.input">
            <dt>Input</dt>
            <dd>
              <span>{{ fmtTokens(breakdown.input.tokens) }}</span>
              <span v-if="breakdown.input.cost" class="tux-context-meter__panel-cost">{{ breakdown.input.cost }}</span>
            </dd>
          </template>
          <template v-if="breakdown.output">
            <dt>Output</dt>
            <dd>
              <span>{{ fmtTokens(breakdown.output.tokens) }}</span>
              <span v-if="breakdown.output.cost" class="tux-context-meter__panel-cost">{{ breakdown.output.cost }}</span>
            </dd>
          </template>
          <template v-if="breakdown.totalCost">
            <dt class="tux-context-meter__panel-total-label">Total cost</dt>
            <dd class="tux-context-meter__panel-total-value">{{ breakdown.totalCost }}</dd>
          </template>
        </dl>
      </article>
    </template>
  </UPopover>
</template>

<style scoped>
.tux-context-meter__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.tux-context-meter__trigger:hover,
.tux-context-meter__trigger:focus-visible {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  outline: none;
}

.tux-context-meter__trigger--warn { color: var(--color-warning, var(--brand-accent)); }
.tux-context-meter__trigger--alert { color: var(--color-error, var(--brand-primary)); }

/* Tiny conic-gradient utilization ring — purely cosmetic; the panel
   bar is the accessible progress. */
.tux-context-meter__ring {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: conic-gradient(
    currentColor calc(var(--p, 0) * 1%),
    color-mix(in srgb, currentColor 22%, transparent) 0
  );
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
}

.tux-context-meter__pct {
  letter-spacing: 0.02em;
}

.tux-context-meter__panel {
  min-width: 14rem;
  max-width: 18rem;
  padding: 0.875rem 1rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
}

.tux-context-meter__panel-model {
  margin: 0 0 0.375rem;
}

.tux-context-meter__panel-headline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.tux-context-meter__panel-pct {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-context-meter__panel-tokens {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.tux-context-meter__panel-bar {
  width: 100%;
  height: 0.375rem;
  background: var(--surface-sunken);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.tux-context-meter__panel-bar-fill {
  display: block;
  height: 100%;
  background: var(--brand-primary);
  transition: width 0.2s ease;
}

.tux-context-meter__panel-bar-fill--warn { background: var(--color-warning, var(--brand-accent)); }
.tux-context-meter__panel-bar-fill--alert { background: var(--color-error, var(--brand-primary)); }

.tux-context-meter__panel-breakdown {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.375rem 1rem;
  margin: 0;
  padding-top: 0.5rem;
  border-top: 1px solid var(--surface-border);
}

.tux-context-meter__panel-breakdown dt {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-context-meter__panel-breakdown dd {
  margin: 0;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.tux-context-meter__panel-cost {
  color: var(--text-muted);
}

.tux-context-meter__panel-total-label {
  padding-top: 0.375rem;
  border-top: 1px dashed var(--surface-border);
}

.tux-context-meter__panel-total-value {
  padding-top: 0.375rem;
  border-top: 1px dashed var(--surface-border);
  font-weight: 700;
  color: var(--brand-primary);
  justify-content: flex-end;
}
</style>
