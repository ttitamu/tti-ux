<script setup lang="ts">
// TuxShortcutsHelp — modal overlay listing every wired keyboard shortcut.
//
// Mounted globally (typically in `app.vue`) alongside TuxCommandPalette.
// Opens on `?` (handled by the parent via `defineShortcuts`, which calls
// `helpRef.value.open()`) and on programmatic open(). Uses the native
// `<dialog>` element for free focus trap + scrim + escape semantics —
// same anatomy as TuxCommandPalette so the two read as siblings.
//
// Pass a `groups` array describing your app's shortcuts:
//   [{ heading: "Navigation",
//      items: [{ keys: ["g", "t"], label: "Go to tokens", description: "Jump to /tokens" }] }]

interface ShortcutItem {
  /** Lowercase key tokens (defineShortcuts grammar): "meta", "shift", "?", "g", "t", … */
  keys: string[];
  /** Visible label. */
  label: string;
  /** Optional second line. */
  description?: string;
}

interface ShortcutGroup {
  heading: string;
  items: ShortcutItem[];
}

interface Props {
  groups: ShortcutGroup[];
  /** Render between sequence keys (e.g. "g then t"). Falls back to a thin "then". */
  sequenceSeparator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  sequenceSeparator: "then",
});

const dialogRef = ref<HTMLDialogElement | null>(null);

function open() {
  dialogRef.value?.showModal();
}

function close() {
  dialogRef.value?.close();
}

function toggle() {
  if (dialogRef.value?.open) close();
  else open();
}

defineExpose({ open, close, toggle });

// A combo (meta+k) is a single TuxKbd with all keys joined.
// A sequence (g, then t) renders two separate TuxKbds with "then" between.
// Heuristic: if any key in `keys` is a modifier ("meta"/"ctrl"/"shift"/"alt"),
// treat the whole list as one combo. Otherwise, each key is a sequence step.
function isModifier(k: string): boolean {
  const m = k.toLowerCase();
  return m === "meta" || m === "ctrl" || m === "control" || m === "shift" || m === "alt" || m === "option" || m === "cmd" || m === "command";
}

function classify(keys: string[]): "combo" | "sequence" | "single" {
  if (keys.length <= 1) return "single";
  return keys.some(isModifier) ? "combo" : "sequence";
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="tux-shortcuts"
    @close="close"
    @click="(e) => { if (e.target === dialogRef) close(); }"
  >
    <div class="tux-shortcuts__panel" data-tux-overlay data-tux-elevation="overlay">
      <header class="tux-shortcuts__header">
        <div>
          <p class="eyebrow tux-shortcuts__eyebrow">keyboard</p>
          <h2 class="heading--bold tux-shortcuts__title">Shortcuts</h2>
        </div>
        <button
          type="button"
          class="tux-shortcuts__close"
          aria-label="Close shortcuts"
          @click="close"
        >
          <Icon name="lucide:x" aria-hidden="true" />
        </button>
      </header>

      <div class="tux-shortcuts__body">
        <section
          v-for="group in groups"
          :key="group.heading"
          class="tux-shortcuts__group"
        >
          <h3 class="tux-shortcuts__group-heading">{{ group.heading }}</h3>
          <dl class="tux-shortcuts__list">
            <template
              v-for="(item, idx) in group.items"
              :key="`${group.heading}-${idx}`"
            >
              <dt class="tux-shortcuts__keys">
                <template v-if="classify(item.keys) === 'sequence'">
                  <template v-for="(k, i) in item.keys" :key="i">
                    <TuxKbd :value="k" size="lg" />
                    <span
                      v-if="i < item.keys.length - 1"
                      class="tux-shortcuts__sep"
                    >{{ sequenceSeparator }}</span>
                  </template>
                </template>
                <TuxKbd v-else :keys="item.keys" size="lg" separator="+" />
              </dt>
              <dd class="tux-shortcuts__label">
                <span class="tux-shortcuts__label-text">{{ item.label }}</span>
                <span
                  v-if="item.description"
                  class="tux-shortcuts__label-description"
                >{{ item.description }}</span>
              </dd>
            </template>
          </dl>
        </section>
      </div>

      <footer class="tux-shortcuts__footer">
        <span>Press <TuxKbd value="?" size="xs" /> from anywhere to open this.</span>
        <span><TuxKbd value="esc" size="xs" /> close</span>
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.tux-shortcuts {
  width: min(36rem, calc(100% - 2rem));
  max-height: min(36rem, calc(100% - 4rem));
  margin: auto;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}

.tux-shortcuts::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.tux-shortcuts__panel {
  background: var(--surface-raised);
  border: 2px solid var(--brand-primary);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  max-height: min(36rem, 90vh);
  overflow: hidden;
}

.tux-shortcuts__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  flex-shrink: 0;
}

.tux-shortcuts__eyebrow {
  margin: 0 0 0.125rem;
}

.tux-shortcuts__title {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
}

.tux-shortcuts__close {
  background: transparent;
  border: 0;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
}
.tux-shortcuts__close:hover {
  color: var(--text-primary);
  background: var(--surface-sunken);
}

.tux-shortcuts__body {
  padding: 1rem 1.25rem 1.25rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.tux-shortcuts__group + .tux-shortcuts__group {
  margin-top: 1.5rem;
}

.tux-shortcuts__group-heading {
  margin: 0 0 0.625rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
}

.tux-shortcuts__list {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 1.25rem;
  row-gap: 0.5rem;
  margin: 0;
}

.tux-shortcuts__keys {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  min-height: 1.875rem;
}

.tux-shortcuts__sep {
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-style: italic;
}

.tux-shortcuts__label {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  align-self: center;
}

.tux-shortcuts__label-text {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.3;
}

.tux-shortcuts__label-description {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.35;
}

.tux-shortcuts__footer {
  display: flex;
  gap: 1.25rem;
  padding: 0.625rem 1.25rem;
  background: var(--surface-sunken);
  border-top: 1px solid var(--surface-border);
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  flex-shrink: 0;
  flex-wrap: wrap;
}
</style>
