<script setup lang="ts">
/**
 * TuxFeedStatus — upstream data connector & telemetry ingestion health monitor.
 *
 * Displays an aggregate health summary strip (healthy, stale, syncing, and error
 * counts + optional "Sync All" trigger) above a list or responsive grid of
 * connector cards with mono tabular record counts, lag badges, diagnostic
 * messages, and 44×44px per-feed sync actions.
 */
import { computed } from "vue";

export interface FeedConnectorItem {
  id: string;
  name: string;
  category?: string;
  status: "healthy" | "stale" | "syncing" | "error";
  lastSynced: string;
  recordCount?: number;
  lagLabel?: string;
  message?: string;
}

interface Props {
  feeds: FeedConnectorItem[];
  title?: string;
  layout?: "list" | "grid";
  syncable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  layout: "list",
  syncable: true,
});

const emit = defineEmits<{
  sync: [feedId: string];
  syncAll: [];
}>();

const healthyCount = computed<number>(
  () => props.feeds.filter((f) => f.status === "healthy").length,
);

const staleCount = computed<number>(
  () => props.feeds.filter((f) => f.status === "stale").length,
);

const syncingCount = computed<number>(
  () => props.feeds.filter((f) => f.status === "syncing").length,
);

const errorCount = computed<number>(
  () => props.feeds.filter((f) => f.status === "error").length,
);

function statusLabel(status: FeedConnectorItem["status"]): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "stale":
      return "Stale";
    case "syncing":
      return "Syncing";
    case "error":
      return "Error";
  }
}

function formatRecords(count: number): string {
  return `${count.toLocaleString("en-US")} records`;
}
</script>

<template>
  <div class="tux-feed-status">
    <div class="tux-feed-status__summary">
      <div class="tux-feed-status__summary-left">
        <span v-if="title" class="tux-feed-status__title">{{ title }}</span>
        <div class="tux-feed-status__counts" role="group" aria-label="Connector status summary">
          <span class="tux-feed-status__count-pill tux-feed-status__count-pill--healthy">
            <span class="tux-feed-status__count-num">{{ healthyCount }}</span> healthy
          </span>
          <span class="tux-feed-status__count-pill tux-feed-status__count-pill--stale">
            <span class="tux-feed-status__count-num">{{ staleCount }}</span> stale
          </span>
          <span
            v-if="syncingCount > 0"
            class="tux-feed-status__count-pill tux-feed-status__count-pill--syncing"
          >
            <span class="tux-feed-status__count-num">{{ syncingCount }}</span> syncing
          </span>
          <span class="tux-feed-status__count-pill tux-feed-status__count-pill--error">
            <span class="tux-feed-status__count-num">{{ errorCount }}</span> error
          </span>
        </div>
      </div>

      <button
        v-if="syncable"
        type="button"
        class="tux-feed-status__sync-all-btn min-h-11"
        @click="emit('syncAll')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-feed-status__btn-icon"
          aria-hidden="true"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span>Sync All</span>
      </button>
    </div>

    <ul
      class="tux-feed-status__items"
      :class="`tux-feed-status__items--${layout}`"
    >
      <li
        v-for="feed in feeds"
        :key="feed.id"
        class="tux-feed-status__item"
        :class="`tux-feed-status__item--${feed.status}`"
      >
        <div class="tux-feed-status__item-main">
          <div class="tux-feed-status__item-head">
            <div class="tux-feed-status__identity">
              <span v-if="feed.category" class="tux-feed-status__category">
                {{ feed.category }}
              </span>
              <span class="tux-feed-status__name">{{ feed.name }}</span>
            </div>

            <span
              class="tux-feed-status__pill"
              :class="`tux-feed-status__pill--${feed.status}`"
            >
              <svg
                v-if="feed.status === 'healthy'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="tux-feed-status__pill-icon"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <svg
                v-else-if="feed.status === 'stale'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="tux-feed-status__pill-icon"
                aria-hidden="true"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <svg
                v-else-if="feed.status === 'syncing'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="tux-feed-status__pill-icon tux-feed-status__pill-icon--spin"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="tux-feed-status__pill-icon tux-feed-status__pill-icon--error"
                aria-hidden="true"
              >
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ statusLabel(feed.status) }}</span>
            </span>
          </div>

          <div class="tux-feed-status__telemetry">
            <span class="tux-feed-status__synced">
              Last synced: {{ feed.lastSynced }}
            </span>
            <span v-if="feed.recordCount !== undefined" class="tux-feed-status__records">
              {{ formatRecords(feed.recordCount) }}
            </span>
            <span v-if="feed.lagLabel" class="tux-feed-status__lag">
              Lag: {{ feed.lagLabel }}
            </span>
          </div>

          <p v-if="feed.message" class="tux-feed-status__message">
            {{ feed.message }}
          </p>
        </div>

        <div v-if="syncable" class="tux-feed-status__item-action">
          <button
            type="button"
            class="tux-feed-status__sync-btn min-h-11"
            :aria-label="`Sync ${feed.name}`"
            @click="emit('sync', feed.id)"
          >
            Sync
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tux-feed-status {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-feed-status__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-feed-status__summary-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-12);
}

