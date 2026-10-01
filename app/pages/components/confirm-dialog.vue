<script setup lang="ts">
/**
 * /components/confirm-dialog — Dedicated showcase for TuxConfirmDialog.
 */
useHead({ title: "TuxConfirmDialog · Components · TUX" });

const dialogOpen = ref(false);
const selectedVariant = ref<"destructive" | "primary" | "warning">("destructive");
const isAsyncLoading = ref(false);
const lastActionLog = ref<string | null>(null);

function triggerDialog(variant: "destructive" | "primary" | "warning") {
  selectedVariant.value = variant;
  dialogOpen.value = true;
}

function handleConfirm() {
  isAsyncLoading.value = true;
  setTimeout(() => {
    isAsyncLoading.value = false;
    dialogOpen.value = false;
    lastActionLog.value = `Action confirmed (${selectedVariant.value}) at ${new Date().toLocaleTimeString()}`;
  }, 1000);
}

const sampleVue = computed(() => `<TuxConfirmDialog
  v-model:open="isOpen"
  title="${selectedVariant.value === 'destructive' ? 'Revoke Research API Key?' : 'Promote Model to Production?'}"
  eyebrow="${selectedVariant.value === 'destructive' ? 'Destructive Action' : 'System Deployment'}"
  variant="${selectedVariant.value}"
  :loading="isLoading"
  @confirm="handleConfirm"
>
  This action cannot be undone. All active roadside sensors relying on this key
  will immediately drop connection.
</TuxConfirmDialog>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · actions & commands" title="TuxConfirmDialog">
      Blocking confirmation modal preset for high-impact or destructive actions.
      Standardizes cancel/confirm button intent, async loading states, and keyboard traps.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div>
        <p class="eyebrow">interactive showcase</p>
        <h2 class="heading--bold text-xl font-bold">Modal Variants</h2>
      </div>

      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-6">
        <p class="text-sm text-text-secondary">
          Click a button to trigger a dialog preset with preconfigured button intents and styling:
        </p>

        <div class="flex items-center gap-3 flex-wrap">
          <TuxButton
            intent="destructive"
            icon="lucide:trash-2"
            @click="triggerDialog('destructive')"
          >
            Revoke Key (Destructive)
          </TuxButton>

          <TuxButton
            intent="primary"
            icon="lucide:rocket"
            @click="triggerDialog('primary')"
          >
            Deploy Model (Primary)
          </TuxButton>

          <TuxButton
            intent="secondary"
            icon="lucide:alert-triangle"
            @click="triggerDialog('warning')"
          >
            Archive Dataset (Warning)
          </TuxButton>
        </div>

        <div v-if="lastActionLog" class="p-3 bg-surface-sunken rounded-lg border border-surface-border text-xs font-mono text-brand-primary">
          {{ lastActionLog }}
        </div>
      </div>
    </section>

    <!-- Actual Modal Component Instance -->
    <TuxConfirmDialog
      v-model:open="dialogOpen"
      :title="
        selectedVariant === 'destructive'
          ? 'Revoke Corridor Telemetry Key?'
          : selectedVariant === 'primary'
          ? 'Deploy Model to Production Edge?'
          : 'Archive Historical Sensor Telemetry?'
      "
      :eyebrow="
        selectedVariant === 'destructive'
          ? 'Destructive Action'
          : selectedVariant === 'primary'
          ? 'Production Release'
          : 'Data Retention'
      "
      :variant="selectedVariant"
      :loading="isAsyncLoading"
      @confirm="handleConfirm"
    >
      <p class="text-sm text-text-secondary">
        {{
          selectedVariant === 'destructive'
            ? 'Are you sure you want to revoke this API credential? Connected field equipment and ingest workers on I-35 will disconnect immediately.'
            : selectedVariant === 'primary'
            ? 'This will promote the model weights to 42 roadside processing units across the corridor.'
            : 'Archiving moves this dataset to cold storage. Retrieval times will increase from milliseconds to several hours.'
        }}
      </p>
    </TuxConfirmDialog>

    <!-- Code Snippet -->
    <section class="space-y-3">
      <p class="eyebrow">usage syntax</p>
      <h2 class="heading--bold text-xl font-bold">Code snippet</h2>
      <TuxCodeBlock :code="sampleVue" lang="vue" />
    </section>

    <!-- Props Table -->
    <section class="space-y-3">
      <p class="eyebrow">api reference</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Prop</th>
              <th class="p-3">Type</th>
              <th class="p-3">Default</th>
              <th class="p-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border font-mono text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">v-model:open</td>
              <td class="p-3 text-text-secondary">boolean</td>
              <td class="p-3 text-text-muted">false</td>
              <td class="p-3 font-sans text-text-secondary">Two-way visibility binding for the dialog modal.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">title</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Primary headline for the dialog.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">variant</td>
              <td class="p-3 text-text-secondary">"destructive" | "primary" | "warning"</td>
              <td class="p-3 text-text-muted">"destructive"</td>
              <td class="p-3 font-sans text-text-secondary">Controls button intent and default labels.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">loading</td>
              <td class="p-3 text-text-secondary">boolean</td>
              <td class="p-3 text-text-muted">false</td>
              <td class="p-3 font-sans text-text-secondary">Displays spinner on confirm button during async dispatch.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">confirmDisabled</td>
              <td class="p-3 text-text-secondary">boolean</td>
              <td class="p-3 text-text-muted">false</td>
              <td class="p-3 font-sans text-text-secondary">Disables confirm button (e.g. until confirmation keyword is typed).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
