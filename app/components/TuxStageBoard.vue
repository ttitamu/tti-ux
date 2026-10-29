<script setup lang="ts">
/**
 * TuxStageBoard — multi-lane workflow / Kanban board with live lane item counts,
 * numeric metric rollups, and accessible keyboard stage movement.
 *
 * Groups `StageCardItem` entries by `stageId`, sums `metricValue` per lane, and
 * provides non-nested 44×44px card selection and directional stage-transfer
 * controls (`aria-label="Move <title> to <stage>"`).
 */
import { computed } from "vue";

export interface StageLane {
  id: string;
  label: string;
  description?: string;
}

export interface StageCardItem {
  id: string;
  stageId: string;
  title: string;
  code?: string;
  subtitle?: string;
  owner?: string;
  metricValue?: number;
  tags?: string[];
  priority?: "normal" | "high" | "critical";
}

interface Props {
  stages: StageLane[];
  items: StageCardItem[];
  metricPrefix?: string;
  metricSuffix?: string;
  decimals?: number;
  movable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  metricPrefix: "",
  metricSuffix: "",
  decimals: 0,
  movable: true,
});

const emit = defineEmits<{
  move: [
    payload: {
      itemId: string;
      fromStageId: string;
      toStageId: string;
    },
  ];
  select: [item: StageCardItem];
}>();

const boardHasMetrics = computed<boolean>(() =>
  props.items.some((item) => item.metricValue !== undefined),
);

const lanes = computed(() =>
  props.stages.map((stage, index) => {
    const stageItems = props.items.filter((item) => item.stageId === stage.id);
    const metricTotal = stageItems.reduce(
      (sum, item) => sum + (item.metricValue ?? 0),
      0,
    );
    const prevStage = index > 0 ? props.stages[index - 1] : undefined;
    const nextStage =
      index < props.stages.length - 1 ? props.stages[index + 1] : undefined;
    return {
      stage,
      items: stageItems,
      count: stageItems.length,
      metricTotal,
      prevStage,
      nextStage,
    };
  }),
);

function formatMetric(val: number): string {
  const num = val.toLocaleString("en-US", {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  });
  return `${props.metricPrefix}${num}${props.metricSuffix}`;
}

function handleMove(itemId: string, fromStageId: string, toStageId: string) {
  emit("move", { itemId, fromStageId, toStageId });
}
</script>

<template>
  <div class="tux-stage-board">
    <div class="tux-stage-board__lanes">
      <div
        v-for="lane in lanes"
        :key="lane.stage.id"
        class="tux-stage-board__lane"
        role="group"
        :aria-label="`${lane.stage.label} (${lane.count})`"
      >
        <div class="tux-stage-board__lane-header">
          <div class="tux-stage-board__lane-title-row">
            <span class="tux-stage-board__lane-label">{{ lane.stage.label }}</span>
            <span class="tux-stage-board__lane-count">{{ lane.count }}</span>
          </div>

          <div
            v-if="boardHasMetrics || lane.stage.description"
            class="tux-stage-board__lane-sub"
          >
            <span v-if="lane.stage.description" class="tux-stage-board__lane-desc">
              {{ lane.stage.description }}
            </span>
            <span v-if="boardHasMetrics" class="tux-stage-board__lane-rollup">
              Total: {{ formatMetric(lane.metricTotal) }}
            </span>
          </div>
        </div>

        <ol v-if="lane.items.length > 0" class="tux-stage-board__cards">
          <li
            v-for="item in lane.items"
            :key="item.id"
            class="tux-stage-board__card"
            :class="[
              item.priority && `tux-stage-board__card--${item.priority}`,
            ]"
          >
            <div v-if="item.code || (item.priority && item.priority !== 'normal')" class="tux-stage-board__card-top">
              <span v-if="item.code" class="tux-stage-board__code">{{ item.code }}</span>
              <span
                v-if="item.priority === 'critical' || item.priority === 'high'"
                class="tux-stage-board__priority"
                :class="`tux-stage-board__priority--${item.priority}`"
              >
                {{ item.priority === "critical" ? "Critical" : "High" }}
              </span>
            </div>

            <button
              type="button"
              class="tux-stage-board__card-select min-h-11"
              :aria-label="`Select ${item.title}`"
              @click="emit('select', item)"
            >
              <span class="tux-stage-board__card-title">{{ item.title }}</span>
            </button>
            <p v-if="item.subtitle" class="tux-stage-board__card-subtitle">
              {{ item.subtitle }}
            </p>

            <div
              v-if="item.owner || item.metricValue !== undefined"
              class="tux-stage-board__card-meta"
            >
              <span v-if="item.owner" class="tux-stage-board__owner">
                {{ item.owner }}
              </span>
              <span v-if="item.metricValue !== undefined" class="tux-stage-board__metric">
                {{ formatMetric(item.metricValue) }}
              </span>
            </div>

            <ul
              v-if="item.tags && item.tags.length > 0"
              class="tux-stage-board__tags"
              aria-label="Tags"
            >
              <li
                v-for="tag in item.tags"
                :key="tag"
                class="tux-stage-board__tag"
              >
                {{ tag }}
              </li>
            </ul>

            <div
              v-if="movable && (lane.prevStage || lane.nextStage)"
              class="tux-stage-board__card-actions"
            >
              <button
                v-if="lane.prevStage"
                type="button"
                class="tux-stage-board__move-btn tux-stage-board__move-btn--prev min-h-11"
                :aria-label="`Move ${item.title} to ${lane.prevStage.label}`"
                @click="handleMove(item.id, lane.stage.id, lane.prevStage.id)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="tux-stage-board__move-icon"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>{{ lane.prevStage.label }}</span>
              </button>

              <button
                v-if="lane.nextStage"
                type="button"
                class="tux-stage-board__move-btn tux-stage-board__move-btn--next min-h-11"
                :aria-label="`Move ${item.title} to ${lane.nextStage.label}`"
                @click="handleMove(item.id, lane.stage.id, lane.nextStage.id)"
              >
                <span>{{ lane.nextStage.label }}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="tux-stage-board__move-icon"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </li>
        </ol>

        <p v-else class="tux-stage-board__empty">No items in this stage</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-stage-board {
  container-type: inline-size;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-stage-board__lanes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15.5rem, 1fr));
  gap: var(--space-16);
  align-items: start;
}

