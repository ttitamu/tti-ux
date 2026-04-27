<script setup lang="ts">
useHead({ title: "TuxSignupFeature · tti-ux" });

const email = ref("");
const lastSubmitted = ref<string | null>(null);

const exampleVue = `<TuxSignupFeature
  v-model="email"
  eyebrow="stay current"
  title="Quarterly research bulletin, in your inbox"
  dek="Three-paragraph summaries of our most-read reports, the first Tuesday of every quarter. No marketing copy."
  @submit="onSubmit"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxSignupFeature">
      Newsletter signup block. Heading + dek + bordered email input +
      uppercase action button + consent line. Self-contained — no
      other components composed in. Right for footer-of-page CTA on
      marketing surfaces ("Subscribe to the quarterly bulletin").
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Neutral · quarterly bulletin</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxSignupFeature
          v-model="email"
          eyebrow="stay current"
          title="Quarterly research bulletin, in your inbox"
          dek="Three-paragraph summaries of our most-read reports, the first Tuesday of every quarter. No marketing copy, no upsell."
          @submit="(v) => (lastSubmitted = v)"
        />
      </TuxExample>
      <p v-if="lastSubmitted" class="mt-3 font-mono text-xs text-text-muted">
        last submitted: <code>{{ lastSubmitted }}</code>
      </p>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Neutral / maroon / gold</h2>
      <p class="text-sm text-text-secondary mb-3">
        <strong>Neutral</strong> sits softly in a content column.
        <strong>Maroon</strong> is the loud "stop and subscribe" call —
        use sparingly. <strong>Gold</strong> is friendly, dark text on
        warm yellow — right for partner-facing or alumni-facing
        signups.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxSignupFeature
            tone="neutral"
            eyebrow="bulletin"
            title="Quarterly research bulletin"
            dek="Three-paragraph summaries, the first Tuesday of every quarter."
          />
          <TuxSignupFeature
            tone="maroon"
            eyebrow="alerts"
            title="Get notified when new findings publish"
            dek="One email per major release. Used for safety bulletins, policy briefs, and major dataset updates."
          />
          <TuxSignupFeature
            tone="gold"
            eyebrow="alumni"
            title="Stay connected"
            dek="Annual update for TTI alumni, sponsors, and former graduate assistants."
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant heading face</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default = Oswald uppercase italic. Bold = Work Sans 800. Elegant
        = Georgia italic.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxSignupFeature
            variant="bold"
            eyebrow="bold style"
            title="Athletic-tone signup"
            dek="Right for marketing splashes and event-page sign-ups."
          />
          <TuxSignupFeature
            variant="elegant"
            eyebrow="elegant style"
            title="Editorial signup"
            dek="Right for research bulletins, policy briefs, and faculty-newsletter signups."
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + events</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>title</code> — heading. Required.</li>
        <li><code>eyebrow</code>, <code>dek</code> — optional text rhythm.</li>
        <li><code>actionLabel</code> — button label. Defaults to <code>"Subscribe"</code>.</li>
        <li><code>placeholder</code> — input placeholder. Defaults to <code>"your@email.edu"</code>.</li>
        <li><code>consent</code> — privacy line below the form. Has a sensible default.</li>
        <li><code>v-model</code> — email value.</li>
        <li><code>tone</code> — <code>"neutral" | "maroon" | "gold"</code>. Defaults to <code>"neutral"</code>.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>.</li>
        <li>Emits <code>@submit</code> with the trimmed email value.</li>
      </ul>
    </section>
  </div>
</template>
