<script setup lang="ts">
/**
 * TuxReactionBar — light-touch acknowledgement strip.
 *
 * A small row of single-glyph reactions sitting under a piece of
 * content. The point isn't a social-network like-count — it's a
 * lower-friction "did this help?" / "I have a question" signal than
 * a full feedback form. Use in:
 *   - research-paper appendices (peer-review-lite)
 *   - editorial articles ("Was this useful?")
 *   - tti-ai-studio responses (alongside the standard 5-icon action
 *     row documented in `design/components.md` Conventions)
 *
 * v-modeled as the array of currently-active reaction keys. Click a
 * reaction → toggles it in/out of the array. Counts are display-only;
 * the host computes them from whatever backend store and passes the
 * `counts` record.
 *
 * Default set: helpful · question · disagree. Override `reactions`
 * to swap the glyphs + labels.
 *
 * Usage:
 *   <tux-reaction-bar
 *     v-model="active"
 *     :counts="{ helpful: 24, question: 3 }"
 *     @react="onReact"
 *   />
 */

interface Reaction {
  key: string;
  /** Lucide icon name. */
  icon: string;
  /** Accessible label + tooltip text. */
  label: string;
  /** Tone applied when this reaction is active. Default `brand`. */
  tone?: "brand" | "success" | "warning" | "neutral";
}

interface Props {
  /** Active reaction keys (v-model). */
  modelValue?: string[];
  /** Reaction definitions. Defaults to helpful / question / disagree. */
  reactions?: Reaction[];
  /** Per-reaction counts. Missing keys render as no badge. */
  counts?: Record<string, number>;
  /** Size variant. `sm` for inline article use, `md` for chat replies. */
  size?: "sm" | "md";
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  reactions: () => [
    { key: "helpful",  icon: "lucide:thumbs-up",  label: "Helpful",  tone: "success" },
    { key: "question", icon: "lucide:help-circle", label: "Question", tone: "warning" },
    { key: "disagree", icon: "lucide:thumbs-down", label: "Disagree", tone: "neutral" },
  ],
  counts: () => ({}),
  size: "md",
});

const emit = defineEmits<{
  "update:modelValue": [v: string[]];
  react: [key: string, active: boolean];
}>();

function toggle(key: string) {
  const next = [...props.modelValue];
  const idx = next.indexOf(key);
  const active = idx === -1;
  if (active) next.push(key);
  else next.splice(idx, 1);
  emit("update:modelValue", next);
  emit("react", key, active);
}
</script>

<template>
  <div class="tux-reaction-bar" :class="`tux-reaction-bar--${size}`">
    <button
      v-for="r in reactions"
      :key="r.key"
      type="button"
      class="tux-reaction-bar__btn"
      :class="[
        modelValue.includes(r.key) && 'tux-reaction-bar__btn--active',
        `tux-reaction-bar__btn--${r.tone ?? 'brand'}`,
      ]"
      :aria-label="r.label"
      :aria-pressed="modelValue.includes(r.key)"
      @click="toggle(r.key)"
    >
      <UIcon :name="r.icon" class="tux-reaction-bar__icon" aria-hidden="true" />
      <span class="tux-reaction-bar__label">{{ r.label }}</span>
      <span
        v-if="counts[r.key] !== undefined && counts[r.key] > 0"
        class="tux-reaction-bar__count"
      >{{ counts[r.key] }}</span>
    </button>
  </div>
</template>

<style scoped>
.tux-reaction-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.tux-reaction-bar__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: 9999px;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 120ms ease, border-color 120ms ease, background 120ms ease;
}
.tux-reaction-bar__btn:hover {
  color: var(--text-primary);
  border-color: var(--brand-primary);
}
.tux-reaction-bar__btn--active {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
}
.tux-reaction-bar__btn--active.tux-reaction-bar__btn--success {
  color: var(--color-success, oklch(0.5 0.13 145));
  border-color: var(--color-success, oklch(0.5 0.13 145));
  background: color-mix(in srgb, var(--color-success, oklch(0.5 0.13 145)) 10%, transparent);
}
.tux-reaction-bar__btn--active.tux-reaction-bar__btn--warning {
  color: var(--brand-accent);
  border-color: var(--brand-accent);
  background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
}
.tux-reaction-bar__btn--active.tux-reaction-bar__btn--neutral {
  color: var(--text-primary);
}
.tux-reaction-bar__btn--active.tux-reaction-bar__btn--brand {
  color: var(--brand-primary);
}
.tux-reaction-bar__icon {
  width: 0.875rem;
  height: 0.875rem;
}
.tux-reaction-bar__label {
  font-family: var(--font-sans);
  font-weight: 500;
}
.tux-reaction-bar__count {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.7rem;
  padding: 0 0.25rem;
  color: var(--text-secondary);
}

.tux-reaction-bar--sm .tux-reaction-bar__btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
}
.tux-reaction-bar--sm .tux-reaction-bar__icon {
  width: 0.75rem;
  height: 0.75rem;
}
</style>
