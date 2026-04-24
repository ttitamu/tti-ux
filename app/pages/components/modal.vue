<script setup lang="ts">
useHead({ title: "TuxModal · tti-ux" });

const basic = ref(false);
const confirm = ref(false);
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
    </section>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Title + eyebrow</h2>
      <div class="mt-4">
        <UButton color="primary" @click="basic = true">Open basic modal</UButton>
        <TuxModal v-model:open="basic" eyebrow="action" title="Trigger new scan">
          <p class="text-text-secondary leading-relaxed">
            A basic modal with an eyebrow label above the title. The gold bar under
            the title is the aggieux signature — the same utility we use for
            section headings.
          </p>
        </TuxModal>
      </div>
    </section>

    <section>
      <p class="eyebrow">with footer</p>
      <h2 class="heading--bold text-xl font-bold">Confirm pattern</h2>
      <div class="mt-4">
        <UButton variant="outline" color="error" class="btn-fill-on-hover" @click="confirm = true">
          Delete index…
        </UButton>
        <TuxModal v-model:open="confirm" eyebrow="destructive action" title="Delete index?">
          <p class="text-text-secondary leading-relaxed">
            This will remove the OpenSearch index and its 12,402 documents. The
            underlying files are untouched — you can re-index anytime.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2 w-full">
              <UButton variant="ghost" color="neutral" @click="confirm = false">Cancel</UButton>
              <UButton color="error" @click="confirm = false">Delete</UButton>
            </div>
          </template>
        </TuxModal>
      </div>
    </section>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Source</h2>
      <pre class="mt-3 p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border"><code>&lt;tux-modal v-model:open="open" eyebrow="action" title="Trigger new scan"&gt;
  &lt;p&gt;Body content…&lt;/p&gt;
  &lt;template #footer&gt;
    &lt;UButton color="primary"&gt;Confirm&lt;/UButton&gt;
  &lt;/template&gt;
&lt;/tux-modal&gt;</code></pre>
    </section>
  </div>
</template>
