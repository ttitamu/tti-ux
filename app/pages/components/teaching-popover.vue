<script setup lang="ts">
import tuxTeachingPopoverSource from "~/components/TuxTeachingPopover.vue?raw";

useHead({ title: "TuxTeachingPopover · TUX" });

const singleOpen = ref(false);
const tourOpen = ref(false);
const tourStep = ref(1);
const brandOpen = ref(false);

const tourSteps = [
  { title: "Attach a corpus", body: "Scope each session to a corpus so the model only sees the docs you've authorized. Click the attach button to pick one." },
  { title: "Ask anything", body: "Use the composer to ask in plain language. The model sees your prompt + the attached corpus." },
  { title: "Branch alternatives", body: "Click the ‹ N of M › nav inside any assistant message to cycle through response variants." },
  { title: "Export your work", body: "The transcript + any generated artifacts download with a single click — keeps research reproducible." },
];

const singleVue = `<tux-teaching-popover
  v-model="open"
  title="New feature"
  primary-label="Got it"
  no-secondary
>
  Single-step teaching popovers anchor to a UI affordance and dismiss
  with one primary action.
</tux-teaching-popover>`;

const tourVue = `<tux-teaching-popover
  v-model="tourOpen"
  v-model:step="tourStep"
  :total-steps="4"
  :title="tourSteps[tourStep - 1].title"
  @finish="tourOpen = false"
  @skip="tourOpen = false"
>
  {{ tourSteps[tourStep - 1].body }}
</tux-teaching-popover>`;

const brandVue = `<tux-teaching-popover
  v-model="open"
  title="Important announcement"
  on-brand
  primary-label="Acknowledge"
  no-secondary
>
  Brand-tinted variant draws more attention — reserve for security
  notices, mandatory acknowledgments, or critical onboarding moments.
</tux-teaching-popover>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxTeachingPopover">
      Onboarding / guided-tour tooltip. Distinguished from
      <code>UTooltip</code> (passive hover help) by the guided-flow
      affordances: optional header image, body, Next / Skip footer, and
      an explicit step counter. Default-anchored bottom-right of the
      viewport; consumers can wire to a specific affordance with their
      own positioning library.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">single-step</p>
      <h2 class="heading--bold text-xl font-bold">One popover, one dismiss</h2>
      <p class="text-sm text-text-secondary mb-3">
        Use a single popover (no counter, no Skip) when teaching one
        feature in context — a new menu item, a recently-added
        affordance.
      </p>
      <TuxExample :vue="singleVue" :source="tuxTeachingPopoverSource">
        <TuxButton intent="primary" @click="singleOpen = true">
          Show single popover
        </TuxButton>
        <TuxTeachingPopover
          v-model="singleOpen"
          title="New feature"
          primary-label="Got it"
          no-secondary
        >
          Single-step teaching popovers anchor to a UI affordance and
          dismiss with one primary action.
        </TuxTeachingPopover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">multi-step tour</p>
      <h2 class="heading--bold text-xl font-bold">Guided onboarding</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:total-steps</code> &gt; 1 to show the counter and
        Next / Skip buttons. v-model both the open state and the current
        step.
      </p>
      <TuxExample :vue="tourVue">
        <TuxButton intent="primary" @click="tourOpen = true; tourStep = 1">
          Start 4-step tour
        </TuxButton>
        <TuxTeachingPopover
          v-model="tourOpen"
          v-model:step="tourStep"
          :total-steps="4"
          :title="tourSteps[tourStep - 1]?.title"
          @finish="tourOpen = false"
          @skip="tourOpen = false"
        >
          {{ tourSteps[tourStep - 1]?.body }}
        </TuxTeachingPopover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">brand-tinted</p>
      <h2 class="heading--bold text-xl font-bold">On-brand variant</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>on-brand</code> for higher emphasis — surface fills
        with brand maroon. Use sparingly: mandatory acknowledgments,
        security notices, top-of-funnel onboarding only.
      </p>
      <TuxExample :vue="brandVue">
        <TuxButton intent="primary" @click="brandOpen = true">
          Show brand-tinted popover
        </TuxButton>
        <TuxTeachingPopover
          v-model="brandOpen"
          title="Important announcement"
          on-brand
          primary-label="Acknowledge"
          no-secondary
        >
          Brand-tinted variant draws more attention — reserve for
          security notices, mandatory acknowledgments, or critical
          onboarding moments.
        </TuxTeachingPopover>
      </TuxExample>
    </section>
  </div>
</template>
