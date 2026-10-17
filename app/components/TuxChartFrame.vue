<script setup lang="ts">
/**
 * TuxChartFrame — editorial wrapper that ties native chart
 * components into the TUX type system, equipped with multi-sensory
 * WCAG 2.2 AAA accessibility (Web Audio API acoustic sonification,
 * expandable semantic data table, and screen-reader statistical summary)
 * plus TTI 5-band research division spectrum rules and provenance metadata.
 *
 * Anatomy:
 *   - eyebrow (uppercase tracked label, e.g. "Exhibit 11.01") + optional provenance pill
 *   - display-face title (Oswald) under the eyebrow + optional a11y action toolbar
 *   - 2px TTI maroon (or research division spectrum) signature rule under the title
 *   - chart body via default slot
 *   - optional expandable Accessible Data Table disclosure
 *   - footnote and source lines below the chart
 */
import { computed, onBeforeUnmount, ref } from "vue";
import {
  computeSeriesStats,
  useTuxSonification,
  type TuxSonificationSeries,
} from "~/composables/useTuxSonification";

interface Props {
  /** Uppercase tracked eyebrow — e.g. `"Exhibit 11.01"` or `"Slide 9"`. */
  eyebrow?: string;
  /** Display-face title under the eyebrow. */
  title?: string;
  /** Optional subtitle / lede below the title, above the rule. */
  subtitle?: string;
  /** Source citation line below the chart body. */
  source?: string;
  /** Methodological note above the source line. */
  notes?: string;
  /** Hide the maroon signature rule (for tight tile layouts). */
  bare?: boolean;
  /** Optional category / x-axis labels for acoustic sonification and accessible table view. */
  labels?: string[];
  /** Optional numeric series for Web Audio sonification and accessible tabular fallback. */
  series?: TuxSonificationSeries[];
  /** Enable Web Audio API sonification button when `series` is provided. */
  sonify?: boolean;
  /** Enable expandable Accessible Data Table button when `series` is provided. */
  showDataTable?: boolean;
  /** Optional TTI Research Division 5-band spectrum accent ("maroon" | "blue" | "teal" | "green" | "gold"). */
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
  /** Optional DOI or TxDOT / federal grant provenance identifier (e.g. "TxDOT 0-6999"). */
  doi?: string;
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: "",
  title: "",
  subtitle: "",
  source: "",
  notes: "",
  bare: false,
  labels: () => [],
  series: () => [],
  sonify: true,
  showDataTable: true,
  division: undefined,
  doi: "",
});

const tableExpanded = ref(false);
const selectedSeriesIdx = ref(0);

const {
  isPlaying,
  activePointIndex,
  activeFrequencyHz,
  liveAnnouncement,
  playSeries,
  stop,
} = useTuxSonification();

const hasAccessibleSeries = computed(() => Array.isArray(props.series) && props.series.length > 0);

const activeSeries = computed<TuxSonificationSeries | undefined>(
  () => props.series[selectedSeriesIdx.value] ?? props.series[0],
);

const srSummary = computed(() => {
  if (!activeSeries.value) return "";
  return computeSeriesStats(activeSeries.value, props.labels).summary;
});

const tableRows = computed(() => {
  if (!hasAccessibleSeries.value) return [];
  const maxLen = Math.max(
    props.labels.length,
    ...props.series.map((s) => s.data.length),
  );
  const rows: Array<{ label: string; values: Array<number | string> }> = [];
  for (let i = 0; i < maxLen; i++) {
    rows.push({
      label: props.labels[i] ?? `Observation ${i + 1}`,
      values: props.series.map((s) => (s.data[i] !== undefined ? s.data[i]! : "—")),
    });
  }
  return rows;
});

function toggleSonification() {
  if (isPlaying.value) {
    stop();
    return;
  }
  if (activeSeries.value) {
    playSeries(activeSeries.value, props.labels);
  }
}

onBeforeUnmount(() => {
  stop();
});
</script>

