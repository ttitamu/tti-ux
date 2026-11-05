<script setup lang="ts">
/**
 * TuxAuditLog — immutable governance and operational audit log with
 * full-text search, category filtering, cryptographic digest badges,
 * expandable inline before → after field diff tables, and CSV/JSON export.
 */
import { computed, ref, useId, watch } from "vue";

export interface AuditFieldDelta {
  field: string;
  before: string;
  after: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole?: string;
  action: string;
  category: "attribution" | "rate" | "signoff" | "settlement" | "system";
  severity?: "info" | "warning" | "critical";
  target: string;
  reason?: string;
  digest?: string;
  changes?: AuditFieldDelta[];
}

type CategoryFilter = "all" | AuditLogEntry["category"];

interface Props {
  /** Heading displayed at the top of the audit log panel. */
  title?: string;
  /** Chronological or reverse-chronological governance audit entries. */
  entries: AuditLogEntry[];
  /** Show the text filter input in the toolbar. */
  searchable?: boolean;
  /** Initial category filter selection. */
  initialCategory?: CategoryFilter;
  /** Show CSV and JSON export buttons in the toolbar. */
  exportable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Immutable Governance Audit Log",
  searchable: true,
  initialCategory: "all",
  exportable: true,
});

const emit = defineEmits<{
  export: [format: "csv" | "json", entries: AuditLogEntry[]];
  inspect: [entry: AuditLogEntry];
}>();

const instanceId = useId();
const searchInputId = `tux-audit-search-${instanceId}`;

const query = ref("");
const activeCategory = ref<CategoryFilter>(props.initialCategory);
const expandedIds = ref<Record<string, boolean>>({});
const copiedFormat = ref<"csv" | "json" | null>(null);

watch(
  () => props.initialCategory,
  (next) => {
    activeCategory.value = next;
  },
);

const categoryOptions = computed(() => {
  const counts: Record<CategoryFilter, number> = {
    all: props.entries.length,
    attribution: 0,
    rate: 0,
    signoff: 0,
    settlement: 0,
    system: 0,
  };
  for (const entry of props.entries) {
    counts[entry.category] += 1;
  }
  return [
    { value: "all" as const, label: "All", count: counts.all },
    { value: "attribution" as const, label: "Attribution", count: counts.attribution },
    { value: "rate" as const, label: "Rate", count: counts.rate },
    { value: "signoff" as const, label: "Signoff", count: counts.signoff },
    { value: "settlement" as const, label: "Settlement", count: counts.settlement },
    { value: "system" as const, label: "System", count: counts.system },
  ];
});

