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
 *
 * Selectable (`selectable`): each step is a button and emits `select(index,
 * step)` — the same control both shows where something stands and moves it
 * (a work item's Triage → Ready → In progress → Done). A step with
 * `locked: "reason"` shows a lock, says the reason, and can't be chosen;
 * `busyIndex` spins on the step being saved.
 *
 * Variant `path`: a compact row of segments instead of numbered circles —
 * finished steps carry a check, the current one is filled — for panels and
 * cards where the circles are too tall. Below ~26rem its labels wrap.
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
  /** Selectable steppers: this step can't be chosen, and this says why. */
  locked?: string;
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
  /** Steps are buttons that emit `select`. */
  selectable?: boolean;
  /** "steps" (numbered circles, default) or "path" (compact segments). */
  variant?: "steps" | "path";
  /** Selectable: the step being saved shows a spinner. */
  busyIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0,
  orientation: "horizontal",
  showDescriptions: true,
  ariaLabel: "Progress",
  selectable: false,
  variant: "steps",
  busyIndex: -1,
});

const emit = defineEmits<{ select: [index: number, step: Step] }>();

function hint(s: Step & { status: StepStatus }): string {
  if (s.status === "active") return `${s.label} (current)`;
  if (s.locked) return `${s.label}: ${s.locked}`;
  return props.selectable ? `Move to ${s.label}` : s.label;
}
function choose(s: Step & { status: StepStatus }, i: number) {
  if (!props.selectable || s.locked || s.status === "active" || props.busyIndex >= 0) return;
  emit("select", i, s);
}

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
  <nav v-if="variant === 'path'" class="tux-path" :aria-label="ariaLabel">
    <ol class="tux-path__list">
      <li
        v-for="(s, i) in resolved"
        :key="i"
        class="tux-path__step"
        :class="`tux-path__step--${s.status}`"
      >
        <component
          :is="selectable ? 'button' : 'span'"
          :type="selectable ? 'button' : undefined"
          class="tux-path__seg"
          :class="{ 'tux-path__seg--locked': s.locked && s.status !== 'active' }"
          :aria-current="s.status === 'active' ? 'step' : undefined"
          :aria-disabled="selectable && (s.locked || s.status === 'active') ? 'true' : undefined"
          :aria-label="hint(s)"
          :title="hint(s)"
          @click="choose(s, i)"
        >
          <UIcon v-if="busyIndex === i" name="lucide:loader-circle" class="tux-path__icon tux-path__icon--spin" />
          <UIcon v-else-if="s.status === 'done'" name="lucide:check" class="tux-path__icon tux-path__icon--done" />
          <UIcon v-else-if="s.status === 'error'" name="lucide:x" class="tux-path__icon" />
          <UIcon v-else-if="s.locked && s.status !== 'active'" name="lucide:lock" class="tux-path__icon" />
          <span class="tux-path__label">{{ s.label }}</span>
        </component>
      </li>
    </ol>
  </nav>
  <nav
    v-else
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
        <!-- NuxtLink must be a static tag: as a string in :is it isn't resolved -->
        <NuxtLink v-if="!selectable && s.to" :to="s.to" class="tux-stepper__node">
          <span class="tux-stepper__circle" aria-hidden="true">
            <UIcon
              v-if="busyIndex === i"
              name="lucide:loader-circle"
              class="tux-stepper__icon tux-path__icon--spin"
            />
            <UIcon
              v-else-if="statusIcon(s.status)"
              :name="statusIcon(s.status)!"
              class="tux-stepper__icon"
            />
            <UIcon
              v-else-if="s.locked"
              name="lucide:lock"
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
                </NuxtLink>
        <component
          :is="selectable ? 'button' : 'span'"
          v-else
          :type="selectable ? 'button' : undefined"
          class="tux-stepper__node"
          :class="{ 'tux-stepper__node--button': selectable }"
          :aria-disabled="selectable && (s.locked || s.status === 'active') ? 'true' : undefined"
          :aria-label="selectable ? hint(s) : undefined"
          :title="selectable ? hint(s) : undefined"
          @click="choose(s, i)"
        >
          <span class="tux-stepper__circle" aria-hidden="true">
            <UIcon
              v-if="busyIndex === i"
              name="lucide:loader-circle"
              class="tux-stepper__icon tux-path__icon--spin"
            />
            <UIcon
              v-else-if="statusIcon(s.status)"
              :name="statusIcon(s.status)!"
              class="tux-stepper__icon"
            />
            <UIcon
              v-else-if="s.locked"
              name="lucide:lock"
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
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Circle + text flow directly into the centered item column, so the text
 * is constrained to the item's width and WRAPS instead of growing to its
 * max-content width and overlapping the neighboring step. */