<template>
  <figure
    class="tux-chart-frame"
    :class="[
      { 'tux-chart-frame--bare': bare },
      division ? `tux-chart-frame--division-${division}` : '',
    ]"
  >
    <figcaption
      v-if="eyebrow || title || subtitle || hasAccessibleSeries || doi"
      class="tux-chart-frame__caption"
    >
      <div class="tux-chart-frame__top-bar">
        <div class="tux-chart-frame__meta-row">
          <p v-if="eyebrow" class="tux-chart-frame__eyebrow">{{ eyebrow }}</p>
          <span v-if="doi" class="tux-chart-frame__doi" title="Verified TTI Research Provenance">
            {{ doi }}
          </span>
        </div>

        <div
          v-if="hasAccessibleSeries && (sonify || showDataTable)"
          class="tux-chart-frame__a11y-tools"
          role="group"
          aria-label="Chart accessibility controls"
        >
          <select
            v-if="series.length > 1 && sonify"
            v-model="selectedSeriesIdx"
            class="tux-chart-frame__series-select"
            aria-label="Select data series for acoustic sonification"
          >
            <option v-for="(s, idx) in series" :key="s.key ?? idx" :value="idx">
              {{ s.label }}
            </option>
          </select>

          <button
            v-if="sonify"
            type="button"
            class="tux-chart-frame__tool-btn"
            :class="{ 'tux-chart-frame__tool-btn--active': isPlaying }"
            :aria-pressed="isPlaying"
            @click="toggleSonification"
          >
            <span class="tux-chart-frame__tool-indicator" aria-hidden="true">
              {{ isPlaying ? "■" : "♫" }}
            </span>
            <span>{{ isPlaying ? "Stop Audio" : "Sonify Audio" }}</span>
            <span v-if="isPlaying && activeFrequencyHz" class="tux-chart-frame__hz">
              {{ Math.round(activeFrequencyHz) }} Hz
            </span>
          </button>

          <button
            v-if="showDataTable"
            type="button"
            class="tux-chart-frame__tool-btn"
            :class="{ 'tux-chart-frame__tool-btn--active': tableExpanded }"
            :aria-expanded="tableExpanded"
            @click="tableExpanded = !tableExpanded"
          >
            <span aria-hidden="true">⊞</span>
            <span>{{ tableExpanded ? "Hide Data Table" : "Data Table" }}</span>
          </button>
        </div>
      </div>

      <h3 v-if="title" class="tux-chart-frame__title">{{ title }}</h3>
      <p v-if="subtitle" class="tux-chart-frame__subtitle">{{ subtitle }}</p>
      <hr v-if="!bare" class="tux-chart-frame__rule">
    </figcaption>

    <!-- Screen-reader live region & automatic statistical summary -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      {{ liveAnnouncement || srSummary }}
    </div>

    <div class="tux-chart-frame__body">
      <slot />
    </div>

    <!-- Active acoustic sonification telemetry bar -->
    <div
      v-if="isPlaying && activePointIndex !== null && activeSeries"
      class="tux-chart-frame__sonify-bar"
      role="status"
    >
      <span class="tux-chart-frame__sonify-badge">Acoustic Readout</span>
      <span class="tux-chart-frame__sonify-point">
        {{ labels[activePointIndex] || `Point ${activePointIndex + 1}` }}:
        <strong>{{ activeSeries.data[activePointIndex] }}</strong>
        {{ activeSeries.unit || "" }}
      </span>
      <span v-if="activeFrequencyHz" class="tux-chart-frame__sonify-freq">
        Tone {{ Math.round(activeFrequencyHz) }} Hz
      </span>
    </div>

    <!-- Expandable WCAG 2.2 AAA Accessible Data Table -->
    <div
      v-if="hasAccessibleSeries && tableExpanded"
      class="tux-chart-frame__data-drawer"
      role="region"
      :aria-label="`${title || 'Chart'} accessible data table`"
    >
      <div class="tux-chart-frame__drawer-header">
        <span class="tux-chart-frame__drawer-title">
          Accessible Tabular Representation (WCAG 1.1.1 / 1.3.1)
        </span>
        <span class="tux-chart-frame__drawer-summary">{{ srSummary }}</span>
      </div>
      <div class="tux-chart-frame__table-wrap">
        <table class="tux-chart-frame__table">
          <thead>
            <tr>
              <th scope="col">Observation / Category</th>
              <th v-for="(s, sIdx) in series" :key="s.key ?? sIdx" scope="col">
                {{ s.label }}{{ s.unit ? ` (${s.unit})` : "" }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rIdx) in tableRows"
              :key="rIdx"
              :class="{ 'tux-chart-frame__row--active': activePointIndex === rIdx }"
            >
              <th scope="row">{{ row.label }}</th>
              <td v-for="(val, vIdx) in row.values" :key="vIdx" class="tux-chart-frame__num">
                {{ val }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="notes || source || $slots.footer" class="tux-chart-frame__footer">
      <p v-if="notes" class="tux-chart-frame__notes">{{ notes }}</p>
      <p v-if="source" class="tux-chart-frame__source">{{ source }}</p>
      <slot name="footer" />
    </div>
  </figure>
</template>

<style scoped>
.tux-chart-frame {
  --frame-accent: var(--brand-primary);
  margin: 0;
  padding: 1.25rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  container-type: inline-size;
  container-name: tux-chart-frame;
}

.tux-chart-frame--division-maroon {
  --frame-accent: var(--spectrum-maroon, var(--brand-primary));
}
.tux-chart-frame--division-blue {
  --frame-accent: var(--spectrum-blue, var(--brand-secondary));
}
.tux-chart-frame--division-teal {
  --frame-accent: var(--spectrum-teal, var(--brand-primary));
}
.tux-chart-frame--division-green {
  --frame-accent: var(--spectrum-green, var(--color-success));
}
.tux-chart-frame--division-gold {
  --frame-accent: var(--spectrum-gold, var(--brand-accent));
}

@container tux-chart-frame (max-width: 28rem) {
  .tux-chart-frame__title {
    font-size: 1rem;
  }
}

.tux-chart-frame__caption {
  margin-bottom: 1rem;
}

.tux-chart-frame__top-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.tux-chart-frame__meta-row {
  display: flex;
   flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.tux-chart-frame__eyebrow {
  font-family: var(--font-bold);
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin: 0;
}

.tux-chart-frame__doi {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  color: var(--text-secondary);
}

.tux-chart-frame__a11y-tools {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
}

.tux-chart-frame__series-select {
  min-height: 2rem;
  padding: 0.125rem 0.5rem;
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-chart-frame__tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.25rem 0.625rem;
  font-family: var(--font-bold);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.tux-chart-frame__tool-btn:hover {
  border-color: var(--frame-accent);
  background: color-mix(in srgb, var(--frame-accent) 8%, transparent);
}

.tux-chart-frame__tool-btn--active {
  color: var(--text-on-brand);
  background: var(--brand-fill);
  border-color: var(--brand-fill);
}

.tux-chart-frame__tool-btn--active:hover {
  background: var(--brand-fill);
  border-color: var(--brand-fill);
}

.tux-chart-frame__hz {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 0.05rem 0.3rem;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--surface-page) 22%, transparent);
}

.tux-chart-frame__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0.25rem 0 0;
  line-height: 1.25;
}

