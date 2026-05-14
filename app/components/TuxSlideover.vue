<script setup lang="ts">
// TuxSlideover — edge-anchored drawer panel.
//
// Distinct from TuxModal: a TuxModal is centered and demands attention;
// a TuxSlideover slides in from a viewport edge and preserves the
// reading context behind the scrim. Use for row detail (click a
// TuxRichDataGrid row → slide in field metadata), filter panels (the
// "Filter" button reveals a right-edge sheet on /forms/all-in-one), and
// any flow where the user is "drilling into" a record without leaving
// the surface.
//
// Built on the native `<dialog>` element so focus trap, escape, scrim
// rendering, and ARIA semantics come from the platform. The slide
// animation rides Batch J's `--ease-corridor` curve (the same curve
// applied to anchored disclosure surfaces via `data-tux-overlay`).
//
// Usage:
//   <TuxSlideover v-model="open" title="Field details" side="right">
//     …body content…
//     <template #footer>
//       <TuxButton intent="primary">Save</TuxButton>
//       <TuxButton intent="ghost" @click="open = false">Cancel</TuxButton>
//     </template>
//   </TuxSlideover>

interface Props {
  /** Anchored edge. Defaults to right (the usual posture for row detail). */
  side?: "left" | "right" | "bottom";
  /** Sheet width on left/right (or height on bottom). CSS length. */
  size?: string;
  /** Header title — shown with an eyebrow above. Omit to use the `#header` slot. */
  title?: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** Render a close button in the top-right of the header. Defaults `true`. */
  showClose?: boolean;
  /** Close when the scrim is clicked. Defaults `true`. */
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  side: "right",
  size: undefined,
  title: undefined,
  eyebrow: undefined,
  showClose: true,
  closeOnBackdrop: true,
});

const open = defineModel<boolean>({ default: false });

const dialogRef = ref<HTMLDialogElement | null>(null);

watch(open, (val) => {
  if (val) {
    dialogRef.value?.showModal();
  } else {
    dialogRef.value?.close();
  }
});

// `dialog.close()` fires the `close` event; mirror it back to the
// v-model so external state stays in sync when the user dismisses
// via Escape or the close button.
function onDialogClose() {
  if (open.value) open.value = false;
}

function close() {
  open.value = false;
}

function onBackdropClick(e: MouseEvent) {
  if (!props.closeOnBackdrop) return;
  if (e.target === dialogRef.value) close();
}

// Default size depends on the side: 28rem for left/right (about 448px,
// roomy enough for a row-detail panel), 24rem for bottom (388px tall —
// enough for a filter strip + actions).
const resolvedSize = computed(() => {
  if (props.size) return props.size;
  return props.side === "bottom" ? "24rem" : "28rem";
});

// Slide direction: from the chosen edge into the viewport. The closed
// state keeps the sheet translated off-screen so opening animates in
// rather than fading. CSS uses the resolved side to apply the right
// transform.
const sideClass = computed(() => `tux-slideover--${props.side}`);

defineExpose({ open: () => { open.value = true; }, close });
</script>

<template>
  <dialog
    ref="dialogRef"
    class="tux-slideover"
    :class="sideClass"
    data-tux-overlay
    :aria-label="title || 'Slide-over panel'"
    @close="onDialogClose"
    @click="onBackdropClick"
  >
    <div
      class="tux-slideover__panel"
      :style="{
        width: side !== 'bottom' ? resolvedSize : undefined,
        height: side === 'bottom' ? resolvedSize : undefined,
      }"
      data-tux-elevation="overlay"
    >
      <header
        v-if="title || eyebrow || $slots.header"
        class="tux-slideover__header"
      >
        <div class="tux-slideover__title-block">
          <slot name="header">
            <p v-if="eyebrow" class="eyebrow tux-slideover__eyebrow">{{ eyebrow }}</p>
            <h2 v-if="title" class="heading--bold tux-slideover__title">{{ title }}</h2>
          </slot>
        </div>
        <button
          v-if="showClose"
          type="button"
          class="tux-slideover__close"
          aria-label="Close panel"
          @click="close"
        >
          <Icon name="lucide:x" aria-hidden="true" />
        </button>
      </header>

      <div class="tux-slideover__body">
        <slot />
      </div>

      <footer
        v-if="$slots.footer"
        class="tux-slideover__footer"
      >
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
/* Reset the native dialog frame — we paint the panel ourselves so the
   slide-in transform applies cleanly. The dialog itself fills the
   viewport so the scrim covers everything; the inner __panel does the
   sizing + positioning. */
.tux-slideover {
  padding: 0;
  border: 0;
  margin: 0;
  background: transparent;
  /* Fill the viewport so the panel can be edge-anchored within it. */
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: visible;
}

.tux-slideover::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

/* Panel positioning — anchored to the chosen edge. */
.tux-slideover__panel {
  position: fixed;
  background: var(--surface-raised);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  /* The data-tux-elevation="overlay" attribute (Batch J) supplies the
     shadow, so we don't double-declare. The border edge varies per
     side to keep the panel reading as anchored to its edge. */
}

.tux-slideover--right .tux-slideover__panel {
  top: 0;
  right: 0;
  bottom: 0;
  max-height: 100vh;
  border-right: 0;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.tux-slideover--left .tux-slideover__panel {
  top: 0;
  left: 0;
  bottom: 0;
  max-height: 100vh;
  border-left: 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.tux-slideover--bottom .tux-slideover__panel {
  left: 0;
  right: 0;
  bottom: 0;
  width: 100% !important;
  max-width: 100vw;
  border-bottom: 0;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

/* Header — eyebrow + title + close. */
.tux-slideover__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  flex-shrink: 0;
}

.tux-slideover__title-block {
  flex: 1;
  min-width: 0;
}

.tux-slideover__eyebrow {
  margin: 0 0 0.25rem;
}

.tux-slideover__title {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
}

.tux-slideover__close {
  background: transparent;
  border: 0;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.tux-slideover__close:hover {
  color: var(--text-primary);
  background: var(--surface-sunken);
}

/* Body — scrolls; everything else stays pinned. */
.tux-slideover__body {
  padding: 1rem 1.25rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Footer — actions row. Sits at the bottom regardless of body length. */
.tux-slideover__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  flex-shrink: 0;
}

/* Slide-in animation when the dialog opens. <dialog> uses the
   `[open]` attribute when shown via showModal(); we transition the
   transform from offscreen to onscreen with the corridor curve. */
.tux-slideover[open] .tux-slideover__panel {
  animation: tux-slideover-in var(--motion-base) var(--ease-corridor, var(--ease-standard));
}

@keyframes tux-slideover-in {
  from {
    transform: var(--tux-slideover-from);
    opacity: 0.6;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

.tux-slideover--right { --tux-slideover-from: translateX(100%); }
.tux-slideover--left  { --tux-slideover-from: translateX(-100%); }
.tux-slideover--bottom { --tux-slideover-from: translateY(100%); }

/* Honour reduced-motion: skip the slide, just appear. */
@media (prefers-reduced-motion: reduce) {
  .tux-slideover[open] .tux-slideover__panel {
    animation: none;
  }
}
</style>
