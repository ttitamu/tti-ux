<script setup lang="ts">
// TuxCommandPalette — global ⌘K jump.
//
// Opens with ⌘K (Mac) or Ctrl+K (Windows/Linux). Search input at the top,
// grouped command list below. Live substring filtering. Keyboard nav via
// arrows + Enter. Escape closes. Built on the native `<dialog>` element —
// gives us free focus trap, scrim, and the right semantics.
//
// Each command can either navigate (`to: '/some/path'`) or run an action
// (`action: () => void`). Both close the palette on success.
//
// Use a single instance at app root (e.g. inside `app.vue`); the keyboard
// hook listens globally. Don't nest these.

interface Command {
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
  /** Internal route. Mutually exclusive with `action`. */
  to?: string;
  /** External href. Mutually exclusive with `action`. */
  href?: string;
  /** Run an arbitrary function on select. Closes the palette after. */
  action?: () => void | Promise<void>;
}

interface CommandGroup {
  heading: string;
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
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Type a command or search…",
  disableHotkey: false,
  hotkey: "k",
});

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const query = ref("");
const activeIndex = ref(0);

const router = useRouter();

const filteredGroups = computed<CommandGroup[]>(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.groups;

  return props.groups
    .map(group => ({
      heading: group.heading,
      items: group.items.filter(item => {
        const haystack = `${item.label} ${item.description ?? ""}`.toLowerCase();
        return haystack.includes(q);
      }),
    }))
    .filter(group => group.items.length > 0);
});

// Flat list of items in display order — used for keyboard nav.
const flatItems = computed<Command[]>(() =>
  filteredGroups.value.flatMap(g => g.items)
);

watch(query, () => {
  activeIndex.value = 0;
});

function open() {
  dialogRef.value?.showModal();
  query.value = "";
  activeIndex.value = 0;
  emit("open");
  nextTick(() => inputRef.value?.focus());
}

function close() {
  dialogRef.value?.close();
  emit("close");
}

defineExpose({ open, close });

function moveActive(delta: number) {
  const len = flatItems.value.length;
  if (len === 0) return;
  activeIndex.value = (activeIndex.value + delta + len) % len;
  scrollActiveIntoView();
}

function scrollActiveIntoView() {
  nextTick(() => {
    const el = dialogRef.value?.querySelector<HTMLElement>(
      `[data-tux-cmd-idx="${activeIndex.value}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  });
}

async function runCommand(cmd: Command) {
  close();
  if (cmd.action) {
    await cmd.action();
    return;
  }
  if (cmd.to) {
    await router.push(cmd.to);
    return;
  }
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
// from focused inputs (which is what we want for ⌘K). Arrow / enter /
// escape stay on the dialog's local input handler since they're list-nav,
// not app-level shortcuts.
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
      <div class="tux-cmd__input-row">
        <Icon name="lucide:search" class="tux-cmd__input-icon" aria-hidden="true" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          :placeholder="placeholder"
          class="tux-cmd__input"
          autocomplete="off"
          spellcheck="false"
          @keydown="onInputKeydown"
        >
        <TuxKbd value="esc" size="sm" />
      </div>

      <div v-if="filteredGroups.length === 0" class="tux-cmd__empty">
        <Icon name="lucide:search-x" class="tux-cmd__empty-icon" aria-hidden="true" />
        <p class="tux-cmd__empty-text">No commands match "{{ query }}"</p>
      </div>

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
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="tux-cmd__item-icon"
              aria-hidden="true"
            />
            <div class="tux-cmd__item-text">
              <span class="tux-cmd__item-label">{{ item.label }}</span>
              <span
                v-if="item.description"
                class="tux-cmd__item-description"
              >{{ item.description }}</span>
            </div>
            <TuxKbd
              v-if="item.shortcut"
              :value="item.shortcut"
              size="sm"
            />
          </li>
        </template>
      </ul>

      <div class="tux-cmd__footer">
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
    </div>
  </dialog>
</template>

<style scoped>
.tux-cmd {
  width: min(40rem, calc(100% - 2rem));
  max-height: min(32rem, calc(100% - 4rem));
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
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  max-height: min(32rem, 90vh);
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
  width: 1rem;
  height: 1rem;
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
  padding: 0.625rem 1rem;
  cursor: pointer;
  user-select: none;
  border-left: 3px solid transparent;
}

.tux-cmd__item--active {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  border-left-color: var(--brand-primary);
}

.tux-cmd__item-icon {
  width: 1rem;
  height: 1rem;
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

.tux-cmd__item-description {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* Footer */
.tux-cmd__footer {
  display: flex;
  gap: 1.25rem;
  padding: 0.5rem 1rem;
  background: var(--surface-sunken);
  border-top: 1px solid var(--surface-border);
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-cmd__footer-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
</style>
