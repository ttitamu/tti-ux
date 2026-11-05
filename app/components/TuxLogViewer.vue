<script setup lang="ts">
/**
 * TuxLogViewer — operational job & telemetry log inspection surface.
 *
 * Provides live text filtering, severity pills (`ALL`, `DEBUG`, `INFO`, `WARN`, `ERROR`)
 * with live line counts, line-wrap toggle, clipboard copy & plain-text export, and a
 * focusable monospace log region meeting WCAG 2.2 AAA (>= 7:1 contrast, >= 44px targets).
 */
import { computed, onUnmounted, ref, watch } from "vue";

export type LogSeverity = "debug" | "info" | "warn" | "error";

export interface LogLineEntry {
  id: string | number;
  timestamp: string;
  level: LogSeverity;
  source?: string;
  message: string;
}

type LevelFilter = "all" | LogSeverity;

interface Props {
  title?: string;
  lines: LogLineEntry[];
  initialLevel?: LevelFilter;
  wrapLines?: boolean;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Operational Job & Telemetry Logs",
  initialLevel: "all",
  wrapLines: true,
  showLineNumbers: true,
  maxHeight: "24rem",
});

const emit = defineEmits<{
  copy: [text: string];
  download: [text: string];
  selectLine: [line: LogLineEntry];
}>();

const searchQuery = ref<string>("");
const activeLevel = ref<LevelFilter>(props.initialLevel);
const isWrapped = ref<boolean>(props.wrapLines);
const selectedLineId = ref<string | number | null>(null);
const copyFeedback = ref<boolean>(false);
let feedbackTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.initialLevel,
  (next) => {
    activeLevel.value = next;
  },
);

watch(
  () => props.wrapLines,
  (next) => {
    isWrapped.value = next;
  },
);

onUnmounted(() => {
  clearTimeout(feedbackTimer);
});

const searchMatchedLines = computed<LogLineEntry[]>(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return props.lines;
  return props.lines.filter(
    (line) =>
      line.message.toLowerCase().includes(q) ||
      (line.source && line.source.toLowerCase().includes(q)) ||
      line.timestamp.toLowerCase().includes(q) ||
      line.level.toLowerCase().includes(q),
  );
});

const levelCounts = computed<Record<LevelFilter, number>>(() => {
  const counts: Record<LevelFilter, number> = {
    all: searchMatchedLines.value.length,
    debug: 0,
    info: 0,
    warn: 0,
    error: 0,
  };
  for (const line of searchMatchedLines.value) {
    counts[line.level] += 1;
  }
  return counts;
});

const filterButtons = computed<
  Array<{ value: LevelFilter; label: string; count: number }>
>(() => {
  const items: Array<{ value: LevelFilter; label: string; count: number }> = [
    { value: "all", label: "ALL", count: levelCounts.value.all },
  ];
  if (levelCounts.value.debug > 0 || activeLevel.value === "debug") {
    items.push({ value: "debug", label: "DEBUG", count: levelCounts.value.debug });
  }
  items.push(
    { value: "info", label: "INFO", count: levelCounts.value.info },
    { value: "warn", label: "WARN", count: levelCounts.value.warn },
    { value: "error", label: "ERROR", count: levelCounts.value.error },
  );
  return items;
});

const filteredLines = computed<LogLineEntry[]>(() => {
  if (activeLevel.value === "all") return searchMatchedLines.value;
  return searchMatchedLines.value.filter(
    (line) => line.level === activeLevel.value,
  );
});

function serializeLines(entries: LogLineEntry[]): string {
  return entries
    .map((line) => {
      const src = line.source ? ` [${line.source}]` : "";
      return `${line.timestamp} ${line.level.toUpperCase()}${src} ${line.message}`;
    })
    .join("\n");
}

async function handleCopy() {
  const text = serializeLines(filteredLines.value);
  emit("copy", text);
  if (globalThis.navigator?.clipboard?.writeText) {
    try {
      await globalThis.navigator.clipboard.writeText(text);
    } catch {
      // Clipboard write may fail in restricted contexts; event is still emitted.
    }
  }
  copyFeedback.value = true;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    copyFeedback.value = false;
  }, 1600);
}

