<script setup lang="ts">
// TuxSignupFeature — newsletter signup block.
//
// Heading + dek + bordered email input + uppercase action button +
// consent line. Self-contained — no other components composed in.
// Right for footer-of-page CTA on marketing surfaces ("Subscribe to
// the quarterly bulletin").
//
// v-modeled email value, fires `submit` event with the trimmed value.
// Consent line is a fixed convention: "We never share your address.
// Unsubscribe in one click." — overridable via the `consent` prop.

interface Props {
  /** Heading. Required. */
  title: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** 1–2 sentence description. */
  dek?: string;
  /** Action button label. */
  actionLabel?: string;
  /** Email input placeholder. */
  placeholder?: string;
  /** Consent / privacy line below the form. */
  consent?: string;
  /** v-model: email input value. */
  modelValue?: string;
  /** Background tone. */
  tone?: "neutral" | "maroon" | "gold";
  /** Style variant — affects heading face. */
  variant?: "default" | "bold" | "elegant";
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  dek: undefined,
  actionLabel: "Subscribe",
  placeholder: "your@email.edu",
  consent: "We never share your address. Unsubscribe in one click.",
  modelValue: "",
  tone: "neutral",
  variant: "default",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  submit: [value: string];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v),
});

function onSubmit(e: Event) {
  e.preventDefault();
  const value = localValue.value.trim();
  if (!value) return;
  emit("submit", value);
}

const headingClass = computed(() => {
  if (props.variant === "bold")    return "heading--bold";
  if (props.variant === "elegant") return "heading--elegant heading--elegant--italic";
  return "heading--display";
});
</script>

<template>
  <section
    class="tux-signup"
    :class="[
      `tux-signup--${tone}`,
      `tux-signup--${variant}`,
    ]"
  >
    <div class="tux-signup__copy">
      <p v-if="eyebrow" class="tux-signup__eyebrow">{{ eyebrow }}</p>
      <h2 :class="['tux-signup__title', headingClass]">{{ title }}</h2>
      <p v-if="dek" class="tux-signup__dek">{{ dek }}</p>
    </div>

    <form class="tux-signup__form" @submit="onSubmit">
      <div class="tux-signup__input-row">
        <input
          v-model="localValue"
          type="email"
          :placeholder="placeholder"
          required
          class="tux-signup__input"
          autocomplete="email"
        >
        <button type="submit" class="tux-signup__action">
          {{ actionLabel }}
        </button>
      </div>
      <p class="tux-signup__consent">{{ consent }}</p>
    </form>
  </section>
</template>

<style scoped>
.tux-signup {
  container-type: inline-size;
  container-name: tux-signup;
  display: grid;
  gap: 2rem;
  padding: 2rem 2rem;
  border-radius: var(--radius-md);
}

@container tux-signup (min-width: 44rem) {
  .tux-signup {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
    padding: 2.5rem 2.75rem;
  }
}

/* Tones */
.tux-signup--neutral {
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-signup--maroon {
  background: var(--brand-primary);
  color: #fff;
}

.tux-signup--gold {
  background: var(--brand-accent);
  color: #2A0E15;
}

/* Copy */
.tux-signup__eyebrow {
  margin: 0 0 0.875rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.tux-signup--neutral .tux-signup__eyebrow { color: var(--brand-primary); }
.tux-signup--maroon .tux-signup__eyebrow  { color: rgba(255, 255, 255, 0.72); }
.tux-signup--gold .tux-signup__eyebrow    { color: rgba(42, 14, 21, 0.72); }

.tux-signup__title {
  margin: 0;
  font-size: clamp(1.5rem, 1rem + 2.5cqi, 2.25rem);
  line-height: 1.1;
}

.tux-signup--maroon .tux-signup__title :deep(*),
.tux-signup--maroon .tux-signup__title { color: #fff; }

.tux-signup--gold .tux-signup__title :deep(*),
.tux-signup--gold .tux-signup__title { color: #2A0E15; }

.tux-signup__dek {
  margin: 1rem 0 0;
  font-family: var(--font-body);
  font-size: 0.96875rem;
  line-height: 1.6;
  max-width: 28rem;
}

.tux-signup--neutral .tux-signup__dek { color: var(--text-secondary); }
.tux-signup--maroon .tux-signup__dek  { color: rgba(255, 255, 255, 0.85); }
.tux-signup--gold .tux-signup__dek    { color: rgba(42, 14, 21, 0.85); }

/* Form */
.tux-signup__form {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.tux-signup__input-row {
  display: flex;
  align-items: stretch;
  border: 2px solid currentColor;
  background: var(--surface-page);
  height: 3.125rem;
}

.tux-signup--maroon .tux-signup__input-row {
  background: rgba(0, 0, 0, 0.18);
  border-color: rgba(255, 255, 255, 0.9);
}

.tux-signup--gold .tux-signup__input-row {
  background: rgba(255, 255, 255, 0.18);
  border-color: #2A0E15;
}

.tux-signup__input {
  flex: 1;
  min-width: 0;
  padding: 0 0.875rem;
  font-family: var(--font-bold);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  outline: 0;
}

.tux-signup--maroon .tux-signup__input { color: #fff; }
.tux-signup--gold .tux-signup__input   { color: #2A0E15; }

.tux-signup__input::placeholder {
  font-style: italic;
  font-weight: 500;
  color: var(--text-muted);
}

.tux-signup--maroon .tux-signup__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.tux-signup__action {
  flex-shrink: 0;
  padding: 0 1.25rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--brand-primary);
  color: #fff;
  border: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.tux-signup__action:hover,
.tux-signup__action:focus-visible {
  background: var(--brand-primary-deep);
  outline: none;
}

.tux-signup--maroon .tux-signup__action {
  background: var(--brand-accent);
  color: #2A0E15;
}
.tux-signup--maroon .tux-signup__action:hover,
.tux-signup--maroon .tux-signup__action:focus-visible {
  background: var(--brand-accent-deep);
}

.tux-signup--gold .tux-signup__action {
  background: #2A0E15;
  color: var(--brand-accent);
}

/* Consent */
.tux-signup__consent {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.75rem;
  line-height: 1.5;
}

.tux-signup--neutral .tux-signup__consent { color: var(--text-muted); }
.tux-signup--maroon .tux-signup__consent  { color: rgba(255, 255, 255, 0.72); }
.tux-signup--gold .tux-signup__consent    { color: rgba(42, 14, 21, 0.72); }
</style>