const filteredEntries = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.entries.filter((entry) => {
    if (activeCategory.value !== "all" && entry.category !== activeCategory.value) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      entry.id,
      entry.timestamp,
      entry.actor,
      entry.actorRole ?? "",
      entry.action,
      entry.category,
      entry.target,
      entry.reason ?? "",
      entry.digest ?? "",
      ...(entry.changes ?? []).flatMap((c) => [c.field, c.before, c.after]),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

function isExpanded(entryId: string): boolean {
  return Boolean(expandedIds.value[entryId]);
}

function toggleChanges(entryId: string) {
  expandedIds.value = {
    ...expandedIds.value,
    [entryId]: !expandedIds.value[entryId],
  };
}

function diffPanelId(entryId: string): string {
  return `tux-audit-diff-${instanceId}-${entryId}`;
}

function categoryLabel(cat: AuditLogEntry["category"]): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function severityLabel(sev?: AuditLogEntry["severity"]): string {
  if (sev === "critical") return "Critical";
  if (sev === "warning") return "Warning";
  return "Info";
}

function escapeCsv(raw: string): string {
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function serializeCsv(rows: AuditLogEntry[]): string {
  const headers = [
    "ID",
    "Timestamp",
    "Category",
    "Severity",
    "Actor",
    "ActorRole",
    "Action",
    "Target",
    "Reason",
    "Digest",
    "ChangeCount",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.timestamp,
        r.category,
        r.severity ?? "info",
        r.actor,
        r.actorRole ?? "",
        r.action,
        r.target,
        r.reason ?? "",
        r.digest ?? "",
        String(r.changes?.length ?? 0),
      ]
        .map(escapeCsv)
        .join(","),
    );
  }
  return lines.join("\n");
}

function handleExport(format: "csv" | "json") {
  const snapshot = filteredEntries.value.map((e) => ({
    ...e,
    changes: e.changes ? e.changes.map((c) => ({ ...c })) : undefined,
  }));
  const payload =
    format === "csv" ? serializeCsv(snapshot) : JSON.stringify(snapshot, null, 2);

  if (globalThis.navigator?.clipboard?.writeText) {
    globalThis.navigator.clipboard.writeText(payload).catch(() => {});
  }
  copiedFormat.value = format;
  setTimeout(() => {
    if (copiedFormat.value === format) {
      copiedFormat.value = null;
    }
  }, 1800);

  emit("export", format, snapshot);
}
</script>

<template>
  <section class="tux-audit-log" :aria-label="title">
    <header class="tux-audit-log__header">
      <div class="tux-audit-log__title-group">
        <h2 class="tux-audit-log__title">{{ title }}</h2>
        <span class="tux-audit-log__count-pill">
          {{ filteredEntries.length }} of {{ entries.length }}
          {{ entries.length === 1 ? "event" : "events" }}
        </span>
      </div>

      <div
        v-if="exportable"
        class="tux-audit-log__export-group"
        role="group"
        aria-label="Export audit log"
      >
        <button
          type="button"
          class="tux-audit-log__export-btn"
          @click="handleExport('csv')"
        >
          {{ copiedFormat === "csv" ? "Copied CSV" : "Export CSV" }}
        </button>
        <button
          type="button"
          class="tux-audit-log__export-btn tux-audit-log__export-btn--primary"
          @click="handleExport('json')"
        >
          {{ copiedFormat === "json" ? "Copied JSON" : "Export JSON" }}
        </button>
      </div>
    </header>

    <div class="tux-audit-log__toolbar">
      <div v-if="searchable" class="tux-audit-log__search-wrap">
        <label :for="searchInputId" class="tux-audit-log__sr-only">
          Filter audit events
        </label>
        <input
          :id="searchInputId"
          v-model="query"
          type="search"
          aria-label="Filter audit events"
          placeholder="Filter by actor, target, action, reason, or digest…"
          class="tux-audit-log__search-input"
        >
      </div>

      <div
        class="tux-audit-log__categories"
        role="group"
        aria-label="Filter audit events by category"
      >
        <button
          v-for="cat in categoryOptions"
          :key="cat.value"
          type="button"
          class="tux-audit-log__cat-btn"
          :class="{ 'tux-audit-log__cat-btn--active': activeCategory === cat.value }"
          :aria-pressed="activeCategory === cat.value"
          @click="activeCategory = cat.value"
        >
          <span>{{ cat.label }}</span>
          <span class="tux-audit-log__cat-count">{{ cat.count }}</span>
        </button>
      </div>
    </div>

    <div v-if="filteredEntries.length === 0" class="tux-audit-log__empty">
      No governance audit events match the active search or category filter.
    </div>

    <ol v-else class="tux-audit-log__list">
      <li
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="tux-audit-log__item"
      >
        <div class="tux-audit-log__row">
          <div class="tux-audit-log__meta-col">
            <time class="tux-audit-log__timestamp" :datetime="entry.timestamp">
              {{ entry.timestamp }}
            </time>
            <div class="tux-audit-log__badges">
              <span class="tux-audit-log__status-pill">
                <span
                  class="tux-audit-log__dot"
                  :class="`tux-audit-log__dot--${entry.severity ?? 'info'}`"
                  aria-hidden="true"
                />
                <span>{{ categoryLabel(entry.category) }} &middot; {{ severityLabel(entry.severity) }}</span>
              </span>
              <span v-if="entry.digest" class="tux-audit-log__digest" title="Verification digest">
                {{ entry.digest }}
              </span>
            </div>
          </div>

          <div class="tux-audit-log__main-col">
            <div class="tux-audit-log__action-line">
              <strong class="tux-audit-log__action">{{ entry.action }}</strong>
              <span class="tux-audit-log__arrow" aria-hidden="true">&rarr;</span>
              <code class="tux-audit-log__target">{{ entry.target }}</code>
            </div>

            <div class="tux-audit-log__actor-line">
              <span class="tux-audit-log__actor">{{ entry.actor }}</span>
              <span v-if="entry.actorRole" class="tux-audit-log__role">
                ({{ entry.actorRole }})
              </span>
            </div>

            <p v-if="entry.reason" class="tux-audit-log__reason">
              Reason: {{ entry.reason }}
            </p>
          </div>

          <div class="tux-audit-log__actions-col">
            <button
              v-if="entry.changes && entry.changes.length > 0"
              type="button"
              class="tux-audit-log__disclosure-btn"
              :aria-expanded="isExpanded(entry.id)"
              :aria-controls="isExpanded(entry.id) ? diffPanelId(entry.id) : undefined"
              @click="toggleChanges(entry.id)"
            >
              <span
                class="tux-audit-log__chevron"
                :class="{ 'tux-audit-log__chevron--open': isExpanded(entry.id) }"
                aria-hidden="true"
              >
                &#9656;
              </span>
              <span>Changes ({{ entry.changes.length }})</span>
            </button>

            <button
              type="button"
              class="tux-audit-log__inspect-btn"
              :aria-label="`Inspect audit event ${entry.id} for ${entry.target}`"
              @click="emit('inspect', entry)"
            >
              Inspect
            </button>
          </div>
        </div>

        <div
          v-if="entry.changes && entry.changes.length > 0 && isExpanded(entry.id)"
          :id="diffPanelId(entry.id)"
          class="tux-audit-log__diff-wrap"
        >
          <div
            class="tux-audit-log__diff-scroll"
            tabindex="0"
            role="region"
            :aria-label="`Field changes for ${entry.target}`"
          >
            <table class="tux-audit-log__diff-table">
              <caption class="tux-audit-log__sr-only">
                Before and after field values for {{ entry.target }}
              </caption>
              <thead>
                <tr>
                  <th scope="col" class="tux-audit-log__diff-th">Field</th>
                  <th scope="col" class="tux-audit-log__diff-th">Before</th>
                  <th scope="col" class="tux-audit-log__diff-th">After</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(delta, idx) in entry.changes"
                  :key="`${entry.id}-chg-${idx}`"
                  class="tux-audit-log__diff-tr"
                >
                  <th scope="row" class="tux-audit-log__diff-field">{{ delta.field }}</th>
                  <td class="tux-audit-log__diff-td tux-audit-log__diff-td--before">
                    <span class="tux-audit-log__diff-prefix" aria-hidden="true">&minus;</span>
                    <code>{{ delta.before }}</code>
                  </td>
                  <td class="tux-audit-log__diff-td tux-audit-log__diff-td--after">
                    <span class="tux-audit-log__diff-prefix" aria-hidden="true">+</span>
                    <code>{{ delta.after }}</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.tux-audit-log {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--accent-gold, var(--brand-accent));
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
}