function handleDownload() {
  const text = serializeLines(filteredLines.value);
  emit("download", text);
}

function handleSelectLine(line: LogLineEntry) {
  selectedLineId.value = line.id;
  emit("selectLine", line);
}
</script>

<template>
  <div class="tux-log-viewer">
    <!-- Header Bar -->
    <div class="tux-log-viewer__header">
      <h3 class="tux-log-viewer__title">{{ title }}</h3>
      <span class="tux-log-viewer__summary">
        Showing {{ filteredLines.length }} of {{ lines.length }} lines
      </span>
    </div>

    <!-- Accessible 44px Control Toolbar -->
    <div class="tux-log-viewer__toolbar">
      <div class="tux-log-viewer__search-wrap">
        <input
          v-model="searchQuery"
          type="search"
          aria-label="Search log output"
          placeholder="Search message, source, timestamp..."
          class="tux-log-viewer__search min-h-11"
        >
      </div>

      <div
        class="tux-log-viewer__filters"
        role="group"
        aria-label="Filter log lines by severity"
      >
        <button
          v-for="btn in filterButtons"
          :key="btn.value"
          type="button"
          class="tux-log-viewer__filter-btn min-h-11"
          :class="{ 'tux-log-viewer__filter-btn--active': activeLevel === btn.value }"
          :aria-pressed="activeLevel === btn.value"
          @click="activeLevel = btn.value"
        >
          <span>{{ btn.label }}</span>
          <span class="tux-log-viewer__filter-count">{{ btn.count }}</span>
        </button>
      </div>

      <div class="tux-log-viewer__utilities">
        <button
          type="button"
          class="tux-log-viewer__util-btn min-h-11"
          :class="{ 'tux-log-viewer__util-btn--active': isWrapped }"
          :aria-pressed="isWrapped"
          @click="isWrapped = !isWrapped"
        >
          Wrap
        </button>

        <button
          type="button"
          class="tux-log-viewer__util-btn min-h-11"
          aria-label="Copy visible log lines"
          @click="handleCopy"
        >
          {{ copyFeedback ? "Copied" : "Copy" }}
        </button>

        <button
          type="button"
          class="tux-log-viewer__util-btn min-h-11"
          aria-label="Download visible log lines"
          @click="handleDownload"
        >
          Download
        </button>
      </div>
    </div>

    <!-- Scrollable Monospace Log Viewport (`scrollable-region-focusable`) -->
    <div
      class="tux-log-viewer__viewport"
      :class="{ 'tux-log-viewer__viewport--nowrap': !isWrapped }"
      tabindex="0"
      role="region"
      :aria-label="title"
      :style="{ maxHeight }"
    >
      <ol v-if="filteredLines.length > 0" class="tux-log-viewer__list">
        <li
          v-for="(line, index) in filteredLines"
          :key="line.id"
          class="tux-log-viewer__row"
          :class="[
            `tux-log-viewer__row--${line.level}`,
            selectedLineId === line.id ? 'tux-log-viewer__row--selected' : null,
          ]"
          @click="handleSelectLine(line)"
        >
          <span
            v-if="showLineNumbers"
            class="tux-log-viewer__lineno"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>

          <span class="tux-log-viewer__timestamp">{{ line.timestamp }}</span>

          <span class="tux-log-viewer__badge">
            <span
              class="tux-log-viewer__dot"
              :class="`tux-log-viewer__dot--${line.level}`"
              aria-hidden="true"
            />
            <span>{{ line.level.toUpperCase() }}</span>
          </span>

          <span v-if="line.source" class="tux-log-viewer__source">
            [{{ line.source }}]
          </span>

          <span
            class="tux-log-viewer__message"
            :class="{ 'tux-log-viewer__message--wrap': isWrapped }"
          >
            {{ line.message }}
          </span>
        </li>
      </ol>

      <p v-else class="tux-log-viewer__empty" role="status">
        No log lines match the current filter criteria.
      </p>
    </div>
  </div>
