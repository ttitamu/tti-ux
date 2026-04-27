<script setup lang="ts">
useHead({ title: "TuxContactCard · tti-ux" });

const directory = [
  {
    name: "Lina Hassan",
    credentials: "Ph.D., P.E.",
    role: "Principal Investigator",
    affiliation: "Connected & Automated Vehicles Program",
    tone: "maroon" as const,
    contacts: [
      { type: "email" as const, value: "lhassan@tti.tamu.edu" },
      { type: "phone" as const, value: "(979) 317-2104" },
      { type: "office" as const, value: "Building 4202, Room 314" },
    ],
  },
  {
    name: "Marcus Reilly",
    role: "Field Research Coordinator",
    affiliation: "Roadway Safety Group",
    tone: "navy" as const,
    contacts: [
      { type: "email" as const, value: "mreilly@tti.tamu.edu" },
      { type: "phone" as const, value: "(979) 317-2218" },
    ],
  },
  {
    name: "Imani Park",
    credentials: "Ph.D.",
    role: "Director",
    affiliation: "Center for Transportation Equity",
    tone: "gold" as const,
    contacts: [
      { type: "email" as const, value: "ipark@tti.tamu.edu" },
      { type: "web" as const, value: "https://equity.tti.tamu.edu" },
      { type: "office" as const, value: "CTE Building, Suite 110" },
    ],
  },
];

const exampleVue = `<TuxContactCard
  name="Lina Hassan"
  credentials="Ph.D., P.E."
  role="Principal Investigator"
  affiliation="Connected & Automated Vehicles Program"
  tone="maroon"
  :contacts="[
    { type: 'email', value: 'lhassan@tti.tamu.edu' },
    { type: 'phone', value: '(979) 317-2104' },
    { type: 'office', value: 'Building 4202, Room 314' },
  ]"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxContactCard">
      Faculty / staff directory card. One person, one card, with portrait
      + name + credentials + role + affiliation + typed contact rows.
      Two layouts: <strong>vertical</strong> (portrait above, default —
      best for grid directory pages) and <strong>horizontal</strong>
      (portrait left, inline-friendly). Compose multiple in a grid for
      directory pages.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Vertical · directory grid</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TuxContactCard
            v-for="person in directory"
            :key="person.name"
            v-bind="person"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">horizontal</p>
      <h2 class="heading--bold text-xl font-bold">Inline directory</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="horizontal"</code>. Right for inline content
        and sidebar lists where vertical cards would feel out of place.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-3 max-w-2xl">
          <TuxContactCard
            v-for="person in directory"
            :key="person.name"
            v-bind="person"
            layout="horizontal"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">contact types</p>
      <h2 class="heading--bold text-xl font-bold">email / phone / web / office / location</h2>
      <p class="text-sm text-text-secondary mb-3">
        Each contact has a <code>type</code>. Email + phone get the right
        protocol prefix automatically (<code>mailto:</code>,
        <code>tel:</code>). Office and location render as plain text;
        web renders as an external link.
      </p>
      <TuxExample class="mt-4">
        <div class="max-w-md">
          <TuxContactCard
            name="Sarah Okonkwo"
            role="Senior Data Engineer"
            affiliation="MovementLab"
            tone="navy"
            :contacts="[
              { type: 'email',    value: 'sokonkwo@tti.tamu.edu' },
              { type: 'phone',    value: '(979) 317-2531' },
              { type: 'web',      value: 'https://movementlab.tti.tamu.edu/staff/sarah-okonkwo' },
              { type: 'office',   value: 'MovementLab Building, Room 218' },
              { type: 'location', value: 'College Station, TX' },
            ]"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>name</code> — display name. Required.</li>
        <li><code>credentials</code>, <code>role</code>, <code>affiliation</code> — optional header lines.</li>
        <li><code>image</code> — portrait URL. If omitted, renders an initial-based gradient placeholder.</li>
        <li><code>initial</code> — character for the placeholder. Defaults to first letter of <code>name</code>.</li>
        <li><code>tone</code> — <code>"maroon" | "gold" | "navy"</code>. Placeholder gradient color.</li>
        <li><code>contacts</code> — array of <code>{ type, value, label? }</code>. Types: <code>email | phone | web | office | location</code>.</li>
        <li><code>layout</code> — <code>"vertical" | "horizontal"</code>. Defaults to <code>"vertical"</code>.</li>
      </ul>
    </section>
  </div>
</template>
