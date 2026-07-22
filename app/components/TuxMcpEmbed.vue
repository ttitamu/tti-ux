<script setup lang="ts">
/**
 * TuxMcpEmbed — frame for interactive third-party MCP app output.
 *
 * Sister to `TuxArtifact`, not a replacement. The split:
 *   - `TuxArtifact` — static AI-generated output (code file, doc,
 *     image). Header actions are copy / download / regenerate / share.
 *   - `TuxMcpEmbed`  — *interactive* third-party app output rendered
 *     into the conversation. Header actions are
 *     collapse / expand / exit (window-chrome shape, not file-chrome).
 *
 * Anatomy (per the MCP Apps for Claude reference):
 *   - App identity bar — icon + name + optional source / version
 *   - Window controls — collapse caret · expand-to-full · exit X
 *   - Skeleton loading state while the app initializes
 *   - Container slot for the app surface (iframe, canvas, custom UI)
 *
 * Three display tiers (documented in `design/components.md`
 * Conventions): inline card (default), inline carousel (multiple
 * embeds for browse-then-pick), full screen (expanded mode of this
 * component — emits `expand`; host owns the actual layout switch).
 *
 * Usage:
 *   <tux-mcp-embed
 *     app-name="Linear"
 *     app-icon="lucide:square-kanban"
 *     :loading="loading"
 *     @collapse="onCollapse"
 *     @expand="onExpand"
 *     @exit="onExit"
 *   >
 *     <iframe :src="appUrl" class="w-full h-96" />
 *   </tux-mcp-embed>
 */

interface Props {
  /** Display name of the MCP app. */
  appName: string;
  /** Lucide icon name (or `app-icon-url` if pixel logo). Defaults to
   *  the generic plug icon. */
  appIcon?: string;
  /** Pixel logo URL — takes precedence over `appIcon` when set. */
  appIconUrl?: string;
  /** Optional subtitle (version, source, scope). Renders muted-mono
   *  under the app name. */
  source?: string;
  /** Show the loading skeleton instead of the slot content. */
  loading?: boolean;
  /** Hide the collapse caret. */
  collapsible?: boolean;
  /** Hide the expand-to-full button. */
  expandable?: boolean;
  /** Hide the exit X. */
  closable?: boolean;
  /** Start in the collapsed state. Component owns its collapsed
   *  state internally — host can override via this prop + the
   *  `collapse` / `expand` events. */
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  appIcon: "lucide:plug",
  appIconUrl: undefined,
  source: undefined,
  loading: false,
  collapsible: true,
  expandable: true,
  closable: true,
  collapsed: false,
});

const emit = defineEmits<{
  collapse: [];
  expand: [];
  exit: [];
}>();

// Local collapsed state — synced from prop on mount + when prop changes.
// Toggling the caret emits `collapse` so the host can persist if needed,
// but the host doesn't have to wire it to update.
const collapsedLocal = ref(props.collapsed);
watch(() => props.collapsed, (v) => { collapsedLocal.value = v; });

function onToggleCollapse() {
  collapsedLocal.value = !collapsedLocal.value;
  emit("collapse");
}
</script>