.tux-stage-board__lane {
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--brand-primary);
  border-radius: var(--radius-md);
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  min-width: 0;
}

.tux-stage-board__lane-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--surface-border);
}

.tux-stage-board__lane-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.tux-stage-board__lane-label {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-stage-board__lane-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  padding: 0.0625rem 0.4375rem;
  border-radius: var(--radius-full);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-stage-board__lane-sub {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-stage-board__lane-desc {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-stage-board__lane-rollup {
  margin-left: auto;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-brand);
}

.tux-stage-board__cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.tux-stage-board__card {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.tux-stage-board__card--high {
  border-left: 3px solid var(--status-warning);
}

.tux-stage-board__card--critical {
  border-left: 3px solid var(--status-critical);
}

.tux-stage-board__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.tux-stage-board__code {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tux-stage-board__priority {
  display: inline-flex;
  align-items: center;
  padding: 0.0625rem 0.375rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  border: 1px solid var(--surface-border);
}

.tux-stage-board__priority--high {
  border-color: var(--status-warning);
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
}

.tux-stage-board__priority--critical {
  border-color: var(--status-critical);
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-stage-board__card-select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-4) var(--space-8);
  margin: 0 calc(-1 * var(--space-8));
  width: calc(100% + 2 * var(--space-8));
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  transition: background-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.tux-stage-board__card-select:hover {
  background: var(--wash-brand-4);
  color: var(--brand-primary);
}

.tux-stage-board__card-select:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-stage-board__card-title {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
}

.tux-stage-board__card-subtitle {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-stage-board__card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  font-size: 0.75rem;
  line-height: 1.5;
}

.tux-stage-board__owner {
  color: var(--text-secondary);
  font-weight: 600;
}

.tux-stage-board__metric {
  margin-left: auto;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-stage-board__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.tux-stage-board__tag {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.0625rem 0.375rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  color: var(--text-secondary);
}

.tux-stage-board__card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding-top: var(--space-8);
  border-top: 1px solid var(--surface-border-subtle);
}

.tux-stage-board__move-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-4) var(--space-8);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-page);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-stage-board__move-btn--next {
  margin-left: auto;
}

.tux-stage-board__move-btn:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-stage-board__move-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-stage-board__move-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.tux-stage-board__empty {
  margin: 0;
  padding: var(--space-16) var(--space-8);
  text-align: center;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-muted);
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-sm);
}

@container (max-width: 36rem) {
  .tux-stage-board__lanes {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-stage-board__card-select,
  .tux-stage-board__move-btn {
    transition: none;
  }
}
</style>
