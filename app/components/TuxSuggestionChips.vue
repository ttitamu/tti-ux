<script setup lang="ts">
/**
 * TuxSuggestionChips — horizontal row of clickable prompt chips.
 *
 * Two uses we've seen in the wild:
 *   - Empty-state composer: surface "what could I ask?" examples
 *     before the first message lands
 *   - Mid-conversation follow-ups: "what would you like to know next?"
 *     suggestions returned from the model
 *
 * Pure presentation — the host app decides what happens on pick. Most
 * consumers will either pre-fill TuxComposer's modelValue or dispatch
 * the prompt directly through their chat pipeline.
 *
 * Items can be plain strings (the prompt itself becomes the label)
 * or `{ label, prompt }` objects when you want a short chip label that
 * expands into a longer prompt on dispatch.
 */

type ChipItem = string | { label: string; prompt: string };

interface Props {
  /** Suggestion list. Strings are used as both label and prompt. */
  items: ChipItem[];
  /** Optional eyebrow text rendered above the chip row. */
  label?: string;
  /**
   * Accessible name for the landmark `<section>`. Defaults to the visible
   * `label`, falling back to "Suggested prompts". Set this explicitly when
   * several instances share a page so each landmark name stays unique.
   */
  ariaLabel?: string;
  /** Hide the trailing arrow on each chip. */
  noArrow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  ariaLabel: undefined,
  noArrow: false,
});

const sectionLabel = computed(() => props.ariaLabel || props.label || "Suggested prompts");

const emit = defineEmits<{
  pick: [prompt: string, index: number];
}>();

function labelOf(item: ChipItem): string {
  return typeof item === "string" ? item : item.label;
}

function promptOf(item: ChipItem): string {
  return typeof item === "string" ? item : item.prompt;
}

function onPick(item: ChipItem, index: number) {
  emit("pick", promptOf(item), index);
}
</script>

<template>
  <section class="tux-suggestion-chips" :aria-label="sectionLabel">
    <p v-if="label" class="tux-suggestion-chips__label">{{ label }}</p>
    <div class="tux-suggestion-chips__row" role="list">
      <span
        v-for="(item, i) in items"
        :key="i"
        role="listitem"
        class="tux-suggestion-chips__item"
      >
        <button
          type="button"
          class="tux-suggestion-chips__chip"
          @click="onPick(item, i)"
        >
          <span class="tux-suggestion-chips__chip-text">{{ labelOf(item) }}</span>
          <Icon
            v-if="!noArrow"
            name="lucide:arrow-up-right"
            class="tux-suggestion-chips__chip-icon"
            aria-hidden="true"
          />
        </button>
      </span>
    </div>
  </section>
</template>

<style scoped>
.tux-suggestion-chips {
  container-type: inline-size;
  container-name: tux-suggestion-chips;
  font-family: var(--font-body);
}

.tux-suggestion-chips__label {
  margin: 0 0 0.5rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
}

.tux-suggestion-chips__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tux-suggestion-chips__item {
  display: inline-flex;
}

.tux-suggestion-chips__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.4375rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.tux-suggestion-chips__chip:hover,
.tux-suggestion-chips__chip:focus-visible {
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--surface-page));
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  outline: none;
}

.tux-suggestion-chips__chip:focus-visible {
  box-shadow: var(--shadow-focus);
}

.tux-suggestion-chips__chip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 28rem;
}

.tux-suggestion-chips__chip-icon {
  flex-shrink: 0;
  width: 0.8125rem;
  height: 0.8125rem;
  color: var(--text-muted);
  transition: transform 0.15s ease, color 0.15s ease;
}

.tux-suggestion-chips__chip:hover .tux-suggestion-chips__chip-icon,
.tux-suggestion-chips__chip:focus-visible .tux-suggestion-chips__chip-icon {
  color: var(--brand-primary);
  transform: translate(1px, -1px);
}
</style>
