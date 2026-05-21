<script setup lang="ts">
/**
 * TuxArtifact — structured container for AI-generated output.
 *
 * Pattern from Vercel's AI SDK Elements (`Artifact`): when the model
 * returns a discrete output (code file, dataset, document, image), it
 * deserves its own framed surface separate from the chat body, with
 * a header that names + dates the artifact and exposes copy / save /
 * regenerate / share actions.
 *
 * **Standalone — no container assumptions.** Consumers wrap the
 * artifact in whatever they need: inline-after-message in a chat
 * stream, docked into [`app/layouts/sidebar.vue`](../layouts/sidebar.vue)
 * `#aside`, or in a full-page review pane. The component owns the
 * visual chrome (frame + header + actions); the body is a slot.
 *
 * Two action affordances:
 *   - Common actions (`copy` / `download` / `regenerate` / `share`) get
 *     icon buttons via the `actions` prop. Hide all of them by passing
 *     an empty array; show a subset by passing only the ones you want.
 *   - Custom actions plug in via the `#actions` slot. Common + custom
 *     stack in the same row, common first.
 *
 * All four common actions emit named events. The host wires the actual
 * behavior (`@download` builds the file blob, `@regenerate` calls the
 * model, etc.) — the component is presentational.
 */

type ArtifactAction = "copy" | "download" | "regenerate" | "share";

interface Props {
  /** Artifact title shown in the header. */
  title: string;
  /** Subtitle / metadata line under the title. Typical:
   *  "Updated 1 minute ago" or "src/algorithm.py · 32 lines". */
  meta?: string;
  /** Lucide icon name rendered before the title. Default
   *  `lucide:file-code` for code artifacts; consumers pass
   *  `lucide:file-text` / `lucide:image` / etc. for other shapes. */
  icon?: string;
  /** Which common actions to expose. Default: all four. */
  actions?: ArtifactAction[];
  /** Disable header actions (e.g. while regenerating). */
  busy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  meta: undefined,
  icon: "lucide:file-code",
  actions: () => ["copy", "download", "regenerate", "share"],
  busy: false,
});

const emit = defineEmits<{
  copy: [];
  download: [];
  regenerate: [];
  share: [];
}>();

const has = (a: ArtifactAction) => props.actions.includes(a);

// TypeScript can't narrow a union to a single literal emit name in a
// generic emit call, so dispatch via an explicit switch. This is the
// same shape as the template's per-button @click; just typed.
function onAction(a: ArtifactAction) {
  switch (a) {
    case "copy":       emit("copy"); break;
    case "download":   emit("download"); break;
    case "regenerate": emit("regenerate"); break;
    case "share":      emit("share"); break;
  }
}

const labels: Record<ArtifactAction, string> = {
  copy: "Copy",
  download: "Download",
  regenerate: "Regenerate",
  share: "Share",
};
const icons: Record<ArtifactAction, string> = {
  copy: "lucide:copy",
  download: "lucide:download",
  regenerate: "lucide:refresh-cw",
  share: "lucide:share-2",
};
</script>

<template>
  <section
    class="tux-artifact"
    :class="{ 'tux-artifact--busy': busy }"
    :aria-busy="busy || undefined"
  >
    <header class="tux-artifact__head">
      <div class="tux-artifact__head-text">
        <h3 class="tux-artifact__title">
          <Icon
            v-if="icon"
            :name="icon"
            class="tux-artifact__title-icon"
            aria-hidden="true"
          />
          <span>{{ title }}</span>
        </h3>
        <p v-if="meta" class="tux-artifact__meta">{{ meta }}</p>
      </div>

      <div
        v-if="actions.length || $slots.actions"
        class="tux-artifact__actions"
        role="toolbar"
        :aria-label="`${title} actions`"
      >
        <button
          v-for="a in (['copy','download','regenerate','share'] as ArtifactAction[]).filter(has)"
          :key="a"
          type="button"
          class="tux-artifact__action"
          :aria-label="labels[a]"
          :disabled="busy"
          @click="onAction(a)"
        >
          <Icon
            :name="a === 'regenerate' && busy ? 'lucide:loader-2' : icons[a]"
            class="tux-artifact__action-icon"
            :class="{ 'tux-artifact__action-icon--spin': a === 'regenerate' && busy }"
          />
        </button>
        <slot name="actions" />
      </div>
    </header>

    <div class="tux-artifact__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="tux-artifact__foot">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.tux-artifact {
  container-type: inline-size;
  container-name: tux-artifact;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-body);
}

.tux-artifact--busy {
  cursor: progress;
}

.tux-artifact__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
}

.tux-artifact__head-text {
  min-width: 0;
  flex: 1;
}

.tux-artifact__title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.8125rem;
  color: var(--text-primary);
  min-width: 0;
}

.tux-artifact__title-icon {
  flex-shrink: 0;
  width: 0.9375rem;
  height: 0.9375rem;
  color: var(--brand-primary);
}

.tux-artifact__title > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-artifact__meta {
  margin: 0.125rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.tux-artifact__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
}

.tux-artifact__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-artifact__action:hover:not(:disabled),
.tux-artifact__action:focus-visible:not(:disabled) {
  background: var(--surface-page);
  color: var(--brand-primary);
  outline: none;
}

.tux-artifact__action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-artifact__action-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-artifact__action-icon--spin {
  animation: tux-artifact-spin 0.8s linear infinite;
}

@keyframes tux-artifact-spin {
  to { transform: rotate(360deg); }
}

.tux-artifact__body {
  flex: 1;
  min-height: 0;
  /* Children — TuxCodeBlock, TuxProse, an image, a table — own their
     own padding. Artifact provides the frame; the contents fill it. */
}

.tux-artifact__foot {
  padding: 0.5rem 0.875rem;
  border-top: 1px solid var(--surface-border);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}
</style>
