<script setup lang="ts">
// TuxCommandPalette — Command Palette 2.0 (⌘K).
//
// Opens with ⌘K (Mac) or Ctrl+K (Windows/Linux) and '/' shortcut.
// Search input at the top, category filter pill strip, grouped command list
// with live color swatches, badges, and one-click copy support.
// Built on the native `<dialog>` element — gives us free focus trap, scrim,
// and accessible semantics.

export type CommandCategory = "actions" | "components" | "tokens" | "docs";
export type CommandFilterTab = "all" | CommandCategory;

export interface Command {
  /** Stable id for keyed render + arrow nav. */
  id: string;
  /** Visible label. */
  label: string;
  /** Optional description below the label. */
  description?: string;
  /** Lucide icon name (e.g. "lucide:search"). */
  icon?: string;
  /** Display this hint as a small `<kbd>` on the right (e.g. ⌘+P). */
  shortcut?: string;
  /** Functional category for filtering */
  category?: CommandCategory;
  /** Metadata tag badge, e.g. "Action", "Token", "Component" */
  badge?: string;
  /** Badge color styling tone */
  badgeTone?: "brand" | "neutral" | "ok" | "warning" | "info";
  /** Hex or CSS color string for live swatch preview */
  tokenValue?: string;
  /** Whether item is a color token */
  isColor?: boolean;
  /** Text to copy to clipboard on selection */
  copyText?: string;
  /** Internal route. Mutually exclusive with `action`. */
  to?: string;
  /** External href. Mutually exclusive with `action`. */
  href?: string;
  /** Run an arbitrary function on select. Closes the palette after. */
  action?: () => void | Promise<void>;
}

export interface CommandGroup {
  heading: string;
  category?: CommandCategory;
  items: Command[];
}

interface Props {
  groups: CommandGroup[];
  /** Placeholder for the input. */
  placeholder?: string;
  /** Disable the global ⌘K hook (e.g. when a child manages its own). */
  disableHotkey?: boolean;
  /** Override the hotkey character. Defaults to "k". */
  hotkey?: string;
  /** Whether to show category filter pills below input. */
  showTabs?: boolean;
  /** Initial filter tab. */
  defaultTab?: CommandFilterTab;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Type a command, token (--), component (@), or search…",
  disableHotkey: false,
  hotkey: "k",
  showTabs: true,
  defaultTab: "all",
});

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const query = ref("");
const activeIndex = ref(0);
const activeTab = ref<CommandFilterTab>(props.defaultTab);

const router = useRouter();

