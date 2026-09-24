<script setup lang="ts">
/**
 * TuxPeoplePicker — assign people to a piece of work: a search box over
 * a list of people (avatar, name, a subtitle such as "Student Technician
 * · NET", an optional status badge such as "Needs access").
 *
 * Built for the forge's Roadmap item panel, where the list is Forgejo's
 * assignable users enriched with each person's Entra ID profile and the
 * search runs server-side as you type; it usually sits in a UPopover
 * inside a modal <dialog> side panel. Works standalone too.
 *
 * Pattern: WAI-ARIA APG combobox (editable, list autocomplete) with an
 * always-visible listbox. DOM focus never leaves the input; the active
 * option is announced through aria-activedescendant. Options are
 * role="option" rows, not buttons — nesting buttons in a listbox is
 * invalid, and the keyboard contract already covers every pick.
 *
 * Keyboard (on the input):
 *   ArrowDown / ArrowUp  move the active option, wrapping
 *   Home / End           first / last option (with a modifier key they
 *                        stay text-caret keys)
 *   Enter                toggle the active option (never submits a form)
 *   Escape               emit `close`; propagation stopped and default
 *                        prevented, so an enclosing <dialog> or UPopover
 *                        does NOT also close — wire @close yourself
 *
 * Data flow:
 *   - `v-model` is the selected ids. Every pick emits `toggle(id,
 *     selected)` per changed id (single mode: the replaced person is
 *     reported deselected first) and then `update:modelValue`.
 *   - `v-model:query` emits on every keystroke; debouncing is the
 *     consumer's job. With `remote`, the picker never filters — the
 *     consumer searches and feeds `people`. Without it, `people` is
 *     filtered locally (name, subtitle, login; accent-insensitive).
 *   - `selectedFirst` sorts selected people to the top by the selection
 *     as it stood when the query last changed (or when v-model changed
 *     from outside), so a row never jumps out from under the pointer
 *     mid-pick.
 *
 * Width: 20rem by default, capped at the container. Override with the
 * `--tux-people-picker-width` custom property (e.g. `100%` in a panel);
 * `--tux-people-picker-max-height` caps the list (default 20rem).
 * The root is an inline-size container, so it needs a definite width —
 * never put it in a shrink-to-fit box with width 100%.
 *
 * Island-safe: no Nuxt-only APIs, no document-global queries, no
 * Teleport; helpers from app/utils/tuxPeople.ts imported relatively.
 */
import { computed, nextTick, onMounted, ref, useId, watch } from "vue";
// Explicit relative imports — outside Nuxt (the forge island) nothing may
// depend on the utils auto-import.
import type { TuxPerson } from "../utils/tuxPeople";
import { tuxFilterPeople, tuxOrderPeople, tuxPersonInitials, tuxTogglePerson } from "../utils/tuxPeople";

interface Props {
  people: TuxPerson[];
  /** Selected ids (`v-model`). */
  modelValue?: string[];
  /** Search text (`v-model:query`). */
  query?: string;
  /** The consumer searches the server; the picker does not filter. */
  remote?: boolean;
  /** false: picking one person replaces the selection. */
  multiple?: boolean;
  /** A search is in flight — spinner in the field, current list kept. */
  loading?: boolean;
  placeholder?: string;
  /** Shown when nothing matches and nothing is loading. */
  emptyText?: string;
  /** Accessible name of the listbox. */
  label?: string;
  /** Selected people sort to the top. */
  selectedFirst?: boolean;
  /** Focus the search field on mount. */
  autofocus?: boolean;
  /** Accessible name of the search field (defaults to `placeholder`). */
  inputLabel?: string;
  /** Loading announcement and the empty-list loading row. */
  loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  query: undefined,
  remote: false,
  multiple: true,
  loading: false,
  placeholder: "Find a person",
  emptyText: "No one matches",
  label: "People",
  selectedFirst: true,
  autofocus: true,
  inputLabel: undefined,
  loadingText: "Searching…",
});

const emit = defineEmits<{
  "update:modelValue": [ids: string[]];
  "update:query": [query: string];
  toggle: [id: string, selected: boolean];
  close: [];
}>();

defineSlots<{
  /** Under the list, e.g. a "Search the whole directory" action. */
  footer?: (props: { query: string }) => unknown;
  /** Replaces `emptyText` (also the place for a search-failed message). */
  empty?: (props: { query: string }) => unknown;
}>();

const uid = useId();
const listboxId = `${uid}-listbox`;
const optionId = (i: number) => `${uid}-option-${i}`;

const inputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLElement | null>(null);
const inputFocused = ref(false);

// ── Query ─────────────────────────────────────────────────────────
// Local copy so an unbound `query` still filters; kept in step with
// the prop when the consumer drives it.
const text = ref(props.query ?? "");
watch(
  () => props.query,
  (q) => {
    if (q !== undefined && q !== text.value) text.value = q;
  },
);

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  text.value = value;
  emit("update:query", value);
}

// ── Order ─────────────────────────────────────────────────────────
// The selection the list is sorted by. Refreshed when the query changes
// or v-model changes from outside — not on our own picks.
const sortSelection = ref<string[]>([...props.modelValue]);
let echoKey: string | null = null;
const keyOf = (ids: readonly string[]) => ids.join("\u0000");
// Order-insensitive: a consumer that echoes the selection back sorted
// (e.g. as the server returns assignees) is still an echo.
const setKeyOf = (ids: readonly string[]) => keyOf([...ids].sort());

watch(
  () => setKeyOf(props.modelValue),
  (key) => {
    if (key === echoKey) {
      echoKey = null;
      return;
    }
    sortSelection.value = [...props.modelValue];
  },
);

const selected = computed(() => new Set(props.modelValue));

const options = computed(() =>
  tuxOrderPeople(
    props.remote ? props.people : tuxFilterPeople(props.people, text.value),
    sortSelection.value,
    props.selectedFirst,
  ),
);

// ── Active option ─────────────────────────────────────────────────
// Tracked by id so a re-sort or a fresh result set keeps the cursor on
// the same person. After typing, the first match is active (Enter picks
// the top match); once the user has moved, their choice sticks.
//
// Remote: the list on screen still answers the PREVIOUS query when the
// text changes, so nothing is made active until the new results land
// (`people` changes, or `loading` falls) — Enter can never pick a stale
// row the user did not choose.
const activeId = ref<string | null>(null);
let userMoved = false;
let awaitingResults = false;

const activeIndex = computed(() =>
  activeId.value === null ? -1 : options.value.findIndex((p) => p.id === activeId.value),
);

function firstIfQuerying(): string | null {
  return text.value.trim() && options.value.length ? options.value[0]!.id : null;
}

watch(text, () => {
  sortSelection.value = [...props.modelValue];
  userMoved = false;
  awaitingResults = props.remote;
  activeId.value = props.remote ? null : firstIfQuerying();
});

function resultsLanded() {
  awaitingResults = false;
  if (userMoved && activeIndex.value >= 0) return;
  userMoved = false;
  activeId.value = firstIfQuerying();
}

watch(
  () => keyOf(options.value.map((p) => p.id)),
  () => {
    if (awaitingResults) return resultsLanded();
    if (activeIndex.value >= 0) return; // still listed: keep it
    activeId.value = userMoved ? null : firstIfQuerying();
  },
);

watch(
  () => props.loading,
  (now, before) => {
    if (before && !now && awaitingResults) resultsLanded();
  },
);

function moveTo(i: number) {
  const p = options.value[i];
  if (!p) return;
  userMoved = true;
  activeId.value = p.id;
}

watch(activeIndex, (i) => {
  if (i < 0) return;
  nextTick(() => {
    // Scroll the list only — scrollIntoView would also scroll the side
    // panel / page the picker lives in.
    const list = listRef.value;
    const el = list?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (!list || !el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  });
});

// ── Picking ───────────────────────────────────────────────────────
function pick(p: TuxPerson) {
  if (p.disabled) return;
  userMoved = true;
  activeId.value = p.id;
  const { next, changes } = tuxTogglePerson(props.modelValue, p.id, props.multiple);
  for (const [id, isSelected] of changes) emit("toggle", id, isSelected);
  echoKey = setKeyOf(next);
  emit("update:modelValue", next);
}

// ── Keyboard ──────────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  if (e.isComposing) return; // IME: Enter/arrows belong to the composition
  const n = options.value.length;
  const i = activeIndex.value;
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (n) moveTo(i < 0 ? 0 : (i + 1) % n);
      break;
    case "ArrowUp":
      e.preventDefault();
      if (n) moveTo(i < 0 ? n - 1 : (i - 1 + n) % n);
      break;
    case "Home":
    case "End":
      if (!n || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      moveTo(e.key === "Home" ? 0 : n - 1);
      break;
    case "Enter": {
      e.preventDefault();
      const p = i >= 0 ? options.value[i] : undefined;
      if (p) pick(p);
      break;
    }
  }
}