<template>
  <section
    class="tux-mcp-embed"
    :class="{
      'tux-mcp-embed--collapsed': collapsedLocal,
      'tux-mcp-embed--loading': loading,
    }"
    :aria-busy="loading || undefined"
  >
    <header class="tux-mcp-embed__head">
      <div class="tux-mcp-embed__identity">
        <span class="tux-mcp-embed__icon" aria-hidden="true">
          <img v-if="appIconUrl" :src="appIconUrl" :alt="''">
          <Icon v-else :name="appIcon" />
        </span>
        <div class="tux-mcp-embed__identity-text">
          <p class="tux-mcp-embed__name">{{ appName }}</p>
          <p v-if="source" class="tux-mcp-embed__source">{{ source }}</p>
        </div>
      </div>

      <div class="tux-mcp-embed__controls" role="toolbar" :aria-label="`${appName} window controls`">
        <button
          v-if="collapsible"
          type="button"
          class="tux-mcp-embed__control"
          :aria-label="collapsedLocal ? 'Expand' : 'Collapse'"
          :aria-expanded="!collapsedLocal"
          @click="onToggleCollapse"
        >
          <Icon
            :name="collapsedLocal ? 'lucide:chevron-down' : 'lucide:chevron-up'"
            class="tux-mcp-embed__control-icon"
          />
        </button>
        <button
          v-if="expandable"
          type="button"
          class="tux-mcp-embed__control"
          aria-label="Expand to full screen"
          @click="emit('expand')"
        >
          <Icon name="lucide:maximize-2" class="tux-mcp-embed__control-icon" />
        </button>
        <button
          v-if="closable"
          type="button"
          class="tux-mcp-embed__control tux-mcp-embed__control--exit"
          aria-label="Close"
          @click="emit('exit')"
        >
          <Icon name="lucide:x" class="tux-mcp-embed__control-icon" />
        </button>
      </div>
    </header>

    <div v-show="!collapsedLocal" class="tux-mcp-embed__body">
      <div v-if="loading" class="tux-mcp-embed__skeleton" aria-hidden="true">
        <div class="tux-mcp-embed__skeleton-bar tux-mcp-embed__skeleton-bar--lg" />
        <div class="tux-mcp-embed__skeleton-bar tux-mcp-embed__skeleton-bar--md" />
        <div class="tux-mcp-embed__skeleton-bar tux-mcp-embed__skeleton-bar--sm" />
        <div class="tux-mcp-embed__skeleton-block" />
        <span class="sr-only">Loading {{ appName }}…</span>
      </div>
      <div v-else class="tux-mcp-embed__container">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tux-mcp-embed {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-body);
}

/* Subtle left-edge accent to visually distinguish a third-party app
   frame from a first-party TuxArtifact — both share the same chrome
   otherwise so they sit naturally next to each other in a chat. */
.tux-mcp-embed::before {
  content: "";
  position: absolute;
  margin-top: 0.5rem;
  margin-left: -1px;
  width: 3px;
  height: 1.25rem;
  background: var(--brand-accent);
  border-radius: 0 3px 3px 0;
}
.tux-mcp-embed { position: relative; }

.tux-mcp-embed__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.625rem 0.5rem 0.875rem;
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
}

.tux-mcp-embed--collapsed .tux-mcp-embed__head {
  border-bottom-color: transparent;
}

.tux-mcp-embed__identity {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.tux-mcp-embed__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  color: var(--brand-accent);
  flex-shrink: 0;
}
.tux-mcp-embed__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: calc(var(--radius-sm) - 1px);
}
.tux-mcp-embed__icon :deep(svg) {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-mcp-embed__identity-text {
  min-width: 0;
}

.tux-mcp-embed__name {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-mcp-embed__source {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.tux-mcp-embed__controls {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
}

.tux-mcp-embed__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.625rem;
  height: 1.625rem;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.tux-mcp-embed__control:hover,
.tux-mcp-embed__control:focus-visible {
  background: var(--surface-page);
  color: var(--brand-primary);
  outline: none;
}
.tux-mcp-embed__control--exit:hover,
.tux-mcp-embed__control--exit:focus-visible {
  color: var(--color-error, oklch(0.55 0.18 25));
}
.tux-mcp-embed__control-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-mcp-embed__body {
  flex: 1;
  min-height: 0;
}

.tux-mcp-embed__container {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Skeleton — three text bars + one block. Honors prefers-reduced-motion
   by switching from shimmer to a static muted fill. */
.tux-mcp-embed__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1rem;
}
.tux-mcp-embed__skeleton-bar,
.tux-mcp-embed__skeleton-block {
  background: linear-gradient(
    90deg,
    var(--surface-sunken) 0%,
    color-mix(in srgb, var(--surface-sunken) 60%, var(--surface-page)) 50%,
    var(--surface-sunken) 100%
  );
  background-size: 200% 100%;
  animation: tux-mcp-embed-shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
.tux-mcp-embed__skeleton-bar { height: 0.75rem; }
.tux-mcp-embed__skeleton-bar--lg { width: 60%; }
.tux-mcp-embed__skeleton-bar--md { width: 45%; }
.tux-mcp-embed__skeleton-bar--sm { width: 30%; }
.tux-mcp-embed__skeleton-block {
  height: 6rem;
  margin-top: 0.25rem;
}

@keyframes tux-mcp-embed-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .tux-mcp-embed__skeleton-bar,
  .tux-mcp-embed__skeleton-block {
    background: var(--surface-sunken);
    animation: none;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