.tux-audit-log *,
.tux-audit-log *::before,
.tux-audit-log *::after {
  box-sizing: border-box;
}

.tux-audit-log__sr-only {
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

.tux-audit-log__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  min-width: 0;
}

.tux-audit-log__title-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-10);
  min-width: 0;
}

.tux-audit-log__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.tux-audit-log__count-pill {
  display: inline-flex;
  align-items: center;
  padding: var(--space-4) var(--space-10);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  font-variant-numeric: tabular-nums;
}

.tux-audit-log__export-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-audit-log__export-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-audit-log__export-btn:hover {
  border-color: var(--brand-primary);
}

.tux-audit-log__export-btn--primary {
  background-color: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-audit-log__export-btn--primary:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--text-on-brand);
}

.tux-audit-log__toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  min-width: 0;
}

.tux-audit-log__search-wrap {
  width: 100%;
  min-width: 0;
}

.tux-audit-log__search-input {
  width: 100%;
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-audit-log__search-input::placeholder {
  color: var(--text-secondary);
}

.tux-audit-log__categories {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.tux-audit-log__cat-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background-color: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.tux-audit-log__cat-btn:hover {
  border-color: var(--brand-primary);
}

.tux-audit-log__cat-btn--active {
  background-color: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-audit-log__cat-btn--active:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--text-on-brand);
}

.tux-audit-log__cat-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
}

