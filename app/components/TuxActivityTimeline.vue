<script setup lang="ts">
/**
 * TuxActivityTimeline — editorial vertical event timeline.
 *
 * The activity rail shape three consumer surfaces sketch by hand
 * today: project milestones on a program page, ingest/agent activity
 * on a Landscape dashboard, session history in tti-ai-studio. One
 * component, stateless — the host owns the feed; this renders it.
 *
 * TTI voice, not SaaS feed: a maroon spine with a gold-ringed
 * "current" node, mono tabular timestamps, eyebrow-weight group
 * headings. Semantic `tone` per item maps onto the same palette the
 * badge/alert family uses, so a `warning` milestone and a `warning`
 * badge read as one system.
 *
 * Data shape:
 *   items: Array<{
 *     id: string,
 *     time: string,        // display time ("14:32", "Mar 4")
 *     datetime?: string,   // machine-readable for <time>; falls back to `time`
 *     title: string,
 *     description?: string,
 *     icon?: string,       // lucide name; overrides the dot marker
 *     tone?: "neutral" | "info" | "success" | "warning" | "error",
 *     current?: boolean,   // gold-ring highlight, one per feed
 *     heading?: boolean,   // renders as a group heading row (eyebrow)
 *   }>
 *
 * Slots:
 *   #item="{ item }"     — replace the body (title + description)
 *   #trailing="{ item }" — right-aligned extras (badge, action)
 *
 * Usage:
 *   <tux-activity-timeline :items="feed" />
 */
import { formatStationing } from "../composables/useTuxUnits";
import { useTuxSyncCursor } from "../composables/useTuxSyncCursor";

export interface TuxActivityTimelineItem {
  id: string;
  time?: string;
  datetime?: string;
  title: string;
  description?: string;
  icon?: string;
  tone?: "neutral" | "info" | "success" | "warning" | "error";
  current?: boolean;
  heading?: boolean;
  /** Optional civil-engineering stationing (number in feet -> "STA 12+50", or string like "RM 240.5"). */
  station?: number | string;
  /** Optional highway milepost for synchronized corridor scrubbing. */
  milepost?: number;
}

interface Props {
  items: TuxActivityTimelineItem[];
  /** Compact rows for rail/sidebar placement. Default false. */
  dense?: boolean;
  /** Optional synchronized telemetry cursor channel name (links with useTuxSyncCursor). */
  syncChannel?: string;
  /** Optional TTI 5-band research division accent ("maroon" | "blue" | "teal" | "green" | "gold"). */
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
}

const props = withDefaults(defineProps<Props>(), {
  dense: false,
  syncChannel: undefined,
  division: undefined,
});

const syncBus = computed(() =>
  props.syncChannel ? useTuxSyncCursor(props.syncChannel) : null,
);

function formatItemStation(item: TuxActivityTimelineItem): string | null {
  if (item.station != null) {
    return typeof item.station === "number"
      ? formatStationing(item.station, 0)
      : item.station;
  }
  if (item.milepost != null) {
    return `RM ${item.milepost}`;
  }
  return null;
}

function isItemSynced(item: TuxActivityTimelineItem): boolean {
  const c = syncBus.value?.cursor.value;
  if (!c || !c.active) return false;
  if (c.eventId && c.eventId === item.id) return true;
  if (c.milepost != null && item.milepost != null && Math.abs(c.milepost - item.milepost) <= 0.5) {
    return true;
  }
  if (c.timestamp && item.time && c.timestamp === item.time) return true;
  return false;
}

function activateTimelineItem(item: TuxActivityTimelineItem) {
  if (!syncBus.value || item.heading) return;
  if (item.milepost != null) {
    syncBus.value.setCursor({
      milepost: item.milepost,
      timestamp: item.time ?? null,
      eventId: item.id,
      label: item.title,
      sourceId: item.id,
    });
  } else if (item.time) {
    syncBus.value.setTimestamp(item.time, {
      eventId: item.id,
      label: item.title,
      sourceId: item.id,
    });
  }
}
</script>

