<script setup lang="ts">
// TuxKbd — token-styled keyboard-key hint.
//
// Renders one or more `<kbd>` elements with the brand styling used across
// the system (footer hints, command-palette esc indicator, per-item
// shortcut hints, the shortcuts-help overlay). Consolidates the markup
// that previously lived in three hand-rolled scoped CSS blocks inside
// TuxCommandPalette.
//
// Two ways to use:
//   <TuxKbd value="esc" />
//   <TuxKbd :keys="['meta', 'k']" />
//   <TuxKbd><slot>?</slot></TuxKbd>
//
// `keys` is the canonical entry point — pass the lowercase shortcut name
// (matching defineShortcuts' grammar: "meta", "ctrl", "shift", "alt",
// "enter", "escape", "arrowup", etc.) and TuxKbd renders the right
// per-platform symbol (⌘/Ctrl, ⇧, ⌥/Alt, ↵, esc, ↑, etc.). Unknown keys
// are passed through verbatim so letters and digits render as typed.
//
// Platform detection runs post-hydration to avoid SSR/client mismatch —
// the server always renders the PC form (no Unicode glyphs), and the
// client swaps to ⌘/⌥ on Mac after mount. This is the same tradeoff
// Nuxt UI's UKbd makes.

interface Props {
  /** Single key. Use `keys` for multi-key combos. */
  value?: string;
  /** Multi-key combo. Each entry renders as a separate <kbd>. */
  keys?: string[];
  /** Visual size. `sm` is the default in-list hint; `xs` is for tight footer rows; `lg` is for help overlays. */
  size?: "xs" | "sm" | "lg";
  /** Separator string rendered between keys. Empty by default (kbds sit flush). Pass "+" for the conventional combo notation. */
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "sm",
  separator: "",
});

const isMac = ref(false);
onMounted(() => {
  if (typeof navigator !== "undefined") {
    isMac.value = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  }
});

const MAC_SYMBOLS: Record<string, string> = {
  meta: "⌘",
  cmd: "⌘",
  command: "⌘",
  ctrl: "⌃",
  control: "⌃",
  shift: "⇧",
  alt: "⌥",
  option: "⌥",
  enter: "↵",
  return: "↵",
  escape: "esc",
  esc: "esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  backspace: "⌫",
  delete: "⌦",
  tab: "⇥",
  space: "␣",
};

const PC_SYMBOLS: Record<string, string> = {
  meta: "Ctrl",
  cmd: "Ctrl",
  command: "Ctrl",
  ctrl: "Ctrl",
  control: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  option: "Alt",
  enter: "↵",
  return: "↵",
  escape: "esc",
  esc: "esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  backspace: "⌫",
  delete: "Del",
  tab: "Tab",
  space: "␣",
};

function displayKey(key: string): string {
  const k = key.toLowerCase();
  const table = isMac.value ? MAC_SYMBOLS : PC_SYMBOLS;
  if (table[k]) return table[k];
  // Single letter / digit / symbol — uppercase letters for readability,
  // pass everything else through.
  if (/^[a-z]$/.test(k)) return k.toUpperCase();
  return key;
}

const displayKeys = computed<string[]>(() => {
  if (props.keys && props.keys.length > 0) return props.keys.map(displayKey);
  if (props.value) return [displayKey(props.value)];
  return [];
});

const hasSlot = computed(() => !!useSlots().default);
</script>

<template>
  <span :class="['tux-kbd-group', `tux-kbd-group--${size}`]">
    <template v-if="displayKeys.length > 0">
      <template v-for="(k, i) in displayKeys" :key="i">
        <kbd class="tux-kbd">{{ k }}</kbd>
        <span
          v-if="separator && i < displayKeys.length - 1"
          class="tux-kbd-sep"
          aria-hidden="true"
        >{{ separator }}</span>
      </template>
    </template>
    <kbd v-else-if="hasSlot" class="tux-kbd">
      <slot />
    </kbd>
  </span>
</template>

<style scoped>
.tux-kbd-group {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.tux-kbd-group--xs {
  gap: 0.1875rem;
}

.tux-kbd-group--lg {
  gap: 0.375rem;
}

.tux-kbd {
  font-family: var(--font-mono);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 500;
  line-height: 1;
}

/* Default size — palette esc hint, per-item shortcut, inline doc hints. */
.tux-kbd-group--sm .tux-kbd {
  font-size: 0.6875rem;
  padding: 0.125rem 0.4375rem;
  min-width: 1.25rem;
  min-height: 1.25rem;
}

/* Compact — footer-row hints in the command palette. Smaller chrome so
   three or four pairs fit on one line without crowding the labels. */
.tux-kbd-group--xs .tux-kbd {
  font-size: 0.625rem;
  padding: 0.0625rem 0.375rem;
  min-width: 1.125rem;
  min-height: 1.125rem;
  color: var(--text-muted);
  background: var(--surface-raised);
}

/* Large — shortcuts-help overlay, /components/kbd demo. Reads as the
   "anchor" form of the affordance. */
.tux-kbd-group--lg .tux-kbd {
  font-size: 0.8125rem;
  padding: 0.25rem 0.625rem;
  min-width: 1.625rem;
  min-height: 1.625rem;
}

.tux-kbd-sep {
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.75em;
  font-weight: 400;
}
</style>
