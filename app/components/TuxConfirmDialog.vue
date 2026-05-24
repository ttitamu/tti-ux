<script setup lang="ts">
/**
 * TuxConfirmDialog — TuxModal preset for destructive-action
 * confirmation.
 *
 * The "are you sure?" prompt. Wraps TuxModal with a tight default
 * shape (sm size, single body paragraph, two-button footer: Cancel
 * + a primary "destructive" action button). Auto-types the
 * confirm button with `intent="destructive"` when `variant="destructive"`
 * — that's the most common case ("Delete this", "Revoke API key").
 *
 * Pattern recap from the form-validation conventions doc:
 *   - **Inline validation** for per-field issues
 *   - **Validation summary** for whole-form issues at top
 *   - **Blocking dialog** (this) for destructive actions
 *   - **Page banner** / **toast** for system-level signals
 *
 * Two-way bound via `v-model:open`. Emits `confirm` when the
 * primary action is clicked; the consumer is responsible for
 * doing the actual destructive thing.
 */
import { computed } from "vue";

interface Props {
  /** v-model:open */
  open?: boolean;
  /** Dialog title. */
  title: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** Confirm button label. Default depends on variant. */
  confirmLabel?: string;
  /** Cancel button label. Default "Cancel". */
  cancelLabel?: string;
  /** Variant — picks the confirm button intent + default label.
   *  - "destructive" (default) — red button, "Delete"
   *  - "danger"      — same as destructive, alias
   *  - "primary"     — maroon button, "Confirm"
   *  - "warning"     — amber tone, "Proceed"
   */
  variant?: "destructive" | "danger" | "primary" | "warning";
  /** Disable the confirm button (e.g. while a typed-name guard
   *  hasn't matched yet). */
  confirmDisabled?: boolean;
  /** Loading state on the confirm button — useful when the
   *  destructive action is asynchronous. */
  loading?: boolean;
  /** Size — passed through to TuxModal. Default "sm". */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  eyebrow: undefined,
  confirmLabel: undefined,
  cancelLabel: "Cancel",
  variant: "destructive",
  confirmDisabled: false,
  loading: false,
  size: "sm",
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  confirm: [];
  cancel: [];
}>();

// TuxButton's `intent` is `"primary" | "secondary" | "ghost" | "destructive"`.
// The dialog's "warning" variant maps to the primary button intent — the
// warning context is set by the dialog chrome (header tone, icon), not by
// the button. Return type is narrowed to the actual TuxButton intents
// this computed produces.
const confirmIntent = computed<"primary" | "destructive">(() => {
  if (props.variant === "destructive") return "destructive";
  return "primary"; // both "primary" and "warning" variants
});

const defaultConfirmLabel = computed(() => {
  if (props.variant === "primary") return "Confirm";
  if (props.variant === "warning") return "Proceed";
  return "Delete";
});

const finalConfirmLabel = computed(() => props.confirmLabel || defaultConfirmLabel.value);

function onCancel() {
  emit("cancel");
  emit("update:open", false);
}

function onConfirm() {
  if (props.confirmDisabled || props.loading) return;
  emit("confirm");
}

function handleUpdate(value: boolean) {
  if (!value) emit("cancel");
  emit("update:open", value);
}
</script>

<template>
  <TuxModal
    :open="open"
    :title="title"
    :eyebrow="eyebrow"
    :size="size"
    @update:open="handleUpdate"
  >
    <div class="tux-confirm-dialog__body">
      <slot />
    </div>

    <template #footer>
      <div class="tux-confirm-dialog__actions">
        <UButton variant="ghost" :disabled="loading" @click="onCancel">
          {{ cancelLabel }}
        </UButton>
        <TuxButton
          :intent="confirmIntent"
          :disabled="confirmDisabled || loading"
          :loading="loading"
          @click="onConfirm"
        >
          {{ finalConfirmLabel }}
        </TuxButton>
      </div>
    </template>
  </TuxModal>
</template>

<style scoped>
.tux-confirm-dialog__body {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-primary);
}

.tux-confirm-dialog__body :deep(p) {
  margin: 0 0 0.625rem 0;
}

.tux-confirm-dialog__body :deep(p:last-child) {
  margin-bottom: 0;
}

.tux-confirm-dialog__body :deep(code) {
  font-family: var(--font-mono);
  background: var(--surface-sunken);
  padding: 0.0625rem 0.3125rem;
  border-radius: 2px;
  font-size: 0.875em;
}

.tux-confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