<template>
  <ol
    class="tux-activity-timeline"
    :class="[
      dense && 'tux-activity-timeline--dense',
      division && `tux-activity-timeline--division tux-activity-timeline--division-${division}`,
    ]"
  >
    <li
      v-for="item in items"
      :key="item.id"
      class="tux-activity-timeline__item"
      :class="[
        item.tone && `tux-activity-timeline__item--${item.tone}`,
        item.current && 'tux-activity-timeline__item--current',
        item.heading && 'tux-activity-timeline__item--heading',
        isItemSynced(item) && 'tux-activity-timeline__item--synced',
      ]"
      @mouseenter="activateTimelineItem(item)"
      @click="activateTimelineItem(item)"
    >
      <!-- Group heading row: eyebrow rhythm, spine passes through. -->
      <template v-if="item.heading">
        <span class="tux-activity-timeline__heading">{{ item.title }}</span>
      </template>

      <template v-else>
        <span class="tux-activity-timeline__marker" aria-hidden="true">
          <Icon v-if="item.icon" :name="item.icon" class="tux-activity-timeline__marker-icon" />
        </span>
        <div class="tux-activity-timeline__body">
          <div class="tux-activity-timeline__head">
            <div class="tux-activity-timeline__meta">
              <time
                v-if="item.time"
                class="tux-activity-timeline__time"
                :datetime="item.datetime ?? item.time"
              >{{ item.time }}</time>
              <span
                v-if="formatItemStation(item)"
                class="tux-activity-timeline__station"
              >{{ formatItemStation(item) }}</span>
            </div>
            <span v-if="$slots.trailing" class="tux-activity-timeline__trailing">
              <slot name="trailing" :item="item" />
            </span>
          </div>
          <slot name="item" :item="item">
            <p class="tux-activity-timeline__title">{{ item.title }}</p>
            <p v-if="item.description" class="tux-activity-timeline__description">
              {{ item.description }}
            </p>
          </slot>
        </div>
      </template>
    </li>
  </ol>
</template>

<style scoped>
.tux-activity-timeline {
  container-type: inline-size;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  --tux-atl-marker: var(--brand-primary);
}

.tux-activity-timeline--division-maroon {
  --tux-atl-marker: var(--spectrum-maroon, var(--brand-primary));
}
.tux-activity-timeline--division-blue {
  --tux-atl-marker: var(--spectrum-blue, var(--brand-secondary));
}
.tux-activity-timeline--division-teal {
  --tux-atl-marker: var(--spectrum-teal, var(--brand-primary));
}
.tux-activity-timeline--division-green {
  --tux-atl-marker: var(--spectrum-green, var(--color-success));
}
.tux-activity-timeline--division-gold {
  --tux-atl-marker: var(--spectrum-gold, var(--brand-accent));
}

/* The maroon spine — drawn per item so it starts/stops with content. */
.tux-activity-timeline__item {
  position: relative;
  display: flex;
  gap: 0.875rem;
  padding: 0 0 1.25rem 0;
}

.tux-activity-timeline--dense .tux-activity-timeline__item {
  padding-bottom: 0.75rem;
}

.tux-activity-timeline__item::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 14px;
  bottom: -2px;
  width: 2px;
  background: var(--wash-brand-22);
}

.tux-activity-timeline__item:last-child::before {
  display: none;
}

/* Semantic tones — same palette the badge/alert family uses. */
.tux-activity-timeline__item--info    { --tux-atl-marker: var(--color-info, #3c5a87); }
.tux-activity-timeline__item--success { --tux-atl-marker: var(--color-success, #6b8e5a); }
.tux-activity-timeline__item--warning { --tux-atl-marker: var(--color-warning, #c7973c); }
.tux-activity-timeline__item--error   { --tux-atl-marker: var(--color-error, #a33a3a); }

.tux-activity-timeline__marker {
  flex: none;
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 50%;
  background: var(--tux-atl-marker);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* Icon markers grow the circle and knock the glyph out in white. */
.tux-activity-timeline__item:has(.tux-activity-timeline__marker-icon) .tux-activity-timeline__marker {
  width: 24px;
  height: 24px;
  margin-top: 0;
  margin-left: -6px;
}

.tux-activity-timeline__marker-icon {
  width: 14px;
  height: 14px;
  color: var(--text-inverse);
}

/* The gold ring — "you are here." One per feed. */
.tux-activity-timeline__item--current .tux-activity-timeline__marker {
  box-shadow:
    0 0 0 2px var(--surface-page),
    0 0 0 4px var(--brand-accent, #ddac37);
}

.tux-activity-timeline__body {
  flex: 1;
  min-width: 0;
}

.tux-activity-timeline__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.tux-activity-timeline__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tux-activity-timeline__time {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.tux-activity-timeline__station {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--tux-atl-marker);
  background: color-mix(in srgb, var(--tux-atl-marker) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--tux-atl-marker) 22%, transparent);
  padding: 0.0625rem 0.375rem;
  border-radius: var(--radius-sm);
}

.tux-activity-timeline__item--synced .tux-activity-timeline__body {
  background: color-mix(in srgb, var(--tux-atl-marker) 6%, transparent);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.5rem;
  margin-left: -0.5rem;
}

.tux-activity-timeline__title {
  margin: 0.125rem 0 0 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  overflow-wrap: break-word;
}

.tux-activity-timeline--dense .tux-activity-timeline__title {
  font-size: 0.8125rem;
}

.tux-activity-timeline__description {
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-activity-timeline--dense .tux-activity-timeline__description {
  font-size: 0.75rem;
}

/* Group heading rows: the eyebrow rhythm from print collateral. */
.tux-activity-timeline__item--heading {
  padding-bottom: 0.625rem;
}

.tux-activity-timeline__item--heading::before {
  top: 4px;
}

.tux-activity-timeline__heading {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding-left: 1.625rem;
}
</style>
