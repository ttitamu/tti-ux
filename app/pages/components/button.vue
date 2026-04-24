<script setup lang="ts">
useHead({ title: "TuxButton · tti-ux" });

const loading = ref(false);

function simulateWork() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 2000);
}

const intents = ["primary", "secondary", "ghost", "destructive"] as const;
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">component</p>
      <h1 class="heading--bold text-3xl font-bold">TuxButton</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        Wraps <code>UButton</code>. The <code>intent</code> prop picks one of four
        TTI-conventional combinations — <code>primary</code>, <code>secondary</code>,
        <code>ghost</code>, <code>destructive</code> — so call sites don't have to
        remember that "destructive" means <code>outline + error + btn-fill-on-hover</code>.
        Every other <code>UButton</code> prop still works (<code>size</code>,
        <code>icon</code>, <code>loading</code>, <code>to</code>, <code>disabled</code>).
      </p>
    </section>

    <section>
      <p class="eyebrow">intents</p>
      <h2 class="heading--bold text-xl font-bold">Four semantic roles</h2>
      <div class="mt-4 flex flex-wrap gap-3">
        <TuxButton v-for="i in intents" :key="i" :intent="i" class="capitalize">
          {{ i }}
        </TuxButton>
      </div>
      <p class="mt-3 text-sm text-text-secondary">
        Hover the destructive button — outline fills solid red with white text.
      </p>
    </section>

    <section>
      <p class="eyebrow">with icon</p>
      <h2 class="heading--bold text-xl font-bold">Leading &amp; trailing icons</h2>
      <div class="mt-4 flex flex-wrap gap-3">
        <TuxButton intent="primary" icon="lucide:play">Start scan</TuxButton>
        <TuxButton intent="secondary" icon="lucide:download">Export CSV</TuxButton>
        <TuxButton intent="ghost" trailing-icon="lucide:arrow-right">Next</TuxButton>
        <TuxButton intent="destructive" icon="lucide:trash-2">Delete</TuxButton>
      </div>
    </section>

    <section>
      <p class="eyebrow">states</p>
      <h2 class="heading--bold text-xl font-bold">Loading &amp; disabled</h2>
      <div class="mt-4 flex flex-wrap gap-3">
        <TuxButton intent="primary" :loading="loading" icon="lucide:refresh-cw" @click="simulateWork">
          {{ loading ? "Working…" : "Click to load for 2s" }}
        </TuxButton>
        <TuxButton intent="secondary" disabled>Disabled</TuxButton>
        <TuxButton intent="destructive" disabled>Disabled destructive</TuxButton>
      </div>
    </section>

    <section>
      <p class="eyebrow">sizes</p>
      <h2 class="heading--bold text-xl font-bold">All sizes</h2>
      <div class="mt-4 flex flex-wrap gap-3 items-center">
        <TuxButton v-for="s in sizes" :key="s" intent="primary" :size="s">
          Size {{ s }}
        </TuxButton>
      </div>
    </section>

    <section>
      <p class="eyebrow">as link</p>
      <h2 class="heading--bold text-xl font-bold">With `to` prop</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>to</code> and TuxButton renders as <code>NuxtLink</code> under the hood.
      </p>
      <div class="flex flex-wrap gap-3">
        <TuxButton intent="primary" to="/tokens" trailing-icon="lucide:arrow-right">
          Browse tokens
        </TuxButton>
        <TuxButton intent="secondary" to="/components" icon="lucide:layers">
          All components
        </TuxButton>
      </div>
    </section>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Source</h2>
      <pre v-pre class="mt-3 p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border"><code>&lt;tux-button intent="primary" icon="lucide:play"&gt;Start scan&lt;/tux-button&gt;
&lt;tux-button intent="secondary" icon="lucide:download"&gt;Export&lt;/tux-button&gt;
&lt;tux-button intent="ghost"&gt;Close&lt;/tux-button&gt;
&lt;tux-button intent="destructive" icon="lucide:trash-2"&gt;Delete&lt;/tux-button&gt;</code></pre>
    </section>
  </div>
</template>
