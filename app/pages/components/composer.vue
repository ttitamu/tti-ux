<script setup lang="ts">
useHead({ title: "TuxComposer · TUX" });

const text = ref("");
const compliantText = ref("");

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
  </div>
</template>
