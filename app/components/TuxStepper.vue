<script setup lang="ts">
/**
 * TuxStepper — numbered-circle multi-step indicator for funding
 * applications, IRB submissions, study-onboarding flows, or any
 * other "you are here in a known sequence" pattern.
 *
 * Two orientations:
 *   - `orientation="horizontal"` — circles sit on a row, connector
 *     lines run between them. Best for ≤ 6 steps and wide layouts.
 *   - `orientation="vertical"` — circles stack down a column, vertical
 *     connector. Best for sidebar / long-form / mobile.
 *
 * Below ~30rem container width, horizontal collapses to vertical
 * automatically (container query, not viewport).
 *
 * Step status is derived from `currentIndex`:
 *   - i < currentIndex  →  done   (filled maroon, checkmark)
 *   - i === currentIndex →  active (filled maroon, number)
 *   - i > currentIndex  →  todo   (outline, muted number)
 *
 * Override per-step via `items[i].status` (e.g. mark a step `error`).
 */
type StepStatus = "done" | "active" | "todo" | "error";

interface Step {
  /** Required label shown beside the circle. */
  label: string;
  /** Optional sub-label shown beneath the label. */
  description?: string;
  /** Per-step status override; otherwise derived from currentIndex. */
  status?: StepStatus;
  /** Optional link target for past/future steps. */
  to?: string;
}

interface Props {
  steps: Step[];
  /** Zero-based index of the currently-active step. */
  currentIndex?: number;
  orientation?: "horizontal" | "vertical";
  /** Render the description copy. Default: true. */
  showDescriptions?: boolean;
  /** Accessible label for the nav landmark. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0,
  orientation: "horizontal",
  showDescriptions: true,
  ariaLabel: "Progress",
});

const resolved = computed(() =>
  props.steps.map((s, i): Required<Pick<Step, "label" | "status">> & Step => {
    const auto: StepStatus =
      i < props.currentIndex ? "done"
      : i === props.currentIndex ? "active"
      : "todo";
    return { ...s, status: s.status ?? auto };
  }),
);

function statusIcon(s: StepStatus): string | null {
  if (s === "done") return "lucide:check";
  if (s === "error") return "lucide:x";
  return null;
}
</script>

<template>
  <nav
    class="tux-stepper"
    :class="`tux-stepper--${orientation}`"
    :aria-label="ariaLabel"
  >
    <ol class="tux-stepper__list">
      <li
        v-for="(s, i) in resolved"
        :key="i"
        class="tux-stepper__item"
        :class="`tux-stepper__item--${s.status}`"
        :aria-current="s.status === 'active' ? 'step' : undefined"
      >
        <component
          :is="s.to ? 'NuxtLink' : 'span'"
          :to="s.to"
          class="tux-stepper__node"
        >
          <span class="tux-stepper__circle" aria-hidden="true">
            <UIcon
              v-if="statusIcon(s.status)"
              :name="statusIcon(s.status)!"
              class="tux-stepper__icon"
            />
            <span v-else class="tux-stepper__num">{{ i + 1 }}</span>
          </span>
          <span class="tux-stepper__text">
            <span class="tux-stepper__label">{{ s.label }}</span>
            <span
              v-if="showDescriptions && s.description"
              class="tux-stepper__description"
            >{{ s.description }}</span>
          </span>
        </component>

        <span
          v-if="i < resolved.length - 1"
          class="tux-stepper__connector"
          :class="i < currentIndex ? 'tux-stepper__connector--done' : ''"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.tux-stepper {
  container-type: inline-size;
  container-name: tux-stepper;
}

.tux-stepper__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ── Horizontal default ────────────────────────────────────── */
.tux-stepper--horizontal .tux-stepper__list {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.tux-stepper--horizontal .tux-stepper__item {
  display: flex;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.tux-stepper--horizontal .tux-stepper__node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
  gap: 0.5rem;
  min-width: 0;
}

.tux-stepper--horizontal .tux-stepper__connector {
  flex: 1;
  height: 2px;
  background: var(--surface-border);
  align-self: center;
  margin: 0 0.5rem;
  margin-top: -1.25rem;
  min-width: 1.5rem;
}

.tux-stepper--horizontal .tux-stepper__connector--done {
  background: var(--brand-primary);
}

/* ── Vertical ──────────────────────────────────────────────── */
.tux-stepper--vertical .tux-stepper__item {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.875rem;
  row-gap: 0.5rem;
}

.tux-stepper--vertical .tux-stepper__node {
  display: contents;
  text-decoration: none;
  color: inherit;
}

.tux-stepper--vertical .tux-stepper__connector {
  grid-column: 1;
  width: 2px;
  background: var(--surface-border);
  margin: 0.25rem auto;
  min-height: 1.25rem;
}

.tux-stepper--vertical .tux-stepper__connector--done {
  background: var(--brand-primary);
}

.tux-stepper--vertical .tux-stepper__text {
  padding-top: 0.1875rem;
}

/* ── Shared circle + text ──────────────────────────────────── */
.tux-stepper__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  flex-shrink: 0;
  transition:
    background var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.tux-stepper__icon {
  width: 1rem;
  height: 1rem;
}

.tux-stepper__text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.tux-stepper__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.25;
}

.tux-stepper__description {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* ── Status visuals ────────────────────────────────────────── */
.tux-stepper__item--done .tux-stepper__circle {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--text-on-brand, #ffffff);
}

.tux-stepper__item--active .tux-stepper__circle {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--text-on-brand, #ffffff);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 18%, transparent);
}

.tux-stepper__item--active .tux-stepper__label {
  color: var(--brand-primary);
}

.tux-stepper__item--error .tux-stepper__circle {
  background: var(--color-error);
  border-color: var(--color-error);
  color: #ffffff;
}

.tux-stepper__item--error .tux-stepper__label {
  color: var(--color-error);
}

.tux-stepper__item--todo .tux-stepper__label {
  color: var(--text-secondary);
}

/* ── Container-query collapse ──────────────────────────────── */
@container tux-stepper (max-width: 30rem) {
  .tux-stepper--horizontal .tux-stepper__list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
  }
  .tux-stepper--horizontal .tux-stepper__item {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 0.875rem;
    row-gap: 0.5rem;
  }
  .tux-stepper--horizontal .tux-stepper__node {
    display: contents;
  }
  .tux-stepper--horizontal .tux-stepper__connector {
    grid-column: 1;
    width: 2px;
    height: auto;
    margin: 0.25rem auto;
    min-height: 1.25rem;
  }
  .tux-stepper--horizontal .tux-stepper__text {
    text-align: left;
    padding-top: 0.1875rem;
  }
}
</style>