</template>

<style scoped>
.tux-log-viewer {
  --focus-ring: var(--focus-ring-outer);
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.tux-log-viewer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-8);
  padding: var(--space-12) var(--space-16);
  background: var(--surface-page);
  border-bottom: 1px solid var(--surface-border);
}

.tux-log-viewer__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-log-viewer__summary {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.tux-log-viewer__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
  padding: var(--space-10) var(--space-16);
  background: var(--surface-page);
  border-bottom: 1px solid var(--surface-border);
  min-width: 0;
}

.tux-log-viewer__search-wrap {
  flex: 1 1 14rem;
  min-width: 0;
}

.tux-log-viewer__search {
  width: 100%;
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.5;
  box-sizing: border-box;
}

.tux-log-viewer__search::placeholder {
  color: var(--text-muted);
}

.tux-log-viewer__search:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.tux-log-viewer__filters,
.tux-log-viewer__utilities {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  min-width: 0;
}

.tux-log-viewer__filter-btn,
.tux-log-viewer__util-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-10);
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background-color: var(--surface-raised);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.tux-log-viewer__filter-btn:hover,
.tux-log-viewer__util-btn:hover {
  background-color: var(--surface-sunken);
  border-color: var(--brand-primary);
}

.tux-log-viewer__filter-btn--active,
.tux-log-viewer__util-btn--active {
  background-color: var(--brand-fill);
  border-color: var(--brand-fill);
  color: var(--text-on-brand);
}

.tux-log-viewer__filter-btn--active:hover,
.tux-log-viewer__util-btn--active:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-log-viewer__filter-btn:focus-visible,
.tux-log-viewer__util-btn:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.tux-log-viewer__filter-count {
  padding: 0 0.3125rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
}

.tux-log-viewer__viewport {
  overflow-y: auto;
  overflow-x: auto;
  background: var(--surface-sunken);
  padding: var(--space-8) 0;
  min-width: 0;
  max-width: 100%;
}

.tux-log-viewer__viewport:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: -3px;
}

.tux-log-viewer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.6;
}

.tux-log-viewer__row {
  display: flex;
  align-items: baseline;
  gap: var(--space-8);
  padding: 0.25rem var(--space-12);
  border-left: 3px solid transparent;
  cursor: pointer;
  min-width: 0;
}

.tux-log-viewer__viewport--nowrap .tux-log-viewer__row {
  white-space: nowrap;
  width: max-content;
  min-width: 100%;
}

.tux-log-viewer__row:hover {
  background: var(--surface-raised);
}

.tux-log-viewer__row--warn {
  border-left-color: var(--status-warning);
}

.tux-log-viewer__row--error {
  border-left-color: var(--status-critical);
}

.tux-log-viewer__row--selected {
  background: var(--surface-page);
  border-left-color: var(--brand-primary);
}

.tux-log-viewer__lineno {
  min-width: 2.25rem;
  text-align: right;
  color: var(--text-muted);
  user-select: none;
  flex-shrink: 0;
}

.tux-log-viewer__timestamp {
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-log-viewer__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 0.375rem;
  border-radius: var(--radius-sm);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.5;
  flex-shrink: 0;
}

.tux-log-viewer__dot {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.tux-log-viewer__dot--debug {
  background: var(--status-pending);
}

.tux-log-viewer__dot--info {
  background: var(--status-ok);
}

.tux-log-viewer__dot--warn {
  background: var(--status-warning);
}

.tux-log-viewer__dot--error {
  background: var(--status-critical);
}

.tux-log-viewer__source {
  color: var(--text-secondary);
  font-weight: 600;
  flex-shrink: 0;
}

.tux-log-viewer__message {
  color: var(--text-primary);
  min-width: 0;
}

.tux-log-viewer__message--wrap {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.tux-log-viewer__empty {
  margin: 0;
  padding: var(--space-16);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .tux-log-viewer__filter-btn,
  .tux-log-viewer__util-btn {
    transition: none;
  }
}
</style>
