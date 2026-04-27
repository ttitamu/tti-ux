<script setup lang="ts">
// TuxAlphaNav — A–Z jump bar for directory + glossary pages.
//
// Renders the alphabet (or a custom letter set) as a horizontal bar.
// Letters that have entries are clickable and jump to an anchor;
// letters with zero entries render dimmed and disabled.
//
// Two modes for the jump:
//   - anchor (default) — clicking sets `window.location.hash` so a
//                        `<section id="A">` etc on the page receives
//                        `:target` styling and scrolls into view.
//   - emit               — emits `@select` with the letter; consumer
//                        handles routing (e.g. filtering a list in
//                        place rather than scrolling to a section).
//
// Sticky-positioning is opt-in via the `sticky` prop — useful on long
// directory pages where the bar should follow the user as they scroll.

interface Props {
  /** Set of letters that have entries. Defaults to A–Z. */
  letters?: string[];
  /** Letters present in the current dataset. Anything not in this set
   *  renders dimmed + disabled. Defaults to all letters being present. */
  available?: string[];
  /** Click behavior. */
  mode?: "anchor" | "emit";
  /** Sticky-position the bar at the top of its container as the user scrolls. */
  sticky?: boolean;
  /** Optional "All" link at the start, useful when the consumer
   *  filters in place via `mode="emit"`. */
  showAll?: boolean;
  /** Currently-selected letter (in emit mode) — gets the active treatment. */
  modelValue?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  letters: () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  available: undefined,
  mode: "anchor",
  sticky: false,
  showAll: false,
  modelValue: null,
});

const emit = defineEmits<{
  "update:modelValue": [letter: string | null];
  select: [letter: string | null];
}>();

const availableSet = computed(() => {
  if (!props.available) return null;
  return new Set(props.available.map(l => l.toUpperCase()));
});

function isAvailable(letter: string): boolean {
  if (!availableSet.value) return true;
  return availableSet.value.has(letter.toUpperCase());
}

function isActive(letter: string | null): boolean {
  return props.modelValue === letter;
}

function onClick(e: Event, letter: string | null) {
  if (props.mode === "emit") {
    e.preventDefault();
    emit("update:modelValue", letter);
    emit("select", letter);
  }
  // anchor mode: let the browser handle the href, but still emit
  // for consumers that want to track the click.
  emit("select", letter);
}
</script>

<template>
  <nav
    class="tux-alpha-nav"
    :class="{ 'tux-alpha-nav--sticky': sticky }"
    aria-label="Jump to letter"
  >
    <ol class="tux-alpha-nav__list" role="list">
      <li v-if="showAll" class="tux-alpha-nav__item">
        <a
          :href="mode === 'anchor' ? '#' : undefined"
          :aria-current="isActive(null) ? 'page' : undefined"
          class="tux-alpha-nav__link tux-alpha-nav__link--all"
          :class="{ 'tux-alpha-nav__link--active': isActive(null) }"
          @click="onClick($event, null)"
        >All</a>
      </li>
      <li
        v-for="letter in letters"
        :key="letter"
        class="tux-alpha-nav__item"
      >
        <a
          v-if="isAvailable(letter)"
          :href="mode === 'anchor' ? `#${letter}` : undefined"
          :aria-current="isActive(letter) ? 'page' : undefined"
          class="tux-alpha-nav__link"
          :class="{ 'tux-alpha-nav__link--active': isActive(letter) }"
          @click="onClick($event, letter)"
        >{{ letter }}</a>
        <span
          v-else
          class="tux-alpha-nav__link tux-alpha-nav__link--disabled"
          aria-disabled="true"
        >{{ letter }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.tux-alpha-nav {
  container-type: inline-size;
  container-name: tux-alpha-nav;
  border-top: 2px solid var(--brand-primary);
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-page);
}

.tux-alpha-nav--sticky {
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--surface-raised);
}

.tux-alpha-nav__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0;
  font-family: var(--font-bold);
  font-weight: 700;
}

.tux-alpha-nav__item {
  display: inline-flex;
}

.tux-alpha-nav__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: var(--brand-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;
}

.tux-alpha-nav__link--all {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 0.625rem;
  margin-right: 0.25rem;
}

.tux-alpha-nav__link:hover,
.tux-alpha-nav__link:focus-visible {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
  outline: none;
}

.tux-alpha-nav__link--active {
  background: var(--brand-primary);
  color: #fff;
}

.tux-alpha-nav__link--active:hover,
.tux-alpha-nav__link--active:focus-visible {
  background: var(--brand-primary-deep);
  color: #fff;
}

.tux-alpha-nav__link--disabled {
  color: var(--text-muted);
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
