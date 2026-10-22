<script setup lang="ts">
/**
 * TuxComposer — chat input with optional compliance scope banner.
 *
 * Two-zone layout: a textarea on top, a toolbar strip below
 * (corpus attach · model picker · char count · send). A maroon
 * 2px frame ties the whole composer back to the brand's primary
 * color. Use `complianceScope` (string) or the `#scope` slot to
 * inject a scope warning above the input — typically a TuxAlert
 * with `variant="compliance"`.
 *
 * v-model binds the textarea value. Emits `submit` on send so
 * the host app can route to its own dispatcher (the composer
 * is presentational; it doesn't know about networking).
 */
interface Model {
  value: string;
  label: string;
}

interface Props {
  modelValue?: string;
  placeholder?: string;
  models?: Model[];
  modelId?: string;
  maxLength?: number;
  hint?: string;
  hideAttach?: boolean;
  /** Label for the attach chip in the toolbar. Default speaks to the
   *  corpus-attach use case; consumer apps that wire `@attach` to a
   *  different action (image picker, MCP picker) override this so the
   *  label matches the actual behavior. */
  attachLabel?: string;
  /** Icon name (Iconify, e.g. `lucide:plus`, `lucide:image-plus`,
   *  `lucide:paperclip`) shown to the left of `attachLabel`. */
  attachIcon?: string;
  /** When true, render a secondary [Cancel] button next to [Send] and
   *  emit `@cancel` on click. Use when the composer is wrapped inside
   *  a modal / slideover / inline edit surface where the user needs
   *  an explicit way to back out without sending. The send button
   *  stays primary; cancel sits to its left as ghost-intent. */
  cancelable?: boolean;
  /** Label for the Cancel button. Defaults to `"Cancel"`; override
   *  for editorial surfaces ("Discard", "Close without sending", etc.). */
  cancelLabel?: string;
  /** Number of rows for the textarea, defaults to 2. */
  rows?: number | string;
  /** Visual presentation mode. 'floating' strips the heavy outer padding and border-top for floating/docked prompt inputs. */
  variant?: "default" | "floating" | "compact";
  /** Automatically focus the textarea on mount. */
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Ask about any ingested corpus…",
  models: () => [],
  modelId: undefined,
  maxLength: 32000,
  hint: "⌘↵ send · / corpus to switch context · shift↵ newline",
  hideAttach: false,
  attachLabel: "Attach corpus",
  attachIcon: "lucide:plus",
  cancelable: false,
  cancelLabel: "Cancel",
  rows: 2,
  variant: "default",
  autofocus: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:modelId": [value: string];
  submit: [value: string];
  attach: [];
  cancel: [];
}>();

const local = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v),
});

const localModel = computed({
  get: () => props.modelId ?? props.models[0]?.value ?? "",
  set: (v: string) => emit("update:modelId", v),
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);

function resizeTextarea() {
  const el = textareaRef.value;
  if (!el) return;
  if (!local.value) {
    el.style.height = "";
    return;
  }
  el.style.height = "0px";
  const newHeight = Math.min(Math.max(el.scrollHeight, 28), 160);
  el.style.height = `${newHeight}px`;
}

function handleInput() {
  resizeTextarea();
}

watch(local, () => {
  nextTick(() => resizeTextarea());
});

onMounted(() => {
  nextTick(() => {
    resizeTextarea();
    if (props.autofocus) {
      textareaRef.value?.focus();
    }
  });
});

function handleSubmit() {
  if (!local.value.trim()) return;
  emit("submit", local.value);
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    handleSubmit();
  }
}
</script>

