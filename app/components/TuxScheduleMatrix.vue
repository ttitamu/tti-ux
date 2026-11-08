<script setup lang="ts">
/**
 * TuxScheduleMatrix — interactive Day × Time-Block (or generic Row × Column)
 * schedule paint matrix.
 *
 * Designed for managed-lane / HOV operating windows, signal-timing plan
 * matrices, reversible-corridor schedules, sensor polling cadences, and
 * recurring operational maintenance windows.
 */
import { computed, onUnmounted, ref } from "vue";

export interface TuxScheduleMatrixProps {
  /** 2-D boolean state grid (`rows × columns`). */
  modelValue: boolean[][];
  /** Row labels (defaults to 7 days `Mon`..`Sun`). */
  rowLabels?: string[];
  /** Column labels (defaults to 8 three-hour blocks `00–03`..`21–24`). */
  colLabels?: string[];
  /** Semantic label for active slots. */
  activeLabel?: string;
  /** Semantic label for inactive/standby slots. */
  inactiveLabel?: string;
  /** Display quick-fill schedule preset buttons above the matrix. */
  showPresets?: boolean;
}

export type ScheduleMatrixProps = TuxScheduleMatrixProps;

const props = withDefaults(defineProps<TuxScheduleMatrixProps>(), {
  rowLabels: () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  colLabels: () => ["00–03", "03–06", "06–09", "09–12", "12–15", "15–18", "18–21", "21–24"],
  activeLabel: "Active",
  inactiveLabel: "Standby",
  showPresets: true,
});

const emit = defineEmits<{
  "update:modelValue": [grid: boolean[][]];
}>();

const matrixRoot = ref<HTMLElement | null>(null);

interface PaintSession {
  targetValue: boolean;
  startRow: number;
  startCol: number;
  didDrag: boolean;
}

const paintSession = ref<PaintSession | null>(null);

const rowCount = computed(() => props.rowLabels.length);
const colCount = computed(() => props.colLabels.length);

function isCellActive(r: number, c: number): boolean {
  return Boolean(props.modelValue[r]?.[c]);
}

function buildGrid(mapper: (r: number, c: number, current: boolean) => boolean): boolean[][] {
  const rows = rowCount.value;
  const cols = colCount.value;
  const next: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    const rowArr: boolean[] = [];
    for (let c = 0; c < cols; c++) {
      rowArr.push(mapper(r, c, isCellActive(r, c)));
    }
    next.push(rowArr);
  }
  return next;
}

function isRowAllActive(r: number): boolean {
  const cols = colCount.value;
  if (cols === 0) return false;
  for (let c = 0; c < cols; c++) {
    if (!isCellActive(r, c)) return false;
  }
  return true;
}

function isColAllActive(c: number): boolean {
  const rows = rowCount.value;
  if (rows === 0) return false;
  for (let r = 0; r < rows; r++) {
    if (!isCellActive(r, c)) return false;
  }
  return true;
}

function toggleCell(r: number, c: number) {
  const nextVal = !isCellActive(r, c);
  emit(
    "update:modelValue",
    buildGrid((ri, ci, cur) => (ri === r && ci === c ? nextVal : cur)),
  );
}

function toggleRow(r: number) {
  const target = !isRowAllActive(r);
  emit(
    "update:modelValue",
    buildGrid((ri, _ci, cur) => (ri === r ? target : cur)),
  );
}

function toggleCol(c: number) {
  const target = !isColAllActive(c);
  emit(
    "update:modelValue",
    buildGrid((_ri, ci, cur) => (ci === c ? target : cur)),
  );
}

function isDaytimeSlot(r: number, c: number): boolean {
  const rows = rowCount.value;
  const cols = colCount.value;
  const isWeekday = rows >= 6 ? r < 5 : true;
  const dayStart = Math.floor(cols * 0.25);
  const dayEnd = Math.max(dayStart + 1, Math.floor(cols * 0.75));
  return isWeekday && c >= dayStart && c < dayEnd;
}

function applyPreset(preset: "weekdays-daytime" | "all-active" | "off-peak" | "clear") {
  if (preset === "all-active") {
    emit("update:modelValue", buildGrid(() => true));
    return;
  }
  if (preset === "clear") {
    emit("update:modelValue", buildGrid(() => false));
    return;
  }
  if (preset === "weekdays-daytime") {
    emit("update:modelValue", buildGrid((r, c) => isDaytimeSlot(r, c)));
    return;
  }
  emit("update:modelValue", buildGrid((r, c) => !isDaytimeSlot(r, c)));
}

function clearPaintSession() {
  paintSession.value = null;
}

function onCellPointerDown(r: number, c: number, e: PointerEvent) {
  if (e.button !== 0 && e.pointerType === "mouse") return;
  paintSession.value = {
    targetValue: !isCellActive(r, c),
    startRow: r,
    startCol: c,
    didDrag: false,
  };
  if (globalThis.window) {
    globalThis.window.addEventListener("pointerup", clearPaintSession, { once: true });
    globalThis.window.addEventListener("pointercancel", clearPaintSession, { once: true });
  }
}

