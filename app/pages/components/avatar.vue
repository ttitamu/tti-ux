<script setup lang="ts">
import tuxAvatarSource from "~/components/TuxAvatar.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxAvatar · TUX" });

const avatarControls: TuxPropControl[] = [
  {
    prop: "name",
    label: "Display Name",
    type: "text",
    defaultValue: "Ramona Delgado",
    description: "Initials automatically derive from first two words",
  },
  {
    prop: "size",
    label: "Avatar Size",
    type: "select",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
  },
  {
    prop: "dot",
    label: "Status Indicator Dot",
    type: "select",
    options: [
      { label: "None", value: "" },
      { label: "Success (Online)", value: "success" },
      { label: "Warning (Away)", value: "warning" },
      { label: "Error (Busy)", value: "error" },
      { label: "Info (In Meeting)", value: "info" },
    ],
    defaultValue: "success",
  },
  {
    prop: "photoUrl",
    label: "Photo URL",
    type: "text",
    defaultValue: "",
    description: "Falls back to initials if broken or empty",
  },
  {
    prop: "initials",
    label: "Initials Override",
    type: "text",
    defaultValue: "",
  },
];

const avatarPresets: TuxPlaygroundPreset[] = [
  {
    name: "researcher-active",
    label: "Active Researcher",
    description: "Medium profile avatar with online presence indicator",
    icon: "lucide:user-check",
    values: {
      name: "Ramona Delgado",
      size: "md",
      dot: "success",
      photoUrl: "",
      initials: "",
    },
  },
  {
    name: "executive-lead",
    label: "Executive Director",
    description: "Large profile avatar for headers and publications",
    icon: "lucide:award",
    values: {
      name: "Wei Chen",
      size: "lg",
      dot: "info",
      photoUrl: "",
      initials: "",
    },
  },
  {
    name: "dense-table-user",
    label: "Dense Data Grid Row",
    description: "Compact small avatar for table rows and timelines",
    icon: "lucide:table-2",
    values: {
      name: "Priya Nair",
      size: "sm",
      dot: "",
      photoUrl: "",
      initials: "",
    },
  },
];

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

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-avatar"
        component-name="TuxAvatar"
        title="TuxAvatar Workbench"
        eyebrow="Interactive Component Playground"
        :controls="avatarControls"
        :presets="avatarPresets"
        :source="tuxAvatarSource"
      >
        <template #default="{ values }">
          <div class="flex items-center gap-4">
            <TuxAvatar
              :name="values.name"
              :size="values.size"
              :dot="values.dot || undefined"
              :photo-url="values.photoUrl || undefined"
              :initials="values.initials || undefined"
            />
            <div class="text-left">
              <p class="text-sm font-bold text-text-primary">{{ values.name }}</p>
              <p class="text-xs text-text-secondary font-mono">Status: {{ values.dot || 'Offline' }}</p>
            </div>
          </div>
        </template>
      </TuxPlayground>
    </section>

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
