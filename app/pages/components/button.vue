<script setup lang="ts">
// Vite ?raw import — the SFC's file contents become a string at build time
// so the `Source` tab below can expose the component without duplication.
import tuxButtonSource from "~/components/TuxButton.vue?raw";

useHead({ title: "TuxButton · TUX" });

const loading = ref(false);

function simulateWork() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 2000);
}

const intents = ["primary", "secondary", "ghost", "destructive"] as const;
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const intentsVue = `<tux-button intent="primary">Primary</tux-button>
<tux-button intent="secondary">Secondary</tux-button>
<tux-button intent="ghost">Ghost</tux-button>
<tux-button intent="destructive">Destructive</tux-button>`;

const iconsVue = `<tux-button intent="primary" icon="lucide:play">Run</tux-button>
<tux-button intent="secondary" icon="lucide:download">Export CSV</tux-button>
<tux-button intent="ghost" trailing-icon="lucide:arrow-right">Next</tux-button>
<tux-button intent="destructive" icon="lucide:trash-2">Delete</tux-button>`;

const statesVue = `<tux-button intent="primary" :loading="isLoading" icon="lucide:refresh-cw">
  {{ isLoading ? "Working…" : "Reload" }}
</tux-button>
<tux-button intent="secondary" disabled>Disabled</tux-button>
<tux-button intent="destructive" disabled>Disabled destructive</tux-button>`;

const sizesVue = `<tux-button intent="primary" size="xs">Size xs</tux-button>
<tux-button intent="primary" size="sm">Size sm</tux-button>
<tux-button intent="primary" size="md">Size md</tux-button>
<tux-button intent="primary" size="lg">Size lg</tux-button>
<tux-button intent="primary" size="xl">Size xl</tux-button>`;

const linkVue = `<tux-button intent="primary" to="/tokens" trailing-icon="lucide:arrow-right">
  Browse tokens
</tux-button>
<tux-button intent="secondary" to="/components" icon="lucide:layers">
  All components
</tux-button>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxButton">
      Wraps <code>UButton</code>. The <code>intent</code> prop picks one of four
      TTI-conventional combinations — <code>primary</code>, <code>secondary</code>,
      <code>ghost</code>, <code>destructive</code> — so call sites don't have to
      remember that "destructive" means <code>outline + error + btn-fill-on-hover</code>.
      Every other <code>UButton</code> prop still works (<code>size</code>,
      <code>icon</code>, <code>loading</code>, <code>to</code>, <code>disabled</code>).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">intents</p>
      <h2 class="heading--bold text-xl font-bold">Four semantic roles</h2>
      <TuxExample class="mt-4" :vue="intentsVue" :source="tuxButtonSource">
        <div class="flex flex-wrap gap-3">
          <TuxButton v-for="i in intents" :key="i" :intent="i" class="capitalize">
            {{ i }}
          </TuxButton>
        </div>
      </TuxExample>
      <p class="mt-3 text-sm text-text-secondary">
        Hover the destructive button — outline fills solid red with white text.
      </p>
    </section>

    <section>
      <p class="eyebrow">with icon</p>
      <h2 class="heading--bold text-xl font-bold">Leading &amp; trailing icons</h2>
      <TuxExample class="mt-4" :vue="iconsVue">
        <div class="flex flex-wrap gap-3">
          <TuxButton intent="primary" icon="lucide:play">Run</TuxButton>
          <TuxButton intent="secondary" icon="lucide:download">Export CSV</TuxButton>
          <TuxButton intent="ghost" trailing-icon="lucide:arrow-right">Next</TuxButton>
          <TuxButton intent="destructive" icon="lucide:trash-2">Delete</TuxButton>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">states</p>
      <h2 class="heading--bold text-xl font-bold">Loading &amp; disabled</h2>
      <TuxExample class="mt-4" :vue="statesVue">
        <div class="flex flex-wrap gap-3">
          <TuxButton intent="primary" :loading="loading" icon="lucide:refresh-cw" @click="simulateWork">
            {{ loading ? "Working…" : "Click to load for 2s" }}
          </TuxButton>
          <TuxButton intent="secondary" disabled>Disabled</TuxButton>
          <TuxButton intent="destructive" disabled>Disabled destructive</TuxButton>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">sizes</p>
      <h2 class="heading--bold text-xl font-bold">All sizes</h2>
      <TuxExample class="mt-4" :vue="sizesVue">
        <div class="flex flex-wrap gap-3 items-center">
          <TuxButton v-for="s in sizes" :key="s" intent="primary" :size="s">
            Size {{ s }}
          </TuxButton>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">as link</p>
      <h2 class="heading--bold text-xl font-bold">With `to` prop</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>to</code> and TuxButton renders as <code>NuxtLink</code> under the hood.
      </p>
      <TuxExample :vue="linkVue">
        <div class="flex flex-wrap gap-3">
          <TuxButton intent="primary" to="/tokens" trailing-icon="lucide:arrow-right">
            Browse tokens
          </TuxButton>
          <TuxButton intent="secondary" to="/components" icon="lucide:layers">
            All components
          </TuxButton>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