function onCellPointerEnter(r: number, c: number) {
  const session = paintSession.value;
  if (!session) return;
  if (!session.didDrag && r === session.startRow && c === session.startCol) return;

  const { targetValue, startRow, startCol } = session;
  const includeStart = !session.didDrag;
  session.didDrag = true;

  emit(
    "update:modelValue",
    buildGrid((ri, ci, cur) => {
      if (ri === r && ci === c) return targetValue;
      if (includeStart && ri === startRow && ci === startCol) return targetValue;
      return cur;
    }),
  );
}

function onCellClick(r: number, c: number) {
  if (paintSession.value?.didDrag) {
    paintSession.value = null;
    return;
  }
  paintSession.value = null;
  toggleCell(r, c);
}

function onCellKeydown(r: number, c: number, e: KeyboardEvent) {
  let nextR = r;
  let nextC = c;
  if (e.key === "ArrowRight") nextC = Math.min(colCount.value - 1, c + 1);
  else if (e.key === "ArrowLeft") nextC = Math.max(0, c - 1);
  else if (e.key === "ArrowDown") nextR = Math.min(rowCount.value - 1, r + 1);
  else if (e.key === "ArrowUp") nextR = Math.max(0, r - 1);
  else return;

  e.preventDefault();
  if (nextR === r && nextC === c) return;
  const target = matrixRoot.value?.querySelector<HTMLButtonElement>(
    `button[data-cell="${nextR}-${nextC}"]`,
  );
  target?.focus();
}

const totalSlots = computed(() => rowCount.value * colCount.value);

const activeSlots = computed(() => {
  let count = 0;
  for (let r = 0; r < rowCount.value; r++) {
    for (let c = 0; c < colCount.value; c++) {
      if (isCellActive(r, c)) count++;
    }
  }
  return count;
});

const ratioPercent = computed(() => {
  if (totalSlots.value === 0) return "0.0";
  return ((activeSlots.value / totalSlots.value) * 100).toFixed(1);
});

const summaryText = computed(
  () => `${activeSlots.value} of ${totalSlots.value} slots active (${ratioPercent.value}%)`,
);

onUnmounted(() => {
  if (globalThis.window) {
    globalThis.window.removeEventListener("pointerup", clearPaintSession);
    globalThis.window.removeEventListener("pointercancel", clearPaintSession);
  }
});
</script>

<template>
  <div ref="matrixRoot" class="tux-schedule-matrix">
    <!-- Presets & Status Header -->
    <div class="tux-schedule-matrix__toolbar">
      <div
        v-if="showPresets"
        class="tux-schedule-matrix__presets"
        role="group"
        aria-label="Schedule presets"
      >
        <button
          type="button"
          class="tux-schedule-matrix__preset min-h-11"
          @click="applyPreset('weekdays-daytime')"
        >
          Weekdays Daytime
        </button>
        <button
          type="button"
          class="tux-schedule-matrix__preset min-h-11"
          @click="applyPreset('all-active')"
        >
          24×7 Active
        </button>
        <button
          type="button"
          class="tux-schedule-matrix__preset min-h-11"
          @click="applyPreset('off-peak')"
        >
          Off-Peak / Nights
        </button>
        <button
          type="button"
          class="tux-schedule-matrix__preset tux-schedule-matrix__preset--clear min-h-11"
          @click="applyPreset('clear')"
        >
          Clear All
        </button>
      </div>

      <div class="tux-schedule-matrix__meta">
        <div class="tux-schedule-matrix__legend" aria-hidden="true">
          <span class="tux-schedule-matrix__legend-item">
            <span class="tux-schedule-matrix__swatch tux-schedule-matrix__swatch--active" />
            <span>{{ activeLabel }}</span>
          </span>
          <span class="tux-schedule-matrix__legend-item">
            <span class="tux-schedule-matrix__swatch tux-schedule-matrix__swatch--inactive" />
            <span>{{ inactiveLabel }}</span>
          </span>
        </div>

        <p
          class="tux-schedule-matrix__summary"
          role="status"
          aria-live="polite"
        >
          {{ summaryText }}
        </p>
      </div>
    </div>

    <!-- Scrollable Matrix Surface -->
    <div class="tux-schedule-matrix__scroll">
      <div
        class="tux-schedule-matrix__grid"
        role="group"
        aria-label="Schedule slot matrix"
        :style="{
          '--tux-matrix-cols': String(colCount),
        }"
      >
        <!-- Top-left corner spacer -->
        <div class="tux-schedule-matrix__corner" aria-hidden="true">
          Day / Time
        </div>

        <!-- Column header toggle buttons -->
        <button
          v-for="(colLabel, c) in colLabels"
          :key="`col-${c}`"
          type="button"
          class="tux-schedule-matrix__col-header min-h-11"
          :class="{ 'tux-schedule-matrix__col-header--all': isColAllActive(c) }"
          :aria-pressed="isColAllActive(c)"
          :aria-label="`${colLabel} — toggle entire time block`"
          @click="toggleCol(c)"
        >
          {{ colLabel }}
        </button>

        <!-- Rows: row-header toggle button + slot cells -->
        <template v-for="(rowLabel, r) in rowLabels" :key="`row-${r}`">
          <button
            type="button"
            class="tux-schedule-matrix__row-header min-h-11"
            :class="{ 'tux-schedule-matrix__row-header--all': isRowAllActive(r) }"
            :aria-pressed="isRowAllActive(r)"
            :aria-label="`${rowLabel} — toggle entire day`"
            @click="toggleRow(r)"
          >
            {{ rowLabel }}
          </button>

          <button
            v-for="(colLabel, c) in colLabels"
            :key="`cell-${r}-${c}`"
            type="button"
            :data-cell="`${r}-${c}`"
            class="tux-schedule-matrix__cell min-h-11"
            :class="isCellActive(r, c)
              ? 'tux-schedule-matrix__cell--active'
              : 'tux-schedule-matrix__cell--inactive'"
            :aria-pressed="isCellActive(r, c)"
            :aria-label="`${rowLabel} ${colLabel}: ${isCellActive(r, c) ? activeLabel : inactiveLabel}`"
            @pointerdown="onCellPointerDown(r, c, $event)"
            @pointerenter="onCellPointerEnter(r, c)"
            @click="onCellClick(r, c)"
            @keydown="onCellKeydown(r, c, $event)"
          >
            <svg
              v-if="isCellActive(r, c)"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="tux-schedule-matrix__check"
              aria-hidden="true"
            >
              <path d="M3.5 8.5l2.8 2.8 6.2-6.4" />
            </svg>
            <span
              v-else
              class="tux-schedule-matrix__dot"
              aria-hidden="true"
            />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-schedule-matrix {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  width: 100%;
  font-family: var(--font-body);
  color: var(--text-primary);
  line-height: 1.5;
  container-type: inline-size;
  container-name: tux-schedule-matrix;
}