// Escape is handled on the root so it also covers focus in the footer.
function onRootKeydown(e: KeyboardEvent) {
  if (e.key !== "Escape" || e.isComposing) return;
  e.preventDefault();
  e.stopPropagation();
  emit("close");
}

// ── Presentation ──────────────────────────────────────────────────
function initialsOf(p: TuxPerson): string {
  return tuxPersonInitials(p.name) || tuxPersonInitials(p.id);
}

const statusText = computed(() => {
  if (props.loading) return props.loadingText;
  if (!text.value.trim()) return "";
  const n = options.value.length;
  if (n === 0) return props.emptyText;
  return n === 1 ? "1 person" : `${n} people`;
});

function focus() {
  inputRef.value?.focus({ preventScroll: true });
}

onMounted(() => {
  if (props.autofocus) nextTick(focus);
});

defineExpose({ focus });
</script>

<template>
  <div
    class="tux-people-picker"
    :class="{ 'tux-people-picker--single': !multiple }"
    @keydown="onRootKeydown"
  >
    <div class="tux-people-picker__field">
      <UIcon name="lucide:search" class="tux-people-picker__search-icon" aria-hidden="true" />
      <input
        ref="inputRef"
        class="tux-people-picker__input"
        type="text"
        role="combobox"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        aria-autocomplete="list"
        :aria-label="inputLabel || placeholder"
        :aria-expanded="options.length > 0 ? 'true' : 'false'"
        :aria-controls="listboxId"
        :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :placeholder="placeholder"
        :value="text"
        @input="onInput"
        @keydown="onKeydown"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
      >
      <UIcon
        v-if="loading"
        name="lucide:loader-circle"
        class="tux-people-picker__spinner"
        aria-hidden="true"
      />
    </div>

    <ul
      v-if="options.length"
      :id="listboxId"
      ref="listRef"
      class="tux-people-picker__list"
      role="listbox"
      :aria-label="label"
      :aria-multiselectable="multiple ? 'true' : undefined"
      :aria-busy="loading ? 'true' : undefined"
    >
      <li
        v-for="(p, i) in options"
        :id="optionId(i)"
        :key="p.id"
        :data-index="i"
        class="tux-people-picker__option"
        :class="{
          'tux-people-picker__option--active': i === activeIndex,
          'tux-people-picker__option--focus': i === activeIndex && inputFocused,
          'tux-people-picker__option--selected': selected.has(p.id),
          'tux-people-picker__option--disabled': p.disabled,
          'tux-people-picker__option--has-status': !!p.status,
        }"
        role="option"
        :aria-selected="selected.has(p.id) ? 'true' : 'false'"
        :aria-disabled="p.disabled ? 'true' : undefined"
        @mousedown.prevent
        @click="pick(p)"
      >
        <span class="tux-people-picker__mark" aria-hidden="true">
          <UIcon
            v-if="selected.has(p.id)"
            name="lucide:check"
            class="tux-people-picker__check"
          />
        </span>
        <TuxAvatar
          class="tux-people-picker__avatar"
          :name="p.name"
          :initials="initialsOf(p)"
          :photo-url="p.avatar"
          size="md"
        />
        <span class="tux-people-picker__text">
          <span class="tux-people-picker__name">{{ p.name }}</span>
          <span v-if="p.subtitle" class="tux-people-picker__subtitle">{{ p.subtitle }}</span>
        </span>
        <TuxBadge
          v-if="p.status"
          class="tux-people-picker__status"
          :tone="p.status.tone"
        >
          {{ p.status.label }}
        </TuxBadge>
      </li>
    </ul>

    <div v-else-if="loading" class="tux-people-picker__note">
      {{ loadingText }}
    </div>
    <div v-else class="tux-people-picker__note">
      <slot name="empty" :query="text">{{ emptyText }}</slot>
    </div>

    <div v-if="$slots.footer" class="tux-people-picker__footer">
      <slot name="footer" :query="text" />
    </div>

    <span class="tux-people-picker__sr" role="status" aria-live="polite">{{ statusText }}</span>
  </div>
</template>

<style scoped>
.tux-people-picker {
  container-type: inline-size;
  container-name: tux-people-picker;
  inline-size: var(--tux-people-picker-width, 20rem);
  max-inline-size: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-raised);
  color: var(--text-primary);
  font-family: var(--font-body);
}

/* ── Search field ──────────────────────────────────────────── */
.tux-people-picker__field {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-people-picker__input {
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.4375rem 2rem 0.4375rem 2rem;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-fast) var(--ease-standard);
}