.tux-feed-status__title {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-feed-status__counts {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-feed-status__count-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
}

.tux-feed-status__count-pill--healthy {
  border-left: 3px solid var(--status-ok);
}

.tux-feed-status__count-pill--stale {
  border-left: 3px solid var(--status-warning);
}

.tux-feed-status__count-pill--syncing {
  border-left: 3px solid var(--status-maintenance);
}

.tux-feed-status__count-pill--error {
  border-left: 3px solid var(--status-critical);
}

.tux-feed-status__count-num {
  font-weight: 700;
}

.tux-feed-status__sync-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-16);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.5;
  border-radius: var(--radius-sm);
  border: 1px solid var(--brand-fill);
  background: var(--brand-fill);
  color: var(--text-on-brand);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
}

.tux-feed-status__sync-all-btn:hover {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-feed-status__sync-all-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-feed-status__btn-icon {
  width: 0.9375rem;
  height: 0.9375rem;
  flex-shrink: 0;
}

.tux-feed-status__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-10);
}

.tux-feed-status__items--list {
  grid-template-columns: 1fr;
}

.tux-feed-status__items--grid {
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
}

.tux-feed-status__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-feed-status__items--grid .tux-feed-status__item {
  flex-direction: column;
}

.tux-feed-status__item--stale {
  border-left: 3px solid var(--status-warning);
}

.tux-feed-status__item--error {
  border-left: 3px solid var(--status-critical);
}

.tux-feed-status__item--syncing {
  border-left: 3px solid var(--status-maintenance);
}

.tux-feed-status__item--healthy {
  border-left: 3px solid var(--status-ok);
}

.tux-feed-status__item-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}

.tux-feed-status__item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-feed-status__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.tux-feed-status__category {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
}

.tux-feed-status__name {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-feed-status__pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-feed-status__pill--healthy {
  border-color: var(--status-ok);
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
}

.tux-feed-status__pill--stale {
  border-color: var(--status-warning);
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
}

.tux-feed-status__pill--syncing {
  border-color: var(--status-maintenance);
  background: var(--status-maintenance-fill);
  color: var(--status-maintenance-ink);
}

.tux-feed-status__pill--error {
  border-color: var(--status-critical);
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-feed-status__pill-icon {
  width: 0.8125rem;
  height: 0.8125rem;
  flex-shrink: 0;
}

.tux-feed-status__pill-icon--error {
  color: var(--status-critical);
}

@keyframes tux-feed-spin {
  to {
    transform: rotate(360deg);
  }
}

.tux-feed-status__pill-icon--spin {
  animation: tux-feed-spin 1.1s linear infinite;
}

.tux-feed-status__telemetry {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4) var(--space-12);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-feed-status__records {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-feed-status__lag {
  color: var(--text-muted);
}

.tux-feed-status__message {
  margin: var(--space-4) 0 0 0;
  padding: var(--space-8) var(--space-10);
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 75ch;
}

.tux-feed-status__item--error .tux-feed-status__message {
  color: var(--text-primary);
  border-left: 2px solid var(--status-critical);
}

.tux-feed-status__item-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.tux-feed-status__items--grid .tux-feed-status__item-action {
  width: 100%;
  justify-content: flex-end;
  padding-top: var(--space-8);
  border-top: 1px solid var(--surface-border-subtle);
}

.tux-feed-status__sync-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.5;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-page);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-feed-status__sync-btn:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-feed-status__sync-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

@container (max-width: 30rem) {
  .tux-feed-status__item {
    flex-direction: column;
  }
  .tux-feed-status__item-action {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-feed-status__pill-icon--spin {
    animation: none;
  }
  .tux-feed-status__sync-all-btn,
  .tux-feed-status__sync-btn {
    transition: none;
  }
}
</style>
