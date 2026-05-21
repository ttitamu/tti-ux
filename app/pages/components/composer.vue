<script setup lang="ts">
useHead({ title: "TuxComposer · TUX" });

const text = ref("");
const compliantText = ref("");
const cancelableText = ref("");

const models = [
  { value: "haiku-4.5", label: "anthropic/haiku-4.5" },
  { value: "sonnet-4",  label: "anthropic/sonnet-4" },
  { value: "llama-3-70b-tti", label: "llama-3-70b-tti (on-prem)" },
];

const basicVue = `<tux-composer
  v-model="text"
  :models="models"
  placeholder="Ask about any ingested corpus…"
  @submit="handleSend"
/>`;

const complianceVue = `<tux-composer
  v-model="text"
  :models="models"
  placeholder="Restricted-corpus query…"
  @submit="handleSend"
>
  <template #scope>
    <tux-alert variant="compliance" icon="lucide:shield-alert">
      <strong>Restricted corpus.</strong> This conversation grounds
      against TTI-internal research data. Citations and model
      responses are logged to the audit trail.
    </tux-alert>
  </template>
</tux-composer>`;

const cancelableVue = `<!-- Wrapped in a modal / slideover. Cancelable
     surfaces an explicit [Cancel] [Send] pair so the user can back
     out without sending. The cancel button is ghost-intent; send
     stays primary. -->
<tux-composer
  v-model="text"
  cancelable
  cancel-label="Discard"
  placeholder="Reply to thread…"
  @submit="handleSend"
  @cancel="closeModal"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · chat" title="TuxComposer">
      Chat input with optional compliance scope banner. Two-zone layout
      (textarea + toolbar strip). The maroon 2px frame ties the
      composer back to the brand. Model picker and corpus-attach
      affordance are built in; both are optional.
      <br><br>
      <span class="text-sm text-text-muted">
        ⌘↵ submits. <code>v-model</code> binds the textarea value;
        <code>@submit</code> fires when the user sends.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Default composer</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxComposer
          v-model="text"
          :models="models"
          placeholder="Ask about any ingested corpus…"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">compliance</p>
      <h2 class="heading--bold text-xl font-bold">Scoped to a restricted corpus</h2>
      <TuxExample class="mt-4" :vue="complianceVue">
        <TuxComposer
          v-model="compliantText"
          :models="models"
          placeholder="Restricted-corpus query…"
        >
          <template #scope>
            <TuxAlert variant="compliance" icon="lucide:shield-alert">
              <strong>Restricted corpus.</strong> This conversation grounds
              against TTI-internal research data. Citations and model
              responses are logged to the audit trail.
            </TuxAlert>
          </template>
        </TuxComposer>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">cancelable</p>
      <h2 class="heading--bold text-xl font-bold">Composer wrapped in a modal</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>cancelable</code> to surface a ghost-intent
        <code>[Cancel]</code> button to the left of <code>[Send]</code>.
        Listen to <code>@cancel</code> to close the surrounding modal /
        slideover / inline edit. The <code>cancelLabel</code> prop swaps
        the button text — useful when "Discard" or "Close" reads better
        than "Cancel" in context.
      </p>
      <TuxExample class="mt-4" :vue="cancelableVue">
        <TuxComposer
          v-model="cancelableText"
          cancelable
          cancel-label="Discard"
          placeholder="Reply to thread…"
        />
      </TuxExample>
    </section>
  </div>
</template>
