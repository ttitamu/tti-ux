<script setup lang="ts">
/**
 * TuxSegmentedInput — formatted multi-segment monospace code input
 * for structured reference codes, highway CSJ numbers, roadside sensor IDs,
 * and accounting/grant strings.
 *
 * Enforces per-segment length and character sets, auto-advances focus on fill,
 * steps focus backward on Backspace when empty, and distributes pasted codes
 * cleanly across segments with or without separators.
 */
import { computed, nextTick, ref, useId, watch } from "vue";

export interface CodeSegmentDef {
  key: string;
  label: string;
  length: number;
  charset?: "digits" | "alpha" | "alphanumeric";
  placeholder?: string;
}

interface Props {
  modelValue: string;
  segments: CodeSegmentDef[];
  separator?: string;
  label?: string;
  helpText?: string;
  uppercase?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  separator: "-",
  label: undefined,
  helpText: undefined,
  uppercase: true,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [v: string];
  complete: [v: string];
}>();

const uid = useId();
const groupLabelId = `${uid}-label`;
const helpId = `${uid}-help`;
const statusId = `${uid}-status`;

const inputRefs = ref<Array<HTMLInputElement | null>>([]);

function setInputRef(idx: number, el: unknown) {
  inputRefs.value[idx] = el instanceof HTMLInputElement ? el : null;
}

function isCharAllowed(ch: string, charset: CodeSegmentDef["charset"] = "alphanumeric"): boolean {
  if (charset === "digits") return /^[0-9]$/.test(ch);
  if (charset === "alpha") return /^[a-zA-Z]$/.test(ch);
  return /^[a-zA-Z0-9]$/.test(ch);
}

function sanitizeForSegment(raw: string, seg: CodeSegmentDef): string {
  const charset = seg.charset ?? "alphanumeric";
  let out = "";
  for (const ch of raw) {
    if (out.length >= seg.length) break;
    if (isCharAllowed(ch, charset)) {
      out += props.uppercase ? ch.toUpperCase() : ch;
    }
  }
  return out;
}

function parseModelValue(raw: string): string[] {
  if (!raw) {
    return props.segments.map(() => "");
  }
  if (props.separator.length > 0) {
    const parts = raw.split(props.separator);
    return props.segments.map((seg, i) => sanitizeForSegment(parts[i] ?? "", seg));
  }
  let cursor = 0;
  return props.segments.map((seg) => {
    const slice = raw.slice(cursor, cursor + seg.length);
    cursor += seg.length;
    return sanitizeForSegment(slice, seg);
  });
}

const localValues = ref<string[]>(parseModelValue(props.modelValue));

watch(
  () => [props.modelValue, props.segments, props.separator, props.uppercase] as const,
  () => {
    localValues.value = parseModelValue(props.modelValue);
  },
);

function joinSegments(vals: string[]): string {
  let lastNonEmpty = -1;
  for (let i = vals.length - 1; i >= 0; i--) {
    if ((vals[i] ?? "").length > 0) {
      lastNonEmpty = i;
      break;
    }
  }
  if (lastNonEmpty === -1) return "";
  return vals.slice(0, lastNonEmpty + 1).join(props.separator);
}

function isAllComplete(vals: string[]): boolean {
  return (
    props.segments.length > 0 &&
    props.segments.every((seg, i) => (vals[i] ?? "").length === seg.length)
  );
}

const totalRequiredChars = computed(() =>
  props.segments.reduce((sum, s) => sum + s.length, 0),
);

const filledChars = computed(() =>
  localValues.value.reduce((sum, v) => sum + v.length, 0),
);

const isComplete = computed(() => isAllComplete(localValues.value));

const validityStatusText = computed(() => {
  if (isComplete.value) {
    return `Complete · ${filledChars.value}/${totalRequiredChars.value}`;
  }
  if (filledChars.value === 0) {
    return `Empty · 0/${totalRequiredChars.value}`;
  }
  return `Incomplete · ${filledChars.value}/${totalRequiredChars.value}`;
});

function defaultPlaceholder(seg: CodeSegmentDef): string {
  if (seg.placeholder) return seg.placeholder;
  const ch = seg.charset === "digits" ? "0" : seg.charset === "alpha" ? "A" : "X";
  return ch.repeat(seg.length);
}