<template>
  <div class="tux-composer" :class="['tux-composer--' + variant]">
    <div v-if="$slots.scope" class="tux-composer__scope">
      <slot name="scope" />
    </div>
    <div class="tux-composer__glow-wrap">
      <div class="tux-composer__frame">
        <textarea
          ref="textareaRef"
          v-model="local"
          class="tux-composer__textarea"
          :placeholder="placeholder"
          :aria-label="placeholder || 'Message composer'"
          :maxlength="maxLength"
          :rows="rows"
          :autofocus="autofocus"
          @input="handleInput"
          @keydown="onKey"
        />
        <div class="tux-composer__bar">
          <button
            v-if="!hideAttach"
            type="button"
            class="tux-composer__chip"
            @click="emit('attach')"
          >
            <UIcon :name="attachIcon" class="tux-composer__chip-icon" />
            <span>{{ attachLabel }}</span>
          </button>
          <!-- Consumer-supplied toolbar items (mic button, file-type picker,
               etc.) sit immediately after the built-in attach affordance.
               Slot is unstyled — let the consumer pass through `tux-composer__chip`
               on its buttons to match the existing visual rhythm, or style
               from scratch for distinct treatments. -->
          <slot name="toolbar-extra" />
          <select
            v-if="models.length"
            v-model="localModel"
            class="tux-composer__model"
            aria-label="Model"
          >
            <option v-for="m in models" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
          <div class="tux-composer__spacer" />
          <span class="tux-composer__count">{{ local.length }} / {{ maxLength }}</span>
          <UButton
            v-if="cancelable"
            color="neutral"
            variant="ghost"
            class="tux-composer__cancel"
            @click="emit('cancel')"
          >
            {{ cancelLabel }}
          </UButton>
          <UButton
            color="primary"
            icon="lucide:arrow-right"
            class="tux-composer__send"
            :disabled="!local.trim()"
            @click="handleSubmit"
          >
            Send
          </UButton>
        </div>
      </div>
    </div>
    <p v-if="hint" class="tux-composer__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.tux-composer {
  padding: 1rem 2rem 1.5rem;
  background: var(--surface-raised);
  border-top: 1px solid var(--surface-border);
}

.tux-composer__scope {
  max-width: var(--tux-composer-measure, 880px);
  margin: 0 auto 0.875rem;
}

.tux-composer__frame {
  /* Measure overridable by hosts (see TuxChatMessage's
   * --tux-chat-measure) so the composer tracks the transcript column. */
  max-width: var(--tux-composer-measure, 880px);
  margin: 0 auto;
  border: 2px solid var(--brand-primary);
  border-radius: var(--radius-lg);
  background: var(--surface-raised);
  overflow: hidden;
  /* Border-color transitions together with the focus shadow so the
     branded chrome resolves into the focus ring without a flash. */
  transition:
    box-shadow var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
}

/* On focus, the always-on brand border would compound with the two-ring
   focus shadow into a triple-stack ("brand border + inner halo + outer
   brand ring"). Fade the border to transparent so the focus ring stands
   alone — the ring's outer color is already --brand-primary, so the
   focused state still reads as brand emphasis, just without the doubling.
   border-color: transparent keeps the 2px box geometry so the layout
   doesn't jitter. */
.tux-composer__frame:focus-within {
  border-color: transparent;
  box-shadow: var(--shadow-focus);
}

.tux-composer__textarea {
  width: 100%;
  border: 0;
  outline: none;
  resize: none;
  padding: 0.875rem 1rem;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--text-primary);
  background: transparent;
  box-sizing: border-box;
}

