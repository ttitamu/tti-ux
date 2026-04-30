<script setup lang="ts">
/**
 * TuxCitations — knowledge-grounded source list for an assistant
 * message. Renders a numbered list (`[1]`, `[2]`, …) of source items
 * with title, monospace path, and optional retrieval score.
 *
 * Pattern from tti-ai-chat: each row is a 3-column grid (rank · body
 * · score) so paths can ellipsize without pushing the score off the
 * right edge. Click handlers and href targets are caller-controlled —
 * the component is presentational; the host app decides what
 * "open source" means.
 */
interface Citation {
  title: string;
  path?: string;
  score?: string | number;
  href?: string;
}

interface Props {
  items: Citation[];
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: "sources",
});

const emit = defineEmits<{
  open: [item: Citation, index: number];
}>();

function handleClick(e: MouseEvent, item: Citation, index: number) {
  if (!item.href) e.preventDefault();
  emit("open", item, index);
}
</script>

<template>
  <section class="tux-citations" :aria-label="`${label}: ${items.length}`">
    <p class="eyebrow tux-citations__head">{{ label }} · {{ items.length }}</p>
    <ol class="tux-citations__list">
      <li v-for="(c, i) in items" :key="`${c.title}-${i}`" class="tux-citations__row">
        <a
          :href="c.href || '#'"
          class="tux-citations__link"
          @click="handleClick($event, c, i)"
        >
          <span class="tux-citations__rank">[{{ i + 1 }}]</span>
          <span class="tux-citations__body">
            <span class="tux-citations__title">{{ c.title }}</span>
            <span v-if="c.path" class="tux-citations__path">{{ c.path }}</span>
          </span>
          <span v-if="c.score !== undefined" class="tux-citations__score">{{ c.score }}</span>
        </a>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.tux-citations {
  padding: 0.75rem 0.875rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-citations__head {
  margin: 0 0 0.625rem;
}

.tux-citations__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-citations__link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: baseline;
  text-decoration: none;
  color: inherit;
  border-radius: var(--radius-sm);
  transition: background var(--motion-fast) var(--ease-standard);
}

.tux-citations__link:hover {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
}

.tux-citations__rank {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--brand-primary);
  font-weight: 600;
}

.tux-citations__title {
  display: block;
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--text-primary);
}

.tux-citations__path {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-citations__score {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}
</style>