function setTab(tab: CommandFilterTab) {
  activeTab.value = tab;
  // If query starts with a prefix, remove it to avoid double-filtering
  if (/^([>@#]|\-\-|act:|comp:|token:|\$)/.test(query.value)) {
    query.value = "";
  }
  nextTick(() => inputRef.value?.focus());
}

/** Determines effective category and query string from prefix or active tab */
const parsedQuery = computed(() => {
  const raw = query.value.trim();
  if (raw.startsWith(">") || raw.toLowerCase().startsWith("act:")) {
    return {
      tab: "actions" as CommandFilterTab,
      search: raw.replace(/^(>|act:)\s*/i, "").toLowerCase(),
    };
  }
  if (raw.startsWith("@") || raw.toLowerCase().startsWith("comp:")) {
    return {
      tab: "components" as CommandFilterTab,
      search: raw.replace(/^(@|comp:)\s*/i, "").toLowerCase(),
    };
  }
  if (raw.startsWith("--") || raw.toLowerCase().startsWith("token:") || raw.startsWith("$")) {
    return {
      tab: "tokens" as CommandFilterTab,
      search: raw.replace(/^(--|token:|\$)\s*/i, "").toLowerCase(),
    };
  }
  if (raw.startsWith("#") || raw.toLowerCase().startsWith("doc:")) {
    return {
      tab: "docs" as CommandFilterTab,
      search: raw.replace(/^(#|doc:)\s*/i, "").toLowerCase(),
    };
  }
  return {
    tab: activeTab.value,
    search: raw.toLowerCase(),
  };
});

function groupMatchesTab(heading: string, tab: CommandFilterTab): boolean {
  if (tab === "all") return true;
  const h = heading.toLowerCase();
  if (tab === "actions") return h.includes("action") || h.includes("quick");
  if (tab === "components") return h.includes("component");
  if (tab === "tokens") return h.includes("token") || h.includes("palette");
  if (tab === "docs") return h.includes("doc") || h.includes("guide") || h.includes("overview") || h.includes("navigation") || h.includes("jump");
  return false;
}

const filteredGroups = computed<CommandGroup[]>(() => {
  const { tab, search } = parsedQuery.value;

  return props.groups
    .map((group) => {
      // Check group-level category match
      const groupCategoryMatch = group.category
        ? tab === "all" || group.category === tab
        : groupMatchesTab(group.heading, tab);

      const items = group.items.filter((item) => {
        // Check item-level category match if group is broad
        if (tab !== "all") {
          const itemCategory = item.category || (item.label.startsWith("--") ? "tokens" : undefined);
          if (itemCategory && itemCategory !== tab) return false;
          if (!itemCategory && !groupCategoryMatch) return false;
        }

        if (!search) return true;

        const haystack = `${item.label} ${item.description ?? ""} ${item.badge ?? ""} ${item.category ?? ""}`.toLowerCase();
        const copyHaystack = (item.copyText ?? "").toLowerCase();
        return haystack.includes(search) || copyHaystack.includes(search);
      });

      return {
        heading: group.heading,
        category: group.category,
        items,
      };
    })
    .filter((group) => group.items.length > 0);
});

// Flat list of items in display order — used for keyboard nav.
const flatItems = computed<Command[]>(() =>
  filteredGroups.value.flatMap((g) => g.items),
);

watch([query, activeTab], () => {
  activeIndex.value = 0;
});

function open(initialTab?: CommandFilterTab) {
  dialogRef.value?.showModal();
  query.value = "";
  if (initialTab) {
    activeTab.value = initialTab;
  } else {
    activeTab.value = props.defaultTab;
  }
  activeIndex.value = 0;
  emit("open");
  nextTick(() => inputRef.value?.focus());
}

function close() {
  dialogRef.value?.close();
  emit("close");
}

defineExpose({ open, close, setTab });

function moveActive(delta: number) {
  const len = flatItems.value.length;
  if (len === 0) return;
  activeIndex.value = (activeIndex.value + delta + len) % len;
  scrollActiveIntoView();
}

function scrollActiveIntoView() {
  nextTick(() => {
    const el = dialogRef.value?.querySelector<HTMLElement>(
      `[data-tux-cmd-idx="${activeIndex.value}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  });
}

async function runCommand(cmd: Command) {
  close();

  // If command carries clipboard payload (e.g. design token)
  if (cmd.copyText) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(cmd.copyText);
    }
    const toast = useTuxToast();
    toast.success("Copied to clipboard", cmd.copyText);
    return;
  }

  // If command carries custom executable action
  if (cmd.action) {
    await cmd.action();
    return;
  }

  // If command navigates to internal route
  if (cmd.to) {
    await router.push(cmd.to);
    return;
  }

  // If command opens external href
  if (cmd.href) {
    if (cmd.href.startsWith("http")) {
      window.open(cmd.href, "_blank", "noopener");
    } else {
      window.location.href = cmd.href;
    }
  }
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    moveActive(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    moveActive(-1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    const cmd = flatItems.value[activeIndex.value];
    if (cmd) runCommand(cmd);
  }
}

// Compute item's flat index for highlight + arrow nav
function flatIndexOf(group: CommandGroup, itemIdx: number): number {
  let acc = 0;
  for (const g of filteredGroups.value) {
    if (g === group) return acc + itemIdx;
    acc += g.items.length;
  }
  return -1;
}

// Global hotkey — Nuxt UI's defineShortcuts normalizes meta vs ctrl per
// platform and respects "usingInput" semantics so the hotkey still fires
// from focused inputs (which is what we want for ⌘K).
if (!props.disableHotkey) {
  defineShortcuts({
    [`meta_${props.hotkey}`]: {
      handler: () => {
        if (dialogRef.value?.open) close();
        else open();
      },
      usingInput: true,
    },
  });
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="tux-cmd"
    @close="emit('close')"
    @click="(e) => { if (e.target === dialogRef) close(); }"
  >
    <div class="tux-cmd__panel">
      <!-- Search Input Bar -->
      <div class="tux-cmd__input-row">
        <Icon name="lucide:search" class="tux-cmd__input-icon" aria-hidden="true" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          :placeholder="placeholder"
          aria-label="Search commands"
          class="tux-cmd__input"
          autocomplete="off"
          spellcheck="false"
          @keydown="onInputKeydown"
        >
        <button
          v-if="query"
          type="button"
          class="tux-cmd__clear-btn"
          aria-label="Clear query"
          @click="query = ''; inputRef?.focus()"
        >
          <Icon name="lucide:x" class="w-3.5 h-3.5" />
        </button>
        <TuxKbd value="esc" size="sm" />
      </div>

      <!-- Category Filter Pills Bar -->
      <div v-if="showTabs" class="tux-cmd__tabs" role="tablist" aria-label="Filter command categories">
        <button
          type="button"
          role="tab"
          :aria-selected="parsedQuery.tab === 'all'"
          class="tux-cmd__tab"
          :class="{ 'tux-cmd__tab--active': parsedQuery.tab === 'all' }"
          @click="setTab('all')"
        >
          All
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="parsedQuery.tab === 'actions'"
          class="tux-cmd__tab"
          :class="{ 'tux-cmd__tab--active': parsedQuery.tab === 'actions' }"
          @click="setTab('actions')"
        >
          <Icon name="lucide:zap" class="w-3 h-3 mr-1 text-brand-accent" />
          Actions <span class="tux-cmd__tab-shortcut">&gt;</span>
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="parsedQuery.tab === 'components'"
          class="tux-cmd__tab"
          :class="{ 'tux-cmd__tab--active': parsedQuery.tab === 'components' }"
          @click="setTab('components')"
        >
          <Icon name="lucide:blocks" class="w-3 h-3 mr-1 text-brand-primary" />
          Components <span class="tux-cmd__tab-shortcut">@</span>
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="parsedQuery.tab === 'tokens'"
          class="tux-cmd__tab"
          :class="{ 'tux-cmd__tab--active': parsedQuery.tab === 'tokens' }"
          @click="setTab('tokens')"
        >
          <Icon name="lucide:palette" class="w-3 h-3 mr-1 text-color-info" />
          Tokens <span class="tux-cmd__tab-shortcut">--</span>
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="parsedQuery.tab === 'docs'"
          class="tux-cmd__tab"
          :class="{ 'tux-cmd__tab--active': parsedQuery.tab === 'docs' }"
          @click="setTab('docs')"
        >
          <Icon name="lucide:book-open" class="w-3 h-3 mr-1 text-text-secondary" />
          Docs <span class="tux-cmd__tab-shortcut">#</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredGroups.length === 0" class="tux-cmd__empty">
        <Icon name="lucide:search-x" class="tux-cmd__empty-icon" aria-hidden="true" />
        <p class="tux-cmd__empty-text">No matches found for "{{ query }}"</p>
        <button
          v-if="parsedQuery.tab !== 'all' || query"
          type="button"
          class="tux-cmd__empty-reset"
          @click="setTab('all'); query = ''"
        >
          Reset search filters
        </button>
      </div>

      <!-- Results List -->
      <ul v-else class="tux-cmd__list" role="listbox">
        <template v-for="(group, gIdx) in filteredGroups" :key="`${group.heading}-${gIdx}`">
          <li class="tux-cmd__group-heading" role="presentation">{{ group.heading }}</li>
          <li
            v-for="(item, iIdx) in group.items"
            :key="item.id"
            :data-tux-cmd-idx="flatIndexOf(group, iIdx)"
            class="tux-cmd__item"
            :class="{ 'tux-cmd__item--active': flatIndexOf(group, iIdx) === activeIndex }"
            role="option"
            :aria-selected="flatIndexOf(group, iIdx) === activeIndex"
            @click="runCommand(item)"
            @mouseenter="activeIndex = flatIndexOf(group, iIdx)"
          >
            <!-- Color Swatch preview if item is a color token -->
            <span
              v-if="item.isColor"
              class="tux-cmd__swatch"
              :style="{ backgroundColor: item.tokenValue || ('var(' + item.label + ')') }"
              aria-hidden="true"
            />
            <!-- Action / Component / Doc Icon -->
            <Icon
              v-else-if="item.icon"
              :name="item.icon"
              class="tux-cmd__item-icon"
              aria-hidden="true"
            />
            <Icon
              v-else
              name="lucide:hash"
              class="tux-cmd__item-icon"
              aria-hidden="true"
            />

            <!-- Item Main Content -->
            <div class="tux-cmd__item-text">
              <div class="tux-cmd__item-header">
                <span
                  class="tux-cmd__item-label"
                  :class="{ 'font-mono text-xs text-brand-primary font-bold': item.category === 'tokens' || item.label.startsWith('--') }"
                >
                  {{ item.label }}
                </span>
                <span
                  v-if="item.badge"
                  class="tux-cmd__item-badge"
                  :class="`tux-cmd__item-badge--${item.badgeTone || 'neutral'}`"
                >
                  {{ item.badge }}
                </span>
              </div>
              <span
                v-if="item.description"
                class="tux-cmd__item-description"
              >{{ item.description }}</span>
            </div>

            <!-- Item Actions / Hints -->
            <div class="tux-cmd__item-actions">
              <span v-if="item.copyText" class="tux-cmd__copy-hint">
                <Icon name="lucide:copy" class="w-2.5 h-2.5 mr-0.5 inline-block" />
                Copy
              </span>
              <TuxKbd
                v-if="item.shortcut"
                :value="item.shortcut"
                size="sm"
              />
            </div>
          </li>
        </template>
      </ul>

      <!-- Footer Hints -->
      <div class="tux-cmd__footer">
        <div class="tux-cmd__footer-left">
          <span class="tux-cmd__footer-hint">
            <TuxKbd :keys="['arrowup', 'arrowdown']" size="xs" /> navigate
          </span>
          <span class="tux-cmd__footer-hint">
            <TuxKbd value="enter" size="xs" /> select
          </span>
          <span class="tux-cmd__footer-hint">
            <TuxKbd value="esc" size="xs" /> close
          </span>
        </div>
        <div class="tux-cmd__footer-prefixes hidden sm:flex items-center gap-3 font-mono text-[11px] text-text-muted">
          <span><strong class="text-text-primary">&gt;</strong> actions</span>
          <span><strong class="text-text-primary">@</strong> components</span>
          <span><strong class="text-text-primary">--</strong> tokens</span>
          <span><strong class="text-text-primary">#</strong> docs</span>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.tux-cmd {
  width: min(44rem, calc(100% - 2rem));
  max-height: min(34rem, calc(100% - 4rem));
  margin: auto;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}

.tux-cmd::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.tux-cmd__panel {
  background: var(--surface-raised);
  border: 2px solid var(--brand-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-overlay);
  display: flex;
  flex-direction: column;
  max-height: min(34rem, 90vh);
  overflow: hidden;
}

/* Input row */
.tux-cmd__input-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  flex-shrink: 0;
}

.tux-cmd__input-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-cmd__input {
  flex: 1;
  min-width: 0;
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  outline: 0;
  padding: 0;
}

.tux-cmd__input::placeholder {
  font-style: italic;
  color: var(--text-muted);
}

.tux-cmd__clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tux-cmd__clear-btn:hover {
  color: var(--text-primary);
  border-color: var(--brand-primary);
}

/* Category Filter Tabs */
.tux-cmd__tabs {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
  overflow-x: auto;
  flex-shrink: 0;
}

.tux-cmd__tab {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.tux-cmd__tab:hover {
  color: var(--text-primary);
  background: var(--surface-page);
  border-color: var(--surface-border);
}

.tux-cmd__tab--active {
  color: var(--brand-primary);
  background: var(--wash-brand-12);
  border-color: var(--brand-primary);
  font-weight: 700;
}

.tux-cmd__tab-shortcut {
  margin-left: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  padding: 0 0.25rem;
  border-radius: 2px;
  background: var(--surface-border);
  color: var(--text-secondary);
}

/* List */
.tux-cmd__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.tux-cmd__group-heading {
  padding: 0.625rem 1rem 0.375rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
}

.tux-cmd__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  user-select: none;
  border-left: 3px solid transparent;
  transition: background 0.1s ease;
}

.tux-cmd__item--active {
  background: var(--wash-brand-6);
  border-left-color: var(--brand-primary);
}

.tux-cmd__swatch {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.tux-cmd__item-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-cmd__item--active .tux-cmd__item-icon {
  color: var(--brand-primary);
}

.tux-cmd__item-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
}

.tux-cmd__item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tux-cmd__item-label {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-cmd__item-badge {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.0625rem 0.375rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
}

.tux-cmd__item-badge--brand {
  background: var(--wash-brand-12);
  color: var(--brand-primary);
  border-color: var(--wash-brand-22);
}

.tux-cmd__item-badge--neutral {
  background: var(--surface-sunken);
  color: var(--text-secondary);
  border-color: var(--surface-border);
}

.tux-cmd__item-badge--ok {
  background: var(--status-ok-fill);
  color: var(--text-primary);
  border-color: var(--status-ok);
}

.tux-cmd__item-badge--warning {
  background: var(--status-warning-fill);
  color: var(--text-primary);
  border-color: var(--status-warning);
}

.tux-cmd__item-badge--info {
  background: var(--status-maintenance-fill);
  color: var(--text-primary);
  border-color: var(--status-maintenance);
}

.tux-cmd__item-description {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-cmd__item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.tux-cmd__copy-hint {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  color: var(--text-secondary);
}

/* Empty */
.tux-cmd__empty {
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
}

.tux-cmd__empty-icon {
  width: 2rem;
  height: 2rem;
  color: var(--text-muted);
  opacity: 0.5;
}

.tux-cmd__empty-text {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--text-muted);
}

.tux-cmd__empty-reset {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--brand-primary);
  background: transparent;
  border: 1px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.625rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tux-cmd__empty-reset:hover {
  background: var(--wash-brand-12);
}

/* Footer */
.tux-cmd__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--surface-sunken);
  border-top: 1px solid var(--surface-border);
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-cmd__footer-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tux-cmd__footer-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
</style>
