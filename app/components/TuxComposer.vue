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
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Ask about any ingested corpus…",
  models: () => [],
  modelId: undefined,
  maxLength: 32000,
  hint: "⌘↵ send · / corpus to switch context · shift↵ newline",
  hideAttach: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:modelId": [value: string];
  submit: [value: string];
  attach: [];
}>();

const local = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v),
});

const localModel = computed({
  get: () => props.modelId ?? props.models[0]?.value ?? "",
  set: (v: string) => emit("update:modelId", v),
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
  <div class="tux-composer">
    <div v-if="$slots.scope" class="tux-composer__scope">
      <slot name="scope" />
    </div>
    <div class="tux-composer__frame">
      <textarea
        v-model="local"
        class="tux-composer__textarea"
        :placeholder="placeholder"
        :maxlength="maxLength"
        rows="3"
        @keydown="onKey"
      />
      <div class="tux-composer__bar">
        <button
          v-if="!hideAttach"
          type="button"
          class="tux-composer__chip"
          @click="emit('attach')"
        >
          <UIcon name="lucide:plus" class="tux-composer__chip-icon" />
          <span>Attach corpus</span>
        </button>
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
          color="primary"
          icon="lucide:arrow-right"
          :disabled="!local.trim()"
          @click="handleSubmit"
        >
          Send
        </UButton>
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
  max-width: 880px;
  margin: 0 auto 0.875rem;
}

.tux-composer__frame {
  max-width: 880px;
  margin: 0 auto;
  border: 2px solid var(--brand-primary);
  border-radius: var(--radius-lg);
  background: var(--surface-raised);
  overflow: hidden;
  transition: box-shadow var(--motion-fast) var(--ease-standard);
}

.tux-composer__frame:focus-within {
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
</style>
