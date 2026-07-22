<script setup lang="ts">
/**
 * TuxInlineCitation — academic-style inline reference pill.
 *
 * Renders as a superscripted bracketed number (`[3]`) inside body
 * text, mirroring the inline-citation pattern from journal articles
 * and how TTI's own research collateral references sources. On
 * hover/focus, an `UPopover` reveals the full source (title + url +
 * optional excerpt + optional score from RAG retrieval).
 *
 * Distinct from [`TuxCitations`](./TuxCitations.vue), which renders
 * the *footer* list at the bottom of an assistant message. The two
 * compose naturally: inline pills index into the footer list.
 *
 * Vercel's reference (`InlineCitation`) aggregates multiple sources
 * per pill ("example.com +5"); the academic convention is
 * one-source-per-pill, which is what TUX adopts. Consumers needing
 * the "+N" pattern can render the pill with `n` and a count in the
 * label slot.
 *
 * Pure presentation. Host wires the popover content as data.
 */

interface Props {
  /** 1-indexed citation rank. Renders as `[n]` by default. */
  n: number;
  /** Source title shown in the popover header. */
  title: string;
  /** Source URL. If provided, the popover title becomes a link, and
   *  the pill itself behaves as a link (Ctrl/Cmd-click opens). */
  href?: string;
  /** Short excerpt or context shown below the title. */
  excerpt?: string;
  /** Retrieval score (e.g., "0.87" or "rank 3"). */
  score?: string | number;
  /** Custom pill label, e.g. "iv" for roman-numeral citations. */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  href: undefined,
  excerpt: undefined,
  score: undefined,
  label: undefined,
});

const emit = defineEmits<{
  open: [n: number];
}>();

const pillText = computed(() => props.label ?? String(props.n));

function handleClick(e: MouseEvent) {
  emit("open", props.n);
  if (!props.href) e.preventDefault();
}
</script>

<template>
  <UPopover mode="hover" :open-delay="100" :close-delay="120">
    <a
      :href="href || '#'"
      class="tux-inline-citation"
      :aria-label="`Citation ${n}: ${title}`"
      @click="handleClick"
    >
      <span class="tux-inline-citation__pill">[{{ pillText }}]</span>
    </a>

    <template #content>
      <article class="tux-inline-citation__panel">
        <header class="tux-inline-citation__panel-head">
          <span class="tux-inline-citation__panel-rank">[{{ pillText }}]</span>
          <a
            v-if="href"
            :href="href"
            class="tux-inline-citation__panel-title tux-inline-citation__panel-title--link"
            target="_blank"
            rel="noopener noreferrer"
          >{{ title }}</a>
          <span v-else class="tux-inline-citation__panel-title">{{ title }}</span>
        </header>
        <p v-if="href" class="tux-inline-citation__panel-url">{{ href }}</p>
        <p v-if="excerpt" class="tux-inline-citation__panel-excerpt">{{ excerpt }}</p>
        <p v-if="score !== undefined" class="tux-inline-citation__panel-score">
          <span class="eyebrow">score</span> {{ score }}
        </p>
      </article>
    </template>
  </UPopover>
</template>

<style scoped>
.tux-inline-citation {
  display: inline-block;
  vertical-align: baseline;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  margin-left: 1px;
}

.tux-inline-citation__pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.6875em;
  font-weight: 700;
  line-height: 1;
  padding: 0.0625em 0.25em;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  color: var(--brand-primary);
  vertical-align: super;
  letter-spacing: 0;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-inline-citation:hover .tux-inline-citation__pill,
.tux-inline-citation:focus-visible .tux-inline-citation__pill {
  background: var(--brand-primary);
  color: var(--text-inverse);
}

.tux-inline-citation:focus-visible {
  outline: none;
}

.tux-inline-citation:focus-visible .tux-inline-citation__pill {
  box-shadow: var(--shadow-focus);
}

.tux-inline-citation__panel {
  max-width: 22rem;
  padding: 0.875rem 1rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.tux-inline-citation__panel-head {
  display: flex;
  align-items: baseline;
  gap: 0.4375rem;
  margin-bottom: 0.375rem;
}

.tux-inline-citation__panel-rank {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--brand-primary);
  flex-shrink: 0;
}

.tux-inline-citation__panel-title {
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.tux-inline-citation__panel-title--link {
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary) 35%, transparent);
  transition: border-color 0.15s ease;
}

.tux-inline-citation__panel-title--link:hover {
  border-bottom-color: var(--brand-primary);
}

.tux-inline-citation__panel-url {
  margin: 0 0 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

.tux-inline-citation__panel-excerpt {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
}

.tux-inline-citation__panel-score {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