.tux-stepper--horizontal .tux-stepper__node {
  display: contents;
  text-decoration: none;
  color: inherit;
}

.tux-stepper--horizontal .tux-stepper__text {
  width: 100%;
  align-items: center;
  margin-top: 0.5rem;
}

/* Connector runs from this step's circle center to the next step's circle
 * center, drawn behind the circles (which carry z-index: 1). */
.tux-stepper--horizontal .tux-stepper__connector {
  position: absolute;
  top: 1rem; /* circle is 2rem tall → its vertical center */
  left: 50%;
  right: -50%;
  height: 2px;
  background: var(--surface-border);
  transform: translateY(-1px);
  z-index: 0;
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
  position: relative;
  z-index: 1; /* sit above the horizontal connector line */
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
  box-shadow: 0 0 0 4px var(--wash-brand-18);
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
    position: static; /* back to in-flow for the stacked column */
    grid-column: 1;
    width: 2px;
    height: auto;
    margin: 0.25rem auto;
    min-height: 1.25rem;
    transform: none;
  }
  .tux-stepper--horizontal .tux-stepper__text {
    width: auto;
    align-items: flex-start;
    text-align: left;
    margin-top: 0;
    padding-top: 0.1875rem;
  }
}

/* ── Selectable (steps variant) ─────────────────────────────── */
.tux-stepper__node--button {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  cursor: pointer;
}
.tux-stepper__node--button[aria-disabled="true"] { cursor: default; }
.tux-stepper__node--button:focus-visible .tux-stepper__circle {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}
.tux-stepper__node--button:not([aria-disabled="true"]):hover .tux-stepper__circle {
  border-color: var(--brand-primary);
}

/* ── Path variant: compact segments ─────────────────────────── */
.tux-path {
  container-type: inline-size;
  container-name: tux-path;
}
.tux-path__list {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.tux-path__step {
  flex: 1 1 auto;
  min-width: 4.5rem;
}
.tux-path__seg {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  min-height: 30px;
  padding: 0 8px;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.15;
  white-space: nowrap;
  border: 1px solid var(--surface-border);
  border-radius: 3px;
  background: var(--surface-sunken);
  color: var(--text-secondary);
  transition:
    background var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}
.tux-path__step:first-child .tux-path__seg { border-radius: 8px 3px 3px 8px; }
.tux-path__step:last-child .tux-path__seg { border-radius: 3px 8px 8px 3px; }
.tux-path__icon { width: 13px; height: 13px; flex: none; }
.tux-path__label { overflow: hidden; text-overflow: ellipsis; }

/* Tints mix --brand-primary here rather than using --wash-brand-*: those are
   computed on the theme root, so under tti-dark they stay maroon while the
   brand is teal. Text on the filled step is the page colour (white on
   tti-dark's light teal is 2.4:1). */
.tux-path__step--done .tux-path__seg {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  border-color: color-mix(in srgb, var(--brand-primary) 35%, transparent);
  color: var(--text-primary);
}
.tux-path__step--active .tux-path__seg {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--surface-page);
  font-weight: 600;
}
.tux-path__step--error .tux-path__seg {
  border-color: var(--color-error);
  color: var(--color-error);
}
button.tux-path__seg { cursor: pointer; }
button.tux-path__seg[aria-disabled="true"] { cursor: default; }
button.tux-path__seg:not([aria-disabled="true"]):hover {
  border-color: var(--brand-primary);
  color: var(--text-primary);
}
.tux-path__seg:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}
.tux-path__icon--spin { animation: tux-path-spin 0.8s linear infinite; }
@keyframes tux-path-spin { to { transform: rotate(360deg); } }

@container tux-path (max-width: 26rem) {
  .tux-path__list { flex-wrap: nowrap; gap: 2px; }
  .tux-path__step { flex: 1 1 0; min-width: 0; }
  .tux-path__seg {
    min-height: 36px;
    padding: 3px 2px;
    white-space: normal;
    text-align: center;
    font-size: 0.72rem;
  }
  .tux-path__icon--done { display: none; }
  .tux-path__label { overflow-wrap: anywhere; }
}

@media (prefers-reduced-motion: reduce) {
  .tux-path__seg { transition: none; }
  .tux-path__icon--spin { animation: none; }
}
</style>
