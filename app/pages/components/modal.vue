<script setup lang="ts">
useHead({ title: "TuxModal · tti-ux" });

const basic = ref(false);
const confirm = ref(false);

const basicVue = `<tux-button intent="primary" @click="open = true">Open basic modal</tux-button>
<tux-modal v-model:open="open" eyebrow="action" title="Trigger new scan">
  <p>A basic modal with an eyebrow label above the title. The gold bar under
     the title is the aggieux signature.</p>
</tux-modal>`;

const confirmVue = `<tux-button intent="destructive" icon="lucide:trash-2" @click="open = true">
  Delete index…
</tux-button>
<tux-modal v-model:open="open" eyebrow="destructive action" title="Delete index?">
  <p>This will remove the OpenSearch index and its 12,402 documents.
     The underlying files are untouched — you can re-index anytime.</p>
  <template #footer>
    <div class="flex justify-end gap-2 w-full">
      <tux-button intent="ghost" @click="open = false">Cancel</tux-button>
      <tux-button intent="destructive" @click="open = false">Delete</tux-button>
    </div>
  </template>
</tux-modal>`;
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">component</p>
      <h1 class="heading--bold text-3xl font-bold">TuxModal</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        Wraps <code>UModal</code>. Pass <code>title</code> (rendered with the gold-bar
        <code>heading--bold</code> utility) and an optional <code>eyebrow</code> for
        editorial rhythm. Body goes in the default slot; footer in <code>#footer</code>.
      </p>
      <p class="mt-2 max-w-2xl text-sm text-text-muted">
        Note: the HTML tab on this page captures the trigger button, not the modal
        itself — when closed, the modal doesn't exist in the DOM. Open it and
        inspect via browser devtools to see the full structure.
      </p>
    </section>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Title + eyebrow</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxButton intent="primary" @click="basic = true">Open basic modal</TuxButton>
        <TuxModal v-model:open="basic" eyebrow="action" title="Trigger new scan">
          <p class="text-text-secondary leading-relaxed">
            A basic modal with an eyebrow label above the title. The gold bar under
            the title is the aggieux signature — the same utility we use for
            section headings.
          </p>
        </TuxModal>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">with footer</p>
      <h2 class="heading--bold text-xl font-bold">Confirm pattern</h2>
      <TuxExample class="mt-4" :vue="confirmVue">
        <TuxButton intent="destructive" icon="lucide:trash-2" @click="confirm = true">
          Delete index…
        </TuxButton>
        <TuxModal v-model:open="confirm" eyebrow="destructive action" title="Delete index?">
          <p class="text-text-secondary leading-relaxed">
            This will remove the OpenSearch index and its 12,402 documents. The
            underlying files are untouched — you can re-index anytime.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2 w-full">
              <TuxButton intent="ghost" @click="confirm = false">Cancel</TuxButton>
              <TuxButton intent="destructive" @click="confirm = false">Delete</TuxButton>
            </div>
          </template>
        </TuxModal>
      </TuxExample>
    </section>
  </div>
</template>