.tux-chart-frame__subtitle {
  font-size: 0.86rem;
  color: var(--text-secondary);
  margin: 0.375rem 0 0;
  line-height: 1.55;
  max-width: 48rem;
}

.tux-chart-frame__rule {
  height: 2px;
  width: 4rem;
  background: var(--frame-accent);
  border: none;
  margin: 0.625rem 0 0;
}

.tux-chart-frame__body {
  margin: 0;
}

.tux-chart-frame__sonify-bar {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: var(--surface-sunken);
  border-left: 3px solid var(--frame-accent);
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  color: var(--text-primary);
}

.tux-chart-frame__sonify-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
}

.tux-chart-frame__sonify-freq {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.tux-chart-frame__data-drawer {
  margin-top: 1rem;
  padding: 0.875rem;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-chart-frame__drawer-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.625rem;
}

.tux-chart-frame__drawer-title {
  font-family: var(--font-bold);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.tux-chart-frame__drawer-summary {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.tux-chart-frame__table-wrap {
  overflow-x: auto;
}

.tux-chart-frame__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

.tux-chart-frame__table th,
.tux-chart-frame__table td {
  padding: 0.5rem 0.625rem;
  border-bottom: 1px solid var(--surface-border);
  text-align: left;
  color: var(--text-primary);
}

.tux-chart-frame__table thead th {
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--frame-accent);
}

.tux-chart-frame__table td.tux-chart-frame__num {
  font-family: var(--font-mono);
}

.tux-chart-frame__row--active {
  background: color-mix(in srgb, var(--frame-accent) 12%, transparent);
}

.tux-chart-frame__footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--surface-border);
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.tux-chart-frame__notes {
  margin: 0 0 0.375rem;
}

.tux-chart-frame__source {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
