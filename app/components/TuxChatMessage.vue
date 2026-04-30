<script setup lang="ts">
/**
 * TuxChatMessage — one message in a tti-ai-chat-style conversation.
 *
 * Two roles: `user` and `assistant`. The two render the same shape
 * (avatar + author + timestamp + body + optional citations + tool
 * row), but the assistant version sits on `--surface-sunken` to
 * separate model output from human input visually. The grid is
 * `40px 1fr` so avatars align across the conversation regardless
 * of message length.
 *
 * `meta` is a free-form line that renders under the body (e.g.
 * "anthropic/haiku-4.5 · 2.1s"). For citations, slot in
 * `<TuxCitations>` via the default slot or its `#citations` slot.
 */
type Role = "user" | "assistant";

interface Props {
  role?: Role;
  author: string;
  timestamp?: string;
  meta?: string;
  initials?: string;
}

const props = withDefaults(defineProps<Props>(), {
  role: "user",
  initials: undefined,
  timestamp: undefined,
  meta: undefined,
});

const computedInitials = computed(() => {
  if (props.initials) return props.initials;
  return props.author
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
});

const isAssistant = computed(() => props.role === "assistant");
</script>

<template>
  <article
    class="tux-chat-message"
    :class="`tux-chat-message--${role}`"
    :data-role="role"
  >
    <div class="tux-chat-message__inner">
      <div class="tux-chat-message__avatar">
        <div v-if="isAssistant" class="tux-chat-message__avatar-assistant">
          <slot name="avatar">
            <img
              src="/TTI-glyph.svg"
              alt=""
              class="tux-chat-message__avatar-glyph"
              aria-hidden="true"
            />
          </slot>
        </div>
        <div v-else class="tux-chat-message__avatar-user">
          <slot name="avatar">{{ computedInitials }}</slot>
        </div>
      </div>

      <div class="tux-chat-message__body">
        <header class="tux-chat-message__head">
          <span class="tux-chat-message__author">{{ author }}</span>
          <span v-if="timestamp" class="tux-chat-message__ts">{{ timestamp }}</span>
        </header>
        <div class="tux-chat-message__content">
          <slot />
        </div>
        <div v-if="$slots.citations" class="tux-chat-message__citations">
          <slot name="citations" />
        </div>
        <p v-if="meta" class="tux-chat-message__meta">{{ meta }}</p>
        <div v-if="$slots.tools" class="tux-chat-message__tools">
          <slot name="tools" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.tux-chat-message {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--surface-border);
  background: transparent;
  container-type: inline-size;
  container-name: tux-chat-message;
}

.tux-chat-message--assistant {
  background: var(--surface-sunken);
}

.tux-chat-message__inner {
  max-width: 820px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 1rem;
}

@container tux-chat-message (max-width: 540px) {
  .tux-chat-message {
    padding: 1rem 1.25rem;
  }
  .tux-chat-message__inner {
    grid-template-columns: 32px 1fr;
    gap: 0.75rem;
  }
}

.tux-chat-message__avatar-user,
.tux-chat-message__avatar-assistant {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.76rem;
  font-weight: 600;
}

.tux-chat-message__avatar-user {
  background: var(--surface-border);
  color: var(--text-secondary);
}

.tux-chat-message__avatar-assistant {
  background: var(--brand-primary);
  color: var(--neutral-0);
  overflow: hidden;
}

.tux-chat-message__avatar-glyph {
  width: 70%;
  height: 70%;
  object-fit: contain;
  display: block;
}

.tux-chat-message__head {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  margin-bottom: 0.375rem;
  flex-wrap: wrap;
}

.tux-chat-message__author {
  font-weight: 600;
  font-size: 0.825rem;
  color: var(--text-primary);
}

.tux-chat-message__ts,
.tux-chat-message__meta {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.tux-chat-message__meta {
  margin: 0.875rem 0 0;
}

.tux-chat-message__content {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-primary);
}

.tux-chat-message__citations {
  margin-top: 1rem;
}

.tux-chat-message__tools {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.125rem;
  margin-left: -0.375rem;
}
</style>