.tux-audit-log__cat-btn--active .tux-audit-log__cat-count {
  background: var(--surface-page);
  border-color: var(--surface-border);
  color: var(--text-primary);
}

.tux-audit-log__empty {
  padding: var(--space-24);
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-audit-log__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  min-width: 0;
}

.tux-audit-log__item {
  background: var(--surface-eggshell);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-audit-log__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-12);
  min-width: 0;
}

.tux-audit-log__meta-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex: 0 1 230px;
  min-width: 0;
}

.tux-audit-log__timestamp {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-audit-log__badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-audit-log__status-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: 2px var(--space-8);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
}

.tux-audit-log__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.tux-audit-log__dot--info {
  background: var(--status-ok);
}

.tux-audit-log__dot--warning {
  background: var(--status-warning);
}

.tux-audit-log__dot--critical {
  background: var(--status-critical);
}

.tux-audit-log__digest {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  overflow-wrap: anywhere;
}

.tux-audit-log__main-col {
  flex: 1 1 240px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tux-audit-log__action-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.tux-audit-log__action {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-audit-log__arrow {
  color: var(--text-secondary);
}

.tux-audit-log__target {
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  overflow-wrap: anywhere;
}

.tux-audit-log__actor-line {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-audit-log__actor {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-audit-log__role {
  margin-left: var(--space-4);
}

.tux-audit-log__reason {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-secondary);
}

.tux-audit-log__actions-col {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-audit-log__disclosure-btn,
.tux-audit-log__inspect-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-audit-log__disclosure-btn:hover,
.tux-audit-log__inspect-btn:hover {
  border-color: var(--brand-primary);
}

.tux-audit-log__chevron {
  display: inline-block;
  transition: transform 0.15s ease;
}

.tux-audit-log__chevron--open {
  transform: rotate(90deg);
}

.tux-audit-log__diff-wrap {
  padding: 0 var(--space-12) var(--space-12);
}

.tux-audit-log__diff-scroll {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-audit-log__diff-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.tux-audit-log__diff-th {
  padding: var(--space-8) var(--space-12);
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
}

.tux-audit-log__diff-tr {
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-audit-log__diff-tr:last-child {
  border-bottom: 0;
}

.tux-audit-log__diff-field {
  padding: var(--space-8) var(--space-12);
  text-align: left;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-audit-log__diff-td {
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.tux-audit-log__diff-prefix {
  display: inline-block;
  width: 16px;
  font-weight: 700;
  color: var(--text-secondary);
}

.tux-audit-log button:focus-visible,
.tux-audit-log input:focus-visible,
.tux-audit-log select:focus-visible,
.tux-audit-log__diff-scroll:focus-visible {
  outline: 3px solid var(--focus-ring, var(--focus-ring-outer));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .tux-audit-log__cat-btn,
  .tux-audit-log__chevron {
    transition: none;
  }
}
</style>
