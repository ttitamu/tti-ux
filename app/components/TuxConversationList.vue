<script setup lang="ts">
/**
 * TuxConversationList — left-rail history of past conversations,
 * grouped by temporal bucket (TODAY / YESTERDAY / THIS WEEK / …).
 *
 * The active item gets a 3px maroon left border + a 10%-tint maroon
 * background. Bucket labels render as eyebrow text (mono · ALLCAPS ·
 * tracked-out). Caller controls grouping logic — this component is
 * presentational and accepts groups directly.
 *
 * Per-row actions (delete/archive/rename) plug in via the `#item-actions`
 * scoped slot. The slot is positioned at the right edge of each row and
 * receives the item as a slot prop. Hover/focus on the row reveals slot
 * contents — keep them subtle (icon-only is the convention). When the
 * slot is absent the row renders exactly as before (presentational-only
 * legacy behavior is preserved).
 */
interface ConversationItem {
  id: string;
  title: string;
  meta?: string;
}

interface ConversationGroup {
  group: string;
  items: ConversationItem[];
}

interface Props {
  groups: ConversationGroup[];
  activeId?: string | null;
}

withDefaults(defineProps<Props>(), {
  activeId: null,
});

const emit = defineEmits<{
  pick: [id: string];
}>();

const slots = useSlots();
const hasItemActions = computed(() => Boolean(slots["item-actions"]));
</script>

<template>
  <nav class="tux-conversation-list" aria-label="Conversation history">
    <div v-for="g in groups" :key="g.group" class="tux-conversation-list__group">
      <p class="tux-conversation-list__bucket">{{ g.group }}</p>
      <ul class="tux-conversation-list__items">
        <li
          v-for="it in g.items"
          :key="it.id"
          class="tux-conversation-list__row"
          :class="{ 'tux-conversation-list__row--has-actions': hasItemActions }"
        >
          <a
            href="#"
            class="tux-conversation-list__item"
            :class="{ 'tux-conversation-list__item--active': activeId === it.id }"
            :aria-current="activeId === it.id ? 'page' : undefined"
            @click.prevent="emit('pick', it.id)"
          >
            <span class="tux-conversation-list__title">{{ it.title }}</span>
            <span v-if="it.meta" class="tux-conversation-list__meta">{{ it.meta }}</span>
          </a>
          <span v-if="hasItemActions" class="tux-conversation-list__actions">
            <slot name="item-actions" :item="it" />
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.tux-conversation-list {
  flex: 1;
  overflow: auto;
  padding: 0.5rem;
}

.tux-conversation-list__group {
  margin-bottom: 0.75rem;
}

.tux-conversation-list__bucket {
  margin: 0;
  padding: 0.625rem 0.75rem 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
}

.tux-conversation-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-conversation-list__row {
  position: relative;
}

.tux-conversation-list__item {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border-left: 3px solid transparent;
  text-decoration: none;
  color: var(--text-primary);
  background: transparent;
  transition: background var(--motion-fast) var(--ease-standard);
}

/* Make room for the actions slot when present so long titles ellipsize
 * before colliding with the icon button. */
.tux-conversation-list__row--has-actions .tux-conversation-list__item {
  padding-right: 2rem;
}

.tux-conversation-list__item:hover {
  background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
}

.tux-conversation-list__actions {
  position: absolute;
  top: 50%;
  right: 0.375rem;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  /* Subtle baseline; full opacity on row hover or when the menu is open
   * (consumer controls the latter via a CSS class or aria-expanded). */
  opacity: 0;
  transition: opacity var(--motion-fast) var(--ease-standard);
  pointer-events: none;
}

.tux-conversation-list__row:hover .tux-conversation-list__actions,
.tux-conversation-list__row:focus-within .tux-conversation-list__actions {
  opacity: 1;
  pointer-events: auto;
}

.tux-conversation-list__item--active {
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  border-left-color: var(--brand-primary);
}

.tux-conversation-list__title {
  display: block;
  font-size: 0.825rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tux-conversation-list__item--active .tux-conversation-list__title {
  font-weight: 600;
}

.tux-conversation-list__meta {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
