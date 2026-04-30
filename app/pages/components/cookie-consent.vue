<script setup lang="ts">
useHead({ title: "TuxCookieConsent · TUX" });

const decision = ref<string | null>(null);
const showDemo = ref(false);

function reset() {
  try {
    localStorage.removeItem("tux-cookie-consent-demo");
  } catch { /* ignore */ }
  decision.value = null;
  showDemo.value = false;
  nextTick(() => (showDemo.value = true));
}

function onDecision(d: "accepted" | "rejected" | "custom") {
  decision.value = d;
}

const basicVue = `<tux-cookie-consent @decision="onDecision" />`;

const customVue = `<tux-cookie-consent>
  <template #categories>
    <div class="space-y-2">
      <label class="flex items-center gap-2">
        <input type="checkbox" checked disabled />
        <span>Necessary (always on)</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="analytics" />
        <span>Analytics \u2014 Plausible, anonymized.</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="marketing" />
        <span>Marketing \u2014 conversion attribution.</span>
      </label>
    </div>
  </template>
</tux-cookie-consent>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="banners & tags" title="TuxCookieConsent">
      Bottom-right floating card (or bottom strip) with the
      privacy notice required on public TTI surfaces. Persists the
      decision in <code>localStorage</code>; emits
      <code>decision</code> for consumers wiring analytics gating.
      Compose per-category toggles via the <code>#categories</code>
      slot — the component is the surface, the host owns categories.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">demo</p>
      <h2 class="heading--bold text-xl font-bold">Try it</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Click "Show demo" to render a notice keyed to a separate
        storage slot (<code>tux-cookie-consent-demo</code>). Reset
        clears the slot and re-shows the prompt.
      </p>
      <div class="mt-4 flex items-center gap-3">
        <TuxButton intent="primary" icon="lucide:cookie" @click="showDemo = true">
          Show demo
        </TuxButton>
        <TuxButton intent="ghost" icon="lucide:rotate-ccw" @click="reset">
          Reset stored decision
        </TuxButton>
        <code v-if="decision" class="font-mono text-sm">last decision: <strong>{{ decision }}</strong></code>
      </div>

      <Teleport to="body">
        <TuxCookieConsent
          v-if="showDemo"
          storage-key="tux-cookie-consent-demo"
          @decision="onDecision"
        />
      </Teleport>
    </section>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Default placement</h2>
      <TuxExample :vue="basicVue">
        <p class="text-sm text-text-muted italic">
          Renders into <code>&lt;body&gt;</code> via Teleport — see the
          live demo above instead of a card preview.
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom categories</p>
      <h2 class="heading--bold text-xl font-bold">With per-category toggles</h2>
      <TuxExample :vue="customVue">
        <p class="text-sm text-text-muted italic">
          Pass a <code>#categories</code> slot to render checkboxes
          for analytics / marketing / etc. The "Customize preferences"
          link expands the slot in place.
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">Posture</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li>Necessary cookies are implicitly accepted — no toggle.</li>
        <li>This component is a surface; analytics / marketing wiring lives in the host app.</li>
        <li>The decision persists in <code>localStorage</code>; no cookie is set by the consent prompt itself.</li>
        <li>Compatible with the TAMUS digital-accessibility policy linked in the unified TuxFooter legal strip.</li>
      </ul>
    </section>
  </div>
</template>