function commitValues(nextVals: string[], focusIdx?: number) {
  localValues.value = nextVals;
  const joined = joinSegments(nextVals);
  emit("update:modelValue", joined);
  if (isAllComplete(nextVals)) {
    emit("complete", joined);
  }
  if (focusIdx !== undefined && focusIdx >= 0 && focusIdx < props.segments.length) {
    nextTick(() => {
      inputRefs.value[focusIdx]?.focus();
    });
  }
}

function distributeStream(rawStream: string, startIdx: number): { vals: string[]; focusTarget: number } {
  const nextVals = [...localValues.value];
  let cursor = 0;
  let lastTouched = startIdx;

  for (let sIdx = startIdx; sIdx < props.segments.length; sIdx++) {
    const seg = props.segments[sIdx];
    if (!seg) continue;
    let bucket = "";
    while (cursor < rawStream.length && bucket.length < seg.length) {
      const ch = rawStream[cursor] ?? "";
      cursor++;
      if (isCharAllowed(ch, seg.charset ?? "alphanumeric")) {
        bucket += props.uppercase ? ch.toUpperCase() : ch;
      }
    }
    if (bucket.length > 0 || sIdx === startIdx) {
      nextVals[sIdx] = bucket;
      lastTouched = sIdx;
    }
    if (cursor >= rawStream.length) break;
  }

  const firstIncomplete = props.segments.findIndex(
    (seg, idx) => idx >= startIdx && (nextVals[idx] ?? "").length < seg.length,
  );
  const focusTarget = firstIncomplete !== -1 ? firstIncomplete : lastTouched;
  return { vals: nextVals, focusTarget };
}

function onSegmentInput(idx: number, event: Event) {
  const target = event.target as HTMLInputElement;
  const raw = target.value;
  const seg = props.segments[idx];
  if (!seg) return;

  if (props.separator.length > 0 && raw.includes(props.separator)) {
    const parts = raw.split(props.separator);
    const startIdx = parts.length === props.segments.length ? 0 : idx;
    const nextVals = [...localValues.value];
    let lastIdx = startIdx;
    for (let i = 0; i < parts.length && startIdx + i < props.segments.length; i++) {
      const targetSeg = props.segments[startIdx + i];
      if (!targetSeg) continue;
      nextVals[startIdx + i] = sanitizeForSegment(parts[i] ?? "", targetSeg);
      lastIdx = startIdx + i;
    }
    target.value = nextVals[idx] ?? "";
    const nextFocus =
      (nextVals[lastIdx] ?? "").length === (props.segments[lastIdx]?.length ?? 0) &&
      lastIdx + 1 < props.segments.length
        ? lastIdx + 1
        : lastIdx;
    commitValues(nextVals, nextFocus);
    return;
  }

  const cleaned = sanitizeForSegment(raw, seg);
  target.value = cleaned;

  const nextVals = [...localValues.value];
  nextVals[idx] = cleaned;

  const shouldAdvance = cleaned.length === seg.length && idx + 1 < props.segments.length;
  commitValues(nextVals, shouldAdvance ? idx + 1 : undefined);
}

function onSegmentKeydown(idx: number, event: KeyboardEvent) {
  const current = localValues.value[idx] ?? "";
  if (event.key === "Backspace" && current.length === 0 && idx > 0) {
    event.preventDefault();
    const prevEl = inputRefs.value[idx - 1];
    if (prevEl) {
      prevEl.focus();
      const len = prevEl.value.length;
      prevEl.setSelectionRange(len, len);
    }
    return;
  }

  const target = event.target as HTMLInputElement;
  if (event.key === "ArrowLeft" && target.selectionStart === 0 && idx > 0) {
    event.preventDefault();
    inputRefs.value[idx - 1]?.focus();
  } else if (
    event.key === "ArrowRight" &&
    target.selectionStart === current.length &&
    idx + 1 < props.segments.length
  ) {
    event.preventDefault();
    inputRefs.value[idx + 1]?.focus();
  }
}

