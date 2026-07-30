<script setup lang="ts">
import tuxStatusToastSource from "~/components/TuxStatusToast.vue?raw";

useHead({ title: "TuxStatusToast · TUX" });

const toast = useTuxToast();

// The literal "script" tags are split so the SFC compiler doesn't
// mistake them for this block's end.
const setupVue = [
  "<!-- app.vue / the shell — mount the host ONCE -->",
  "<TuxStatusToast />",
  "",
  "<!-- anywhere else — fire toasts from the composable -->",
  "<scr" + "ipt setup>",
  "const toast = useTuxToast();",
  'toast.success("Saved", "Corpus settings updated.");',
  "</scr" + "ipt>",
].join("\n");

const tonesVue = `const toast = useTuxToast();

toast.info("Reindex queued", "12,400 documents in scope.");
toast.success("Saved", "Corpus settings updated.");
toast.warning("Nearing quota", "87% of the monthly token budget used.");
// error tone is sticky (no auto-dismiss) until the user dismisses it
toast.error("Export failed", "The report service returned 502.");`;

const actionVue = `toast.show({
  title: "Policy archived",
  description: "\\"Stale-data retention\\" moved to the archive.",
  tone: "success",
  action: { label: "Undo", onClick: restorePolicy },
});`;

const tauriVue = `<!-- Tauri shells: when the window is hidden/unfocused, the same
     call ALSO fires an OS notification (guarded dynamic import of
     @tauri-apps/plugin-notification + notification:default capability;
     silent no-op on plain web). The in-page toast always renders. -->
toast.info("Model download complete", "gemma-4-e2b is ready to use.");`;

function fireAction() {
  toast.show({
    title: "Policy archived",
    description: "“Stale-data retention” moved to the archive.",
    tone: "success",
    action: { label: "Undo", onClick: () => toast.info("Restored", "Policy is active again.") },
  });
}
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxStatusToast">
      The transient-notification host + <code>useTuxToast()</code> bus.
      Mount the host once in the shell; fire from anywhere. Polite
      live-region semantics, error tones announce assertively and stick
      until dismissed, motion collapses under reduced-motion, and Tauri
      shells escalate to OS notifications when the window is unfocused.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">setup</p>
      <h2 class="heading--bold text-xl font-bold">One host, one bus</h2>
      <TuxExample class="mt-4" :vue="setupVue" :source="tuxStatusToastSource">
        <p class="text-sm text-text-secondary">
          This page mounts a live host — try the buttons below.
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Four tones, sticky errors</h2>
      <TuxExample class="mt-4" :vue="tonesVue" :source="tuxStatusToastSource">
        <div class="flex flex-wrap gap-2">
          <TuxButton intent="secondary" @click="toast.info('Reindex queued', '12,400 documents in scope.')">info</TuxButton>
          <TuxButton intent="secondary" @click="toast.success('Saved', 'Corpus settings updated.')">success</TuxButton>
          <TuxButton intent="secondary" @click="toast.warning('Nearing quota', '87% of the monthly token budget used.')">warning</TuxButton>
          <TuxButton intent="destructive" @click="toast.error('Export failed', 'The report service returned 502.')">error (sticky)</TuxButton>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">action</p>
      <h2 class="heading--bold text-xl font-bold">With an action</h2>
      <TuxExample class="mt-4" :vue="actionVue" :source="tuxStatusToastSource">
        <TuxButton intent="primary" @click="fireAction">Archive policy</TuxButton>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">desktop</p>
      <h2 class="heading--bold text-xl font-bold">Tauri escalation</h2>
      <TuxExample class="mt-4" :vue="tauriVue" :source="tuxStatusToastSource">
        <p class="text-sm text-text-secondary">
          Contract in
          <NuxtLink to="/design/tauri-bindings" class="link-tti">design/tauri-bindings.md</NuxtLink>
          — requires the <code>notification:default</code> capability.
        </p>
      </TuxExample>
    </section>

    <!-- No host here — the docs shell (app.vue) mounts <TuxStatusToast>
         once, exactly as a real app should. -->
  </div>
</template>