.tux-schedule-matrix__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
}

.tux-schedule-matrix__presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-schedule-matrix__preset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: 0 var(--space-12);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}

.tux-schedule-matrix__preset:hover {
  background: var(--wash-brand-8);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.tux-schedule-matrix__preset--clear {
  color: var(--text-secondary);
}

.tux-schedule-matrix__preset:focus-visible,
.tux-schedule-matrix__col-header:focus-visible,
.tux-schedule-matrix__row-header:focus-visible,
.tux-schedule-matrix__cell:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  position: relative;
  z-index: 2;
}

.tux-schedule-matrix__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-16);
  margin-left: auto;
}

.tux-schedule-matrix__legend {
  display: inline-flex;
  align-items: center;
  gap: var(--space-12);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-schedule-matrix__legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.tux-schedule-matrix__swatch {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
}

.tux-schedule-matrix__swatch--active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.tux-schedule-matrix__swatch--inactive {
  background: var(--surface-sunken);
}

.tux-schedule-matrix__summary {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-schedule-matrix__scroll {
  width: 100%;
  overflow-x: auto;
  padding: var(--space-4);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
}

.tux-schedule-matrix__grid {
  --tux-matrix-cols: 8;
  display: grid;
  grid-template-columns: minmax(64px, auto) repeat(var(--tux-matrix-cols), minmax(44px, 1fr));
  gap: var(--space-4);
  min-width: max-content;
}

.tux-schedule-matrix__corner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 44px;
  padding: 0 var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.tux-schedule-matrix__col-header,
.tux-schedule-matrix__row-header {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0 var(--space-8);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}

.tux-schedule-matrix__row-header {
  justify-content: flex-start;
  font-family: var(--font-bold);
  color: var(--text-primary);
}

.tux-schedule-matrix__col-header:hover,
.tux-schedule-matrix__row-header:hover {
  background: var(--wash-brand-8);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.tux-schedule-matrix__col-header--all,
.tux-schedule-matrix__row-header--all {
  background: var(--wash-brand-12);
  border-color: var(--brand-primary);
  color: var(--text-primary);
}

.tux-schedule-matrix__cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

.tux-schedule-matrix__cell--active {
  background: var(--brand-fill);
  border: 1px solid var(--brand-fill);
  color: var(--text-on-brand);
}

.tux-schedule-matrix__cell--active:hover {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-schedule-matrix__cell--inactive {
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  color: var(--text-muted);
}

.tux-schedule-matrix__cell--inactive:hover {
  background: var(--wash-brand-8);
  border-color: var(--brand-primary);
}

.tux-schedule-matrix__check {
  flex-shrink: 0;
}

.tux-schedule-matrix__dot {
  width: 4px;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--surface-border);
}

@container tux-schedule-matrix (max-width: 38rem) {
  .tux-schedule-matrix__meta {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-schedule-matrix__preset,
  .tux-schedule-matrix__col-header,
  .tux-schedule-matrix__row-header,
  .tux-schedule-matrix__cell {
    transition: none;
  }
}
</style>