.tux-composer__textarea:focus,
.tux-composer__textarea:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.tux-composer__bar {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tux-composer__chip,
.tux-composer__model {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.tux-composer__chip {
  font-family: inherit;
  background: transparent;
}

.tux-composer__chip-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.tux-composer__spacer {
  flex: 1;
}

.tux-composer__count {
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.tux-composer__hint {
  margin: 0.625rem 0 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* Floating variant: sleek prompt card with soft animated TTI color band glow */
.tux-composer--floating {
  --composer-spacing: 6px;
  --composer-glow-padding: 1px;
  --composer-frame-radius: var(--radius-lg, 8px);
  --composer-outer-radius: calc(var(--composer-frame-radius) + var(--composer-glow-padding)); /* 9px */
  /* Concentric formula: 8px frame - 6px uniform spacing = 2px button radius (var(--radius-sm)) */
  --composer-btn-radius: calc(var(--composer-frame-radius) - var(--composer-spacing)); /* 2px */
  padding: 0;
  background: transparent;
  border-top: none;
  width: 100%;
}

.tux-composer--floating .tux-composer__scope {
  max-width: 100%;
  margin: 0 0 0.25rem 0.25rem;
}

.tux-composer:not(.tux-composer--floating) .tux-composer__glow-wrap {
  display: contents;
}

.tux-composer--floating .tux-composer__glow-wrap {
  position: relative;
  width: 100%;
  border-radius: var(--composer-outer-radius, 9px);
  padding: var(--composer-glow-padding, 1px);
  background: color-mix(in srgb, var(--surface-border) 70%, transparent);
  box-shadow: var(--shadow-sm);
  transition:
    background var(--motion-standard, 0.25s) ease,
    box-shadow var(--motion-standard, 0.25s) ease;
}

/* Soft ambient glow using the TTI color band — inactive at rest, only active on focus */
.tux-composer--floating .tux-composer__glow-wrap::before {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  background: linear-gradient(
    115deg,
    var(--brand-primary) 0%,
    var(--brand-accent) 40%,
    var(--brand-secondary, #4A8892) 75%,
    var(--brand-primary) 100%
  );
  background-size: 250% 250%;
  filter: blur(10px);
  opacity: 0;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

/* Highlight glowy ring only active when clicked into the box */
.tux-composer--floating .tux-composer__glow-wrap:focus-within {
  background: linear-gradient(
    115deg,
    var(--brand-primary) 0%,
    var(--brand-accent) 40%,
    var(--brand-secondary, #4A8892) 75%,
    var(--brand-primary) 100%
  );
  background-size: 250% 250%;
  animation: tti-color-band-flow 6s ease infinite;
  box-shadow: var(--shadow-lg);
}

.tux-composer--floating .tux-composer__glow-wrap:focus-within::before {
  opacity: 0.55;
  animation: tti-color-band-flow 6s ease infinite;
}

.tux-composer--floating .tux-composer__frame {
  position: relative;
  z-index: 1;
  max-width: 100%;
  width: 100%;
  border: none;
  border-radius: var(--composer-frame-radius, 8px);
  background: var(--surface-raised);
  overflow: hidden;
  box-shadow: none;
}

.tux-composer--floating .tux-composer__frame:focus-within {
  border-color: transparent;
  box-shadow: none;
}

/* Thin single-line initial input that dynamically expands per line */
.tux-composer--floating .tux-composer__textarea {
  display: block;
  width: 100%;
  height: 28px;
  min-height: 28px;
  max-height: 140px;
  padding: var(--composer-spacing, 6px) 10px 4px 10px;
  font-size: 0.84rem;
  line-height: 1.35;
  box-sizing: border-box;
  overflow-y: auto;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.tux-composer--floating .tux-composer__textarea:focus,
.tux-composer--floating .tux-composer__textarea:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* Slim, seamless bottom toolbar with strictly uniform inter-button and edge spacing */
.tux-composer--floating .tux-composer__bar {
  display: flex;
  align-items: center;
  padding: 0 var(--composer-spacing, 6px) var(--composer-spacing, 6px) var(--composer-spacing, 6px);
  gap: var(--composer-spacing, 6px);
  border-top: none !important;
  background: transparent;
}

.tux-composer--floating .tux-composer__chip,
.tux-composer--floating .tux-composer__model {
  padding: 0 0.55rem;
  font-size: 0.68rem;
  line-height: 1.2;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  border-radius: var(--composer-btn-radius, 2px) !important;
  background: color-mix(in srgb, var(--surface-sunken) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--surface-border) 60%, transparent);
}

.tux-composer--floating .tux-composer__count {
  font-size: 0.65rem;
  opacity: 0.7;
  line-height: 1.5rem;
}

.tux-composer--floating .tux-composer__send {
  height: 1.5rem;
  min-height: unset;
  padding: 0 0.65rem;
  font-size: 0.7rem;
  display: inline-flex;
  align-items: center;
  border-radius: var(--composer-btn-radius, 2px) !important;
}

.tux-composer--floating .tux-composer__cancel {
  height: 1.5rem;
  min-height: unset;
  border-radius: var(--composer-btn-radius, 2px) !important;
}

.tux-composer--floating .tux-composer__hint {
  display: none;
}

@keyframes tti-color-band-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-composer--floating .tux-composer__glow-wrap::before,
  .tux-composer--floating .tux-composer__glow-wrap:focus-within {
    animation: none;
  }
}

.tux-composer--compact .tux-composer__textarea {
  min-height: 36px;
  padding: 0.4rem 0.75rem;
}
</style>