.tux-people-picker__input::placeholder {
  color: var(--text-muted);
  opacity: 1;
}

.tux-people-picker__input:focus {
  outline: none;
  border-color: var(--brand-primary);
}

.tux-people-picker__input:focus-visible {
  outline: 2px solid var(--focus-ring-outer);
  outline-offset: 1px;
}

.tux-people-picker__search-icon,
.tux-people-picker__spinner {
  position: absolute;
  inline-size: 1rem;
  block-size: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.tux-people-picker__search-icon { inset-inline-start: 1.125rem; }
.tux-people-picker__spinner {
  inset-inline-end: 1.125rem;
  animation: tux-people-picker-spin 0.9s linear infinite;
}

@keyframes tux-people-picker-spin {
  to { transform: rotate(360deg); }
}

/* ── List ──────────────────────────────────────────────────── */
.tux-people-picker__list {
  position: relative; /* offsetParent for scroll-into-view */
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
  max-block-size: var(--tux-people-picker-max-height, 20rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.tux-people-picker__option {
  display: grid;
  grid-template-columns: 1rem auto minmax(0, 1fr) auto;
  grid-template-areas: "mark avatar text status";
  align-items: center;
  column-gap: 0.625rem;
  row-gap: 0.25rem;
  margin: 0 0.25rem;
  padding: 0.4375rem 0.5rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-people-picker__option:hover {
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
}

.tux-people-picker__option--active,
.tux-people-picker__option--active:hover {
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
}

/* The visual focus while DOM focus stays in the input. */
.tux-people-picker__option--focus {
  outline: 2px solid var(--focus-ring-outer);
  outline-offset: -2px;
}

.tux-people-picker__option--disabled {
  cursor: not-allowed;
}

.tux-people-picker__option--disabled:hover {
  background: transparent;
}

.tux-people-picker__option--disabled.tux-people-picker__option--active {
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
}

/* Selection mark. Multiple: a checkbox-like box, filled when selected.
   Single: a bare check. Never colour alone — the glyph carries it. */
.tux-people-picker__mark {
  grid-area: mark;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1rem;
  block-size: 1rem;
  border: 1.5px solid var(--text-muted);
  border-radius: var(--radius-sm);
  color: var(--surface-page);
}

.tux-people-picker__option--selected .tux-people-picker__mark {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.tux-people-picker--single .tux-people-picker__mark,
.tux-people-picker--single .tux-people-picker__option--selected .tux-people-picker__mark {
  border: 0;
  background: transparent;
  color: var(--brand-primary);
}

.tux-people-picker__option--disabled .tux-people-picker__mark {
  border-style: dashed;
  opacity: 0.6;
}

.tux-people-picker__check {
  inline-size: 0.75rem;
  block-size: 0.75rem;
}

.tux-people-picker--single .tux-people-picker__check {
  inline-size: 1rem;
  block-size: 1rem;
}

.tux-people-picker__avatar { grid-area: avatar; }

.tux-people-picker__option--disabled .tux-people-picker__avatar {
  opacity: 0.55;
}

.tux-people-picker__text {
  grid-area: text;
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
}

.tux-people-picker__name {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-people-picker__subtitle {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--text-muted);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.tux-people-picker__option--disabled .tux-people-picker__name {
  color: var(--text-secondary);
}

.tux-people-picker__status {
  grid-area: status;
  justify-self: end;
  white-space: nowrap;
}

/* ── Empty / loading note, footer ──────────────────────────── */
.tux-people-picker__note {
  padding: 1rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: center;
}

.tux-people-picker__footer {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--surface-border-subtle);
  font-size: 0.8125rem;
}

.tux-people-picker__sr {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ── Narrow: the badge drops under the text ────────────────── */
@container tux-people-picker (max-width: 21rem) {
  .tux-people-picker__option--has-status {
    grid-template-columns: 1rem auto minmax(0, 1fr);
    grid-template-areas:
      "mark avatar text"
      "mark avatar status";
  }
  .tux-people-picker__status {
    justify-self: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-people-picker__spinner { animation: none; }
  .tux-people-picker__input,
  .tux-people-picker__option { transition: none; }
}

@media (forced-colors: active) {
  .tux-people-picker__option--active { outline: 2px solid Highlight; outline-offset: -2px; }
  .tux-people-picker__option--selected .tux-people-picker__mark { background: Highlight; color: HighlightText; }
}
</style>
