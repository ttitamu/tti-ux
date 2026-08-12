<script setup lang="ts">
import tuxAvatarSource from "~/components/TuxAvatar.vue?raw";

useHead({ title: "TuxAvatar · TUX" });

const basicVue = `<TuxAvatar name="Ramona Delgado" />
<TuxAvatar name="Wei Chen" size="lg" />
<TuxAvatar initials="TG" size="sm" />`;

const photoVue = `<!-- Photo when available; broken URLs fall back to initials. -->
<TuxAvatar name="Ramona Delgado" photo-url="/head-shot.jpg" />`;

const dotVue = `<TuxAvatar name="Wei Chen" dot="success" />
<TuxAvatar name="Priya Nair" dot="warning" size="lg" />`;

const standaloneVue = `<!-- Inside a labelled control (default): decorative, hidden from AT.
     Standing alone: give it the accessible name itself. -->
<TuxAvatar name="Ramona Delgado" :decorative="false" alt="Ramona Delgado" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxAvatar">
      The identity mark primitive — photo with initials fallback and an
      optional status dot. Extracted from TuxUserMenu (which now consumes
      it) so products stop re-deriving initials per app.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basics</p>
      <h2 class="heading--bold text-xl font-bold">Initials, three sizes</h2>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxAvatarSource">
        <div class="flex items-center gap-3">
          <TuxAvatar name="Ramona Delgado" />
          <TuxAvatar name="Wei Chen" size="lg" />
          <TuxAvatar initials="TG" size="sm" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">photo</p>
      <h2 class="heading--bold text-xl font-bold">Photo with fallback</h2>
      <TuxExample class="mt-4" :vue="photoVue" :source="tuxAvatarSource">
        <div class="flex items-center gap-3">
          <TuxAvatar name="Ramona Delgado" photo-url="/logo.svg" />
          <TuxAvatar name="Ramona Delgado" photo-url="/does-not-exist.jpg" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">status</p>
      <h2 class="heading--bold text-xl font-bold">Status dot</h2>
      <TuxExample class="mt-4" :vue="dotVue" :source="tuxAvatarSource">
        <div class="flex items-center gap-3">
          <TuxAvatar name="Wei Chen" dot="success" />
          <TuxAvatar name="Priya Nair" dot="warning" size="lg" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">a11y</p>
      <h2 class="heading--bold text-xl font-bold">Decorative by default</h2>
      <TuxExample class="mt-4" :vue="standaloneVue" :source="tuxAvatarSource">
        <TuxAvatar name="Ramona Delgado" :decorative="false" alt="Ramona Delgado" />
      </TuxExample>
    </section>
  </div>
</template>
