<script setup lang="ts">
import tuxArtifactSource from "~/components/TuxArtifact.vue?raw";

useHead({ title: "TuxArtifact · TUX" });

const samplePy = `# Reproducibility script for the comparison above.
from tti_ai_studio import corpora, models

scope = corpora.load("grants-2024-2026")
for cls in ("CLS-204", "CLS-211"):
    m = models.classifier(cls)
    print(cls, m.evaluate(scope))
`;

const codeVue = `<tux-artifact
  title="compare.py"
  meta="Reproducibility script · python"
  icon="lucide:file-code"
>
  <tux-code-block :code="samplePy" lang="python" filename="compare.py" />
</tux-artifact>`;

const customActionsVue = `<tux-artifact
  title="findings.md"
  meta="Drafted just now"
  icon="lucide:file-text"
  :actions="['copy', 'download']"
>
  <template #actions>
    <button class="px-2 text-xs text-text-muted hover:text-brand-primary">
      Send to inbox →
    </button>
  </template>
  <div class="p-4 prose-tti">
    <p>Markdown draft body lives here.</p>
  </div>
</tux-artifact>`;

const busyVue = `<tux-artifact
  title="comparison.csv"
  meta="Regenerating…"
  icon="lucide:table"
  busy
>
  <div class="p-4 text-sm text-text-muted">Output replaced while busy.</div>
</tux-artifact>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxArtifact">
      Structured container for AI-generated output (code file, dataset,
      document, image). Header bundles title + meta + icon + a
      configurable action row (Copy / Download / Regenerate / Share);
      body slot holds whatever the model produced. Standalone — consumer
      decides whether to inline it after a chat message, dock it into a
      sidebar aside, or display it full-page.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Code artifact</h2>
      <p class="text-sm text-text-secondary mb-3">
        Wraps a <code>TuxCodeBlock</code> for the most common case — the
        model produced a Python / TS / SQL snippet that the user should
        be able to copy or download verbatim.
      </p>
      <TuxExample class="mt-4" :vue="codeVue" :source="tuxArtifactSource">
        <TuxArtifact
          title="compare.py"
          meta="Reproducibility script · python"
          icon="lucide:file-code"
        >
          <TuxCodeBlock :code="samplePy" lang="python" filename="compare.py" />
        </TuxArtifact>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom actions</p>
      <h2 class="heading--bold text-xl font-bold">Subset + extra buttons</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:actions="['copy', 'download']"</code> to show only
        the standard actions you want; the <code>#actions</code> slot
        appends custom buttons to the same row.
      </p>
      <TuxExample :vue="customActionsVue">
        <TuxArtifact
          title="findings.md"
          meta="Drafted just now"
          icon="lucide:file-text"
          :actions="['copy', 'download']"
        >
          <template #actions>
            <button class="px-2 text-xs text-text-muted hover:text-brand-primary">
              Send to inbox →
            </button>
          </template>
          <div class="p-4 text-sm">
            <p>Markdown draft body lives here.</p>
          </div>
        </TuxArtifact>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">busy</p>
      <h2 class="heading--bold text-xl font-bold">Regenerating state</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>busy</code> while the artifact is being regenerated
        — the regenerate icon spins, all actions disable, and
        <code>aria-busy</code> is set on the container.
      </p>
      <TuxExample :vue="busyVue">
        <TuxArtifact
          title="comparison.csv"
          meta="Regenerating…"
          icon="lucide:table"
          busy
        >
          <div class="p-4 text-sm text-text-muted">Output replaced while busy.</div>
        </TuxArtifact>
      </TuxExample>
    </section>
  </div>
</template>