function onSegmentPaste(idx: number, event: ClipboardEvent) {
  const pasted = event.clipboardData?.getData("text") ?? "";
  if (!pasted) return;
  event.preventDefault();

  if (props.separator.length > 0 && pasted.includes(props.separator)) {
    const parts = pasted.trim().split(props.separator);
    const startIdx = parts.length === props.segments.length ? 0 : idx;
    const nextVals = [...localValues.value];
    let lastFilled = startIdx;
    for (let i = 0; i < parts.length && startIdx + i < props.segments.length; i++) {
      const targetSeg = props.segments[startIdx + i];
      if (!targetSeg) continue;
      nextVals[startIdx + i] = sanitizeForSegment(parts[i] ?? "", targetSeg);
      lastFilled = startIdx + i;
    }
    const firstIncomplete = props.segments.findIndex(
      (seg, sIdx) => sIdx >= startIdx && (nextVals[sIdx] ?? "").length < seg.length,
    );
    commitValues(nextVals, firstIncomplete !== -1 ? firstIncomplete : lastFilled);
    return;
  }

  const stripped = pasted.replace(/[\s\-_/:.]+/g, "");
  const startIdx = stripped.length >= totalRequiredChars.value ? 0 : idx;
  const { vals, focusTarget } = distributeStream(stripped, startIdx);
  commitValues(vals, focusTarget);
}

const describedByIds = computed(() =>
  props.helpText ? `${helpId} ${statusId}` : statusId,
);
</script>

<template>
  <div
    class="tux-segmented-input"
    :class="{ 'tux-segmented-input--disabled': disabled }"
    role="group"
    :aria-labelledby="label ? groupLabelId : undefined"
    :aria-describedby="describedByIds"
  >
    <div class="tux-segmented-input__header">
      <span v-if="label" :id="groupLabelId" class="tux-segmented-input__label">
        {{ label }}
      </span>
      <span
        :id="statusId"
        class="tux-segmented-input__status"
        :class="{
          'tux-segmented-input__status--complete': isComplete,
          'tux-segmented-input__status--partial': !isComplete && filledChars > 0,
        }"
        role="status"
        aria-live="polite"
      >
        {{ validityStatusText }}
      </span>
    </div>

    <div class="tux-segmented-input__track">
      <template v-for="(seg, idx) in segments" :key="seg.key">
        <div class="tux-segmented-input__segment">
          <input
            :id="`${uid}-seg-${seg.key}`"
            :ref="(el) => setInputRef(idx, el)"
            type="text"
            class="tux-segmented-input__box"
            :class="{
              'tux-segmented-input__box--filled': (localValues[idx] ?? '').length === seg.length,
            }"
            :style="{ '--tux-seg-ch': String(Math.max(seg.length, 2)) }"
            :value="localValues[idx] ?? ''"
            :maxlength="seg.length"
            :placeholder="defaultPlaceholder(seg)"
            :inputmode="seg.charset === 'digits' ? 'numeric' : 'text'"
            :disabled="disabled"
            autocomplete="off"
            spellcheck="false"
            @input="onSegmentInput(idx, $event)"
            @keydown="onSegmentKeydown(idx, $event)"
            @paste="onSegmentPaste(idx, $event)"
          >
          <label
            :for="`${uid}-seg-${seg.key}`"
            class="tux-segmented-input__seg-label"
          >
            {{ seg.label }}
          </label>
        </div>

        <span
          v-if="separator && idx < segments.length - 1"
          class="tux-segmented-input__sep"
          aria-hidden="true"
        >
          {{ separator }}
        </span>
      </template>
    </div>

    <p v-if="helpText" :id="helpId" class="tux-segmented-input__help">
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
.tux-segmented-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  color: var(--text-primary);
  container-type: inline-size;
}

.tux-segmented-input--disabled {
  opacity: 0.65;
}

.tux-segmented-input__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-segmented-input__label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-segmented-input__status {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-10);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
}

.tux-segmented-input__status--complete {
  color: var(--status-ok-ink);
  background: var(--status-ok-fill);
  border-color: var(--status-ok);
}

.tux-segmented-input__status--partial {
  color: var(--status-warning-ink);
  background: var(--status-warning-fill);
  border-color: var(--status-warning);
}

.tux-segmented-input__track {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-segmented-input__segment {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}

.tux-segmented-input__box {
  min-height: 44px;
  min-width: 44px;
  width: calc(var(--tux-seg-ch, 4) * 1ch + 1.75rem);
  padding: var(--space-8) var(--space-10);
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  text-align: center;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-segmented-input__box::placeholder {
  color: var(--text-muted);
  opacity: 0.55;
}

.tux-segmented-input__box--filled {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-segmented-input__box:disabled {
  background: var(--surface-sunken);
  cursor: not-allowed;
}

.tux-segmented-input__box:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-segmented-input__seg-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.tux-segmented-input__sep {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tux-segmented-input__help {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 72ch;
}

@container (max-width: 24rem) {
  .tux-segmented-input__sep {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-segmented-input__box {
    transition: none;
  }
}
</style>
