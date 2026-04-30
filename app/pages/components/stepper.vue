<script setup lang="ts">
useHead({ title: "TuxStepper · TUX" });

const irbSteps = [
  { label: "Project info",       description: "Title, sponsor, IRB protocol number" },
  { label: "Personnel",          description: "PIs, co-investigators, training records" },
  { label: "Methods",            description: "Study design, data sources, analysis" },
  { label: "Risks & consent",    description: "Subject risk profile, consent flow" },
  { label: "Documents",          description: "Protocol PDF, instruments, IRB letters" },
  { label: "Review & submit",    description: "Final check, e-signature" },
];

const fundingSteps = [
  { label: "Sponsor",  description: "TxDOT \u00b7 FHWA \u00b7 NSF \u00b7 other" },
  { label: "Budget",   description: "Direct + indirect costs" },
  { label: "Approvals", status: "error" as const, description: "Department head sign-off failed" },
  { label: "Submit",   description: "Send to sponsored research office" },
];

const horizontalVue = `<tux-stepper
  :steps="[
    { label: 'Project info',     description: 'Title, sponsor, IRB protocol number' },
    { label: 'Personnel',        description: 'PIs, co-investigators, training' },
    { label: 'Methods',          description: 'Study design, data sources' },
    { label: 'Risks & consent',  description: 'Subject risk profile' },
    { label: 'Documents',        description: 'Protocol PDF, instruments' },
    { label: 'Review & submit',  description: 'Final check, e-signature' },
  ]"
  :current-index="2"
/>`;

const verticalVue = `<tux-stepper orientation="vertical" :steps="irbSteps" :current-index="2" />`;

const errorVue = `<tux-stepper
  :steps="[
    { label: 'Sponsor',   description: 'TxDOT \u00b7 FHWA \u00b7 NSF \u00b7 other' },
    { label: 'Budget',    description: 'Direct + indirect costs' },
    { label: 'Approvals', status: 'error', description: 'Department head sign-off failed' },
    { label: 'Submit',    description: 'Send to sponsored research office' },
  ]"
  :current-index="2"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="status states" title="TuxStepper">
      Numbered-circle multi-step indicator. Use for funding-application
      flows, IRB submissions, study onboarding, or any "you are here in
      a known sequence" pattern. Status (done · active · todo · error)
      derives from <code>currentIndex</code>; per-step override available.
      <br><br>
      <span class="text-sm text-text-muted">
        Container-query aware — horizontal collapses to vertical below
        ~30rem container width, regardless of viewport.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">horizontal</p>
      <h2 class="heading--bold text-xl font-bold">IRB protocol submission · step 3 of 6</h2>
      <TuxExample class="mt-4" :vue="horizontalVue">
        <TuxStepper :steps="irbSteps" :current-index="2" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">vertical</p>
      <h2 class="heading--bold text-xl font-bold">Stacked layout</h2>
      <TuxExample class="mt-4" :vue="verticalVue">
        <div class="max-w-md">
          <TuxStepper orientation="vertical" :steps="irbSteps" :current-index="2" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">per-step status override</p>
      <h2 class="heading--bold text-xl font-bold">Error step</h2>
      <TuxExample class="mt-4" :vue="errorVue">
        <TuxStepper :steps="fundingSteps" :current-index="2" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="heading--bold text-lg font-bold">Nav landmark + aria-current</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        The stepper renders as a <code>&lt;nav&gt;</code> with
        <code>aria-label="Progress"</code> (overrideable). The active
        step carries <code>aria-current="step"</code>; status icons
        (check / x) are decorative — labels carry the semantics.
        Past/future steps can pass <code>to</code> to render as
        <code>NuxtLink</code> for jump-back navigation.
      </p>
    </section>
  </div>
</template>
