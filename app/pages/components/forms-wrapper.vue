<script setup lang="ts">
useHead({ title: "Forms wrapper cluster · TUX" });

// TuxFormField demo state
const email = ref("");
const corpus = ref("");
const emailError = computed(() =>
  email.value && !email.value.includes("@") ? "Enter a valid email address." : ""
);

// TuxMarkdownEditor demo
const markdownDraft = ref("## Hypothesis\n\nThe **infrastructure-cue** hypothesis predicts that treatment effects _persist_ over time, whereas the novelty hypothesis predicts decay within 6-12 months.\n\n- Treated sites (n = 12)\n- Matched controls (n = 12)\n- 36-month follow-up");

// TuxFileDropzone demo
const uploadedFiles = ref<File[]>([]);

// TuxValidationSummary demo
const showSummary = ref(true);
const sampleErrors = [
  { fieldId: "fld-email", fieldLabel: "Email", message: "Enter a valid email address." },
  { fieldId: "fld-corpus", fieldLabel: "Corpus", message: "Pick a corpus to scope this session." },
  { fieldLabel: "Consent", message: "You must agree to the ITAR handling policy to continue." },
];

// TuxConfirmDialog demo
const confirmOpen = ref(false);
const confirmedAt = ref<string | null>(null);
function onConfirm() {
  confirmedAt.value = new Date().toLocaleTimeString();
  confirmOpen.value = false;
}
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · forms wrapper cluster" title="Forms wrapper">
      Five components that close the form-authoring gap. Label-help-
      input clusters, markdown editor (no Tiptap dependency),
      drag-and-drop uploads, top-of-form error summaries, and the
      blocking-confirm dialog preset.
    </TuxPageHeader>

    <section class="space-y-3">
      <p class="eyebrow">label + help + input + error</p>
      <h2 class="heading--bold text-xl font-bold">TuxFormField</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        The canonical label cluster. Slot scope exposes
        <code>inputId</code> + <code>describedBy</code> +
        <code>ariaInvalid</code> so consumer inputs inherit the
        right a11y attrs for free. Help popover via the info icon
        next to the label.
      </p>
      <div class="space-y-4 max-w-md">
        <TuxFormField
          label="Email"
          required
          help="We'll only use this to send session-recovery codes — no marketing email, no third-party sharing."
          hint="TTI / TAMUS addresses preferred."
          :error="emailError"
        >
          <template #default="{ inputId: id, ariaDescribedby, ariaInvalid, ariaRequired }">
            <UInput
              :id="id"
              v-model="email"
              type="email"
              :aria-describedby="ariaDescribedby"
              :aria-invalid="ariaInvalid"
              :aria-required="ariaRequired"
            />
          </template>
        </TuxFormField>

        <TuxFormField
          label="Corpus"
          required
          help="Sessions are scoped to a single corpus. Switch corpora via the ⌘K palette later."
          input-id="fld-corpus"
        >
          <template #default="{ inputId: id, ariaInvalid, ariaRequired }">
            <USelect
              :id="id"
              v-model="corpus"
              :items="['grants-2024-2026', 'movementlab-2024', 'publications-2025']"
              placeholder="Select a corpus…"
              :aria-invalid="ariaInvalid"
              :aria-required="ariaRequired"
            />
          </template>
        </TuxFormField>
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">markdown editor · no deps</p>
      <h2 class="heading--bold text-xl font-bold">TuxMarkdownEditor</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Lightweight markdown authoring — no Tiptap, no rich-text
        WYSIWYG. Toolbar + keyboard shortcuts (⌘B / ⌘I / ⌘K / ⌘E) +
        Tab indent + preview toggle (rendered via MDC) + char + word
        count footer.
      </p>
      <TuxMarkdownEditor
        v-model="markdownDraft"
        :rows="10"
        :min-length="40"
        :max-length="4000"
      />
    </section>

    <section class="space-y-3">
      <p class="eyebrow">drag-and-drop uploads</p>
      <h2 class="heading--bold text-xl font-bold">TuxFileDropzone</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Branded drop target with hover + drag highlights. Drag a
        file (or click) to select; multi-file mode with max-count
        + max-size enforcement; selected files render below with
        per-file remove. Keyboard-accessible (Enter / Space).
      </p>
      <TuxFileDropzone
        v-model="uploadedFiles"
        multiple
        :max-files="5"
        :max-size="10 * 1024 * 1024"
        accept=".csv,.json,.parquet,.geojson"
        hint="Drop CSV / JSON / Parquet / GeoJSON files to import into the corpus."
      />
    </section>

    <section class="space-y-3">
      <p class="eyebrow">top-of-form error summary</p>
      <h2 class="heading--bold text-xl font-bold">TuxValidationSummary</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Surfaces all form errors at the top so the user doesn't
        miss any. Click an error to jump to the field that produced
        it (uses the field's <code>id</code>). Renders nothing when
        the errors list is empty.
      </p>
      <div class="flex items-center gap-2 mb-2">
        <UButton size="xs" variant="outline" @click="showSummary = !showSummary">
          {{ showSummary ? "Hide" : "Show" }} sample errors
        </UButton>
      </div>
      <TuxValidationSummary v-if="showSummary" :errors="sampleErrors" />
      <p v-else class="text-sm text-text-muted italic">Summary hidden — no errors.</p>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">destructive-action confirmation</p>
      <h2 class="heading--bold text-xl font-bold">TuxConfirmDialog</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        TuxModal preset with a tight Cancel + destructive-confirm
        footer. Four variants — destructive / danger / primary /
        warning — auto-pick the right button intent + default
        label.
      </p>
      <div class="flex items-center gap-2 flex-wrap">
        <TuxButton intent="destructive" icon="lucide:trash-2" @click="confirmOpen = true">
          Revoke API key…
        </TuxButton>
        <p v-if="confirmedAt" class="text-xs text-text-muted">Last confirmed at {{ confirmedAt }}</p>
      </div>
      <TuxConfirmDialog
        v-model:open="confirmOpen"
        title="Revoke API key?"
        eyebrow="Destructive action"
        confirm-label="Revoke"
        variant="destructive"
        @confirm="onConfirm"
      >
        <p>
          Revoking <code>cls-204-prod-key-04</code> will immediately
          stop all production traffic using it. Active sessions
          continue until they refresh; new requests fail with 401.
        </p>
        <p>This can't be undone — you'll need to mint a new key.</p>
      </TuxConfirmDialog>
    </section>
  </div>
</template>
