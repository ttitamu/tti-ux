<script setup lang="ts">
useHead({ title: "Date picker · Forms · TUX" });

const date = ref("");
const dueDate = ref("2026-06-30");
const start = ref("2026-04-01");
const end = ref("2026-04-30");

const today = new Date().toISOString().slice(0, 10);
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="forms · primitive" title="Date picker">
      Native date input with helper copy and min/max bounds.
      <code>UInput type="date"</code> renders the browser-native picker
      — accessible, keyboard-friendly, locale-aware, no custom popover
      to maintain. For richer date-range UI (calendar grid, presets),
      compose with <code>UInput</code> + a calendar widget; that's a
      heavier pattern not yet in the catalog.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Single date</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Default · empty">
          <UInput v-model="date" type="date" />
        </UFormField>
        <UFormField label="Pre-filled" help="ISO-8601 string accepted by `v-model`.">
          <UInput v-model="dueDate" type="date" />
        </UFormField>
        <UFormField label="With minimum" :help="`Must be on or after today (${today}).`">
          <UInput v-model="dueDate" type="date" :min="today" />
        </UFormField>
        <UFormField label="Read-only">
          <UInput model-value="2026-04-29" type="date" readonly />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">date range</p>
      <h2 class="heading--bold text-xl font-bold">Two-input pattern</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Start date">
          <UInput v-model="start" type="date" :max="end" />
        </UFormField>
        <UFormField label="End date" :help="`Must be on or after ${start || 'start date'}`">
          <UInput v-model="end" type="date" :min="start" />
        </UFormField>
      </div>
      <p class="mt-3 text-xs text-text-muted">
        Selected range: <code class="font-mono">{{ start }} → {{ end }}</code>
      </p>
    </section>

    <section>
      <p class="eyebrow">other date types</p>
      <h2 class="heading--bold text-xl font-bold">Time, datetime, month, week</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Time only" help="`type=time` for HH:MM input.">
          <UInput type="time" />
        </UFormField>
        <UFormField label="Date + time" help="`type=datetime-local`.">
          <UInput type="datetime-local" />
        </UFormField>
        <UFormField label="Month" help="`type=month`.">
          <UInput type="month" />
        </UFormField>
        <UFormField label="Week" help="`type=week`.">
          <UInput type="week" />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">Browser native vs. custom calendar</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Native pickers vary in look across browsers but win on
        accessibility (keyboard nav, screen-reader labels, locale
        handling) and zero JS. Reach for a custom calendar grid only
        when the UX needs presets ("last 30 days"), constrained
        ranges, or a designed mini-calendar inline.
      </p>
    </section>
  </div>
</template>
